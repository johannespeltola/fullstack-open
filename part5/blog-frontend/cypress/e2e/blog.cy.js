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
  describe('When logged in', () => {
    beforeEach(() => {
      cy.request('POST', 'http://localhost:3001/api/login',
        { username: user.username, password: user.password }
      ).then((res) => {
        localStorage.setItem('user', JSON.stringify(res.body))
      })
      cy.visit('http://localhost:5173')
    })
    const blog = {
      title: 'Title Part 2',
      author: 'Mr. Author',
      url: 'URL.com'
    }
    it('A blog can be created', () => {
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog.title)
      cy.get('[data-testid=author-input]').type(blog.author)
      cy.get('[data-testid=url-input]').type(blog.url)
      cy.get('[data-testid=create-blog-button]').click()
      cy.get('.success').should('contain', `Added new blog ${blog.title} by ${blog.author}`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains(`${blog.title} ${blog.author}`).should('exist')
    })
    it('Can like a blog', () => {
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog.title)
      cy.get('[data-testid=author-input]').type(blog.author)
      cy.get('[data-testid=url-input]').type(blog.url)
      cy.get('[data-testid=create-blog-button]').click()
      cy.contains('View').click()
      cy.contains('Like').click()
      cy.get('[data-testid=blog-likes]').should('contain.text', 'Likes 1 Like')
    })
    it('Can remove a created blog', () => {
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog.title)
      cy.get('[data-testid=author-input]').type(blog.author)
      cy.get('[data-testid=url-input]').type(blog.url)
      cy.get('[data-testid=create-blog-button]').click()
      cy.contains('View').click()
      cy.contains('Remove').click()
      cy.get('.success').should('contain', `Removed ${blog.title} by ${blog.author}`)
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains(`${blog.title} ${blog.author}`).should('not.exist')
    })
    it('Can only be removed by the correct user', () => {
      // Create blog with default user
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog.title)
      cy.get('[data-testid=author-input]').type(blog.author)
      cy.get('[data-testid=url-input]').type(blog.url)
      cy.get('[data-testid=create-blog-button]').click()
      cy.contains('Logout').click()
      // Create new temp user and login
      cy.request('POST', 'http://localhost:3001/api/users/', { name: 'User2', username: 'user2', password: 'pass' })
      cy.request('POST', 'http://localhost:3001/api/login',
        { username: 'user2', password: 'pass' }
      ).then((res) => {
        localStorage.setItem('user', JSON.stringify(res.body))
      })
      cy.visit('http://localhost:5173')
      cy.contains('View').click()
      cy.contains('Remove').should('not.exist')
    })
    it('Blogs should be ordered according to likes', () => {
      const blog2 = {
        title: 'Another Blog',
        author: 'John Doe',
        url: 'google.com'
      }
      // Create first blog
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog.title)
      cy.get('[data-testid=author-input]').type(blog.author)
      cy.get('[data-testid=url-input]').type(blog.url)
      cy.get('[data-testid=create-blog-button]').click()
      // Create second blog
      cy.contains('New Blog').click()
      cy.get('[data-testid=title-input]').type(blog2.title)
      cy.get('[data-testid=author-input]').type(blog2.author)
      cy.get('[data-testid=url-input]').type(blog2.url)
      cy.get('[data-testid=create-blog-button]').click()
      // Sanity check original order
      cy.get('[data-testid=blog]').eq(0).should('contain', `${blog.title} ${blog.author}`)
      cy.get('[data-testid=blog]').eq(1).should('contain', `${blog2.title} ${blog2.author}`)
      // Vote for the second item in list
      cy.get('[data-testid=blog]').eq(1).contains('View').click()
      cy.contains('Like').click()
      // Expect the voted for item to now be first
      cy.get('[data-testid=blog]').eq(0).should('contain', `${blog2.title} ${blog2.author}`)
    })
  })
})
