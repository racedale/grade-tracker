/// <reference types="cypress" />

Cypress.Screenshot.defaults({
  onBeforeScreenshot ($el) {
    const appHeader = $el.find('.sis-app-header')
    const printPadding = $el.find('.print-padding')

    if (appHeader && printPadding) {
      appHeader.hide()
      printPadding.hide()
    }
  },

  onAfterScreenshot ($el, props) {
    const appHeader = $el.find('.sis-app-header')
    const printPadding = $el.find('.print-padding')

    if (appHeader && printPadding) {
      appHeader.show()
      printPadding.show()
    }
  },
})

context('Navigation', () => {
  beforeEach(() => {
    cy.viewport(950, 1600)
    cy.visit('/login')
    cy.findByText('Loading...').should('not.be.visible')
    cy.findAllByRole('tab').should('exist')
    cy.findByText('PARENT').should('exist')
    cy.findAllByRole('tab').should('have.length', 3).then(results => {
      const [parentTab] = Object.values(results).filter(tab => tab.innerText === 'PARENT')
      parentTab.click()
    })
    cy.findByLabelText('username').click().type(Cypress.env('EMAIL'))
    cy.findByLabelText('password').click().type(Cypress.env('PASSWORD'))
    cy.findAllByRole('button').should('have.length', 2).then(results => {
      const [loginButton] = Object.values(results).filter(button => button.innerText === 'Login')
      loginButton.click()
    })
    cy.findByRole('progressbar').should('be.visible')
    cy.findByRole('progressbar').should('not.be.visible')
    cy.get('body').invoke('attr', 'height', 'initial').then(($body) => {
      const announcements = $body.find('[role="dialog"]')
      if (announcements.length > 0) {
        // TODO: fix closing the dialog
        $body.find('#cancelButton').click()
        cy.wait(500)
      }
    })
    cy.findByText('Current Grades')
  })

  afterEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('should take screenshot of Mia grades', () => {
    cy.findByRole('progressbar').should('not.be.visible')
    cy.screenshot('mia', { capture: 'fullPage' })
    if(Cypress.env('CI')) {
      cy.task('uploadToS3', {
        accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
        filepath: 'cypress/screenshots/grade-tracker.spec.js/mia.png',
      }).then(console.log)
    }
  })

  it('should take screenshot of Aaron grades', () => {
    cy.findAllByRole('listbox').should('exist')
    cy.findAllByRole('listbox').then(results => {
      const [dropdown] = Object.values(results).filter(listBox => listBox.innerText === 'Mia Thompson')
      dropdown.click()
    })
    cy.findByText('Aaron Ellard').click()
    cy.findByRole('progressbar').should('be.visible')
    cy.findByRole('progressbar').should('not.be.visible')
    cy.wait(500)
    cy.screenshot('aaron', { capture: 'fullPage' })
    if(Cypress.env('CI')) {
      cy.task('uploadToS3', {
        accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
        filepath: 'cypress/screenshots/grade-tracker.spec.js/aaron.png',
      }).then(console.log)
    }
  })

  it('should take screenshot of Lucas grades', () => {
    cy.findAllByRole('listbox').should('exist')
    cy.findAllByRole('listbox').then(results => {
      const [dropdown] = Object.values(results).filter(listBox => listBox.innerText === 'Mia Thompson')
      dropdown.click()
    })
    cy.findByText('Lucas Ellard').click()
    cy.findByRole('progressbar').should('be.visible')
    cy.findByRole('progressbar').should('not.be.visible')
    cy.screenshot('lucas', { capture: 'fullPage' })
    if(Cypress.env('CI')) {
      cy.task('uploadToS3', {
        accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
        filepath: 'cypress/screenshots/grade-tracker.spec.js/lucas.png',
      }).then(console.log)
    }
  })
})
