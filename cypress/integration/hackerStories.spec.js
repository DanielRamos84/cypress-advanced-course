describe('Hacker Stories', () => {
  beforeEach(() => {
    // cy.intercept(`api/v1/search?query=React&page=0`)
    //   .as('getStories');

    cy.intercept({
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
        } 
    }).as('getStories');

    cy.visit('/');

    cy.wait('@getStories')
      .then(res=>{
        expect(res.response.statusCode).eq(200)
      });

      cy.get('#search').clear();
  })

  it('shows the footer', () => {

    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it('shows the right data for all rendered stories', () => {})

    it('shows 20 stories, then the next 20 after clicking "More"', () => {

      // cy.intercept(`api/v1/search?query=React&page=1`).as('page1');

      cy.intercept({
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1'
        }
      }).as('page1');

      cy.get('.item').should('have.length', 20);

      cy.contains('button', 'More').click();

      cy.wait('@page1').then(res=>{
        expect(res.response.statusCode).eq(200);
      });

      cy.get('.item').should('have.length', 40)
    })

    it('Types word Automation and hits ENTER', () => {
      // cy.intercept(`api/v1/search?query=Automation&page=0`).as('searchAutomation');

      cy.intercept({
        pathname: '**/search',
        query: {
          query: 'Automation',
          page: '0'
          }
      }).as('searchAutomation')

      cy.get('#search').type('Automation{enter}');

      cy.wait('@searchAutomation').then(res => {
        expect(res.response.statusCode).eq(200);
      });
    });

    it.only('Types and clicks the submit button', () => {
      // cy.intercept(`api/v1/search?query=Testing&page=0`).as('submit');

      cy.intercept({
        pathname: '**/search',
        query: {
          query: 'Testing',
          page: '0'
        }
      }).as('submit');
      
      cy.get('#search').type('Testing');
      
      cy.contains('button', 'Submit').click();

      cy.wait('@submit').then(res=>{
        expect(res.response.statusCode).eq(200);
      });
    });

    it('shows only nineteen stories after dismissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    });

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })

    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Errors', () => {
      it('shows "Something went wrong ..." in case of a server error', () => {})

      it('shows "Something went wrong ..." in case of a network error', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.get('#search')
        .clear()
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.assertLoadingIsShownAndHidden()

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('searches via the last searched term', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.assertLoadingIsShownAndHidden()

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.assertLoadingIsShownAndHidden()

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('shows a max of 5 buttons for the last searched terms', () => {
        const faker = require('faker')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${faker.random.word()}{enter}`)
        })

        cy.assertLoadingIsShownAndHidden()

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})
