"use strict";

describe('Mortgage Calculator Input Tests', function () {
  beforeEach(function () {
    cy.visit('https://www.cooppank.ee/kodulaen');
    Cypress.on('uncaught:exception', function (err, runnable) {
      if (err.message.includes('$ is not a function')) {
        return false;
      }

      return true;
    });
    cy.window().should('have.property', 'document').then(function (document) {
      expect(document.readyState).to.eq('complete');
    });
    cy.get('#popup-buttons > .btn-primary').click();
  });
  it('Test minimal values', function () {
    cy.get('#edit-monthly-income').clear().type(1);
    cy.get('#edit-dependants-number').type(1);
    cy.get('#edit-total-blance-existing-loans').clear().type(1);
    cy.get('#edit-dependants-number').select('1');
    cy.get('#edit-period').invoke('attr', 'style', 'display: block !important').clear().type(15).invoke('attr', 'style', 'display: none !important');
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .js-form-type-textfield > .c-form-field > .slide-period > .slider-ammount').type(15);
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .month-income-low > .c-form-field > p').contains("Taotleja minimaalne netopalk peab olema 550 eurot");
  });
  it('Should show an error for empty monthly income field', function () {
    cy.get('#edit-monthly-income').clear().blur();
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .month-income-low > .c-form-field > p').contains("Taotleja minimaalne netopalk peab olema 550 eurot");
  });
  it('Should show an error for empty total balance existing loans field', function () {
    cy.get('#edit-monthly-income').clear().type(550);
    cy.get('#edit-total-blance-existing-loans').clear().type('1000000000').blur();
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .month-income-low > .c-form-field > p').invoke('text').should('not.be.empty');
  });
  it('Should be able to select each option', function () {
    var options = [0, 1, 2, 3, 4, 5];
    options.forEach(function (option) {
      cy.get('#edit-dependants-number').select("".concat(option)).should('have.value', "".concat(option));
    });
  });
  it('Allows entering a numeric value', function () {
    cy.get('#edit-total-monthly-obligations').clear().type('1000').should('have.value', '1000');
  });
  it('Displays an error on too large value', function () {
    cy.get('#edit-total-monthly-obligations').clear().type('100000000').blur();
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .month-income-low > .c-form-field > p').should('not.be.empty');
  });
  it('Displays an error on non-numeric input', function () {
    cy.get('#edit-total-blance-existing-loans').type('abcd').blur();
    cy.get('#edit-total-blance-existing-loans').should('have.value', 0);
  });
  it('Should show an error for minimum period field with minimum values', function () {
    cy.get('#edit-monthly-income').clear().type(550);
    cy.get('#edit-total-blance-existing-loans').clear().type('have.value', '1000000000');
    cy.get('#loan-tab--2 > .max-loan-amount-calculator > .js-form-type-textfield > .c-form-field > .slide-period > .slider-ammount').click();
  });
  it('Should change the slider value', function () {
    var positions = [0, 30, 50, 80, 100];
    var lastText = "";
    cy.get('.ui-slider-handle.ui-corner-all').then(function ($handle) {
      var handleRect = $handle[2].getBoundingClientRect();
      var sliderWidth = handleRect.width;
      var sliderLeft = handleRect.left;

      var checkPosition = function checkPosition(index) {
        if (index >= positions.length) return;
        var percentage = positions[index];
        var newPositionX = sliderLeft + sliderWidth * (percentage / 100);
        cy.wrap($handle[2]).trigger('mousedown', {
          which: 1,
          clientX: newPositionX,
          clientY: handleRect.top
        }).trigger('mousemove', {
          clientX: newPositionX,
          clientY: handleRect.top
        }).trigger('mouseup');
        cy.get('.slider-ammount').invoke('text').then(function (text) {
          expect(text).to.not.equal(lastText);
          lastText = text;
        }).then(function () {
          checkPosition(index + 1);
        });
      };

      checkPosition(0);
    });
  });
  it('Prevents XSS attacks', function () {
    var xssScript = "<script>alert('XSS')</script>";
    cy.get('#edit-monthly-income').type(xssScript).blur();
    cy.on('window:alert', function (str) {
      expect(str).to.not.equal('XSS');
    });
  });
  it('prevents SQL injection attacks', function () {
    var maliciousInput = "' OR '1'='1";
    cy.get('#edit-monthly-income').type(maliciousInput).blur();
    cy.get('body').should('not.contain', 'SQL');
  });
});