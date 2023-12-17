const user = { name: 'Test User', username: 'test', password: 'testpass' }

describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:5173')
  })
  it('Login form is shown', () => {
    cy.get('h2').should('contain.text', 'Log in to application')
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
    cy.get('#login-button').should('exist')
  })
  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()
      cy.get('.success').should('contain', `Welcome back ${user.name}!`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('#logout-button').should('exist')
    })

    it('fails with wrong credentials', () => {
      it('succeeds with correct credentials', () => {
        cy.get('#username').type('user')
        cy.get('#password').should('password')
        cy.get('#login-button').click()
        cy.get('.error').should('contain', 'Invalid username or password')
          .and('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('#logout-button').should('not.exist')
      })
    })
  })
})
