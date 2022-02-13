const previousWord= 'React'
const currentWord= 'Testing'

describe('Hacker Stories', () => {
  context('Mocking the API', () => {
    beforeEach(() => {
      cy.intercept(`api/v1/search?query=React&page=0`, {fixture: 'example'})
        .as('getStories');

      cy.intercept(`api/v1/search?query=${currentWord}&page=0`, {fixture: 'example'})
        .as('searchCurrentWord');
  
      cy.visit('/');
    });
    
    it('shows the right amount of records and data for all rendered stories', () => {
      cy.get('.item').should('have.length', 2);

      cy.contains('button', 'More').click();
    });

    it('Types word testing and hits ENTER', () => {    
      cy.get('#search').type(`${currentWord}{enter}`);
    });

    it('Shows one story less after dismissing the first one', () =>{
      cy.get('.button-small:eq(0)')
        .click();

      cy.get('.item').should('have.length', 1);
    });

    it('shows a max of 5 buttons for the last searched terms', () => {
      const faker = require('faker')

      cy.intercept('**/search**', {fixture: 'empty'})
        .as('randomWordResult');

      Cypress._.times(6, () => {
        cy.get('#search')
          .clear()
          .type(`${faker.random.word()}{enter}`)

        cy.wait('@randomWordResult').then(res=>{
          expect(res.response.statusCode).eq(200);
        });
      });

      cy.get('.last-searches button')
        .should('have.length', 5)
    });
  });
  
  context('Hitting the real API', () => {
  beforeEach(() => {
    cy.intercept(`api/v1/search?query=React&page=0`)
      .as('getStories');

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
    context('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })

    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.

  context('Search', () => {

    beforeEach(() => {
    cy.intercept(`api/v1/search?query=Testing&page=0`).as('submit');
      
        cy.intercept({
          pathname: '**/search',
          query: {
            query: currentWord,
            page: '0'
          }
        }).as('searchCurrentWord');
    });

    it('Types word testing and hits ENTER', () => {
      // cy.intercept(`api/v1/search?query=Automation&page=0`).as('searchCurrentWord');

      cy.intercept({
        pathname: '**/search',
        query: {
          query: currentWord,
          page: '0'
          }
      }).as('searchCurrentWord')

      cy.get('#search').type(`${currentWord}{enter}`);

      cy.wait('@searchCurrentWord').then(res => {
        expect(res.response.statusCode).eq(200);
      });
    });

    it('Types and clicks the submit button', () => {

      cy.get('#search').type(currentWord);
      
      cy.contains('button', 'Submit').click();

      cy.wait('@searchCurrentWord').then(res=>{
        expect(res.response.statusCode).eq(200);
      });

      cy.get('div.item').as('displayHitsPage1');

      cy.get('@displayHitsPage1').each((result, index) => {
        cy.log(`***Line #${index+1} ${result.text()}***`);

        cy.wrap(result, {log:false}).contains(currentWord, {matchCase:false})
      });

      cy.get('.last-searches button').contains(previousWord);
    });
  });

    context('Last searches', () => {
      beforeEach(() => {
        cy.intercept(`api/v1/search?query=Testing&page=0`).as('submit');
         
           cy.intercept({
             pathname: '**/search',
             query: {
               query: currentWord,
               page: '0'
             }
           }).as('searchCurrentWord');
         });

      it('searches via the last searched term', () => {

      cy.intercept({
        pathname: '**/search',
        query: {
          query: previousWord,
          page: '0'
          }
        }).as('previousWordResult');

        cy.get('#search')
          .type(`${currentWord}{enter}`)

        cy.wait('@searchCurrentWord').then(res=>{
          expect(res.response.statusCode).eq(200);
        });

        cy.get('.last-searches button').contains(previousWord).should('be.visible').click();

        cy.wait('@previousWordResult').then(res=>{
          expect(res.response.statusCode).eq(200);
        });

        cy.get('div.item').as('displayHitsPage1');

        cy.get('@displayHitsPage1').each((result, index) => {
          const resultText= result.text();
          const resultTextCase= resultText.toLowerCase();

          cy.log(`***Line #${index+1} ${result.text()}***`);
          cy.wrap(resultTextCase, {log:false}).should('contain', previousWord.toLowerCase());
        });
      });

        it('shows a max of 5 buttons for the last searched terms', () => {
          const faker = require('faker')
  
          cy.intercept({
            pathname: '**/search',
            query: {
              query: '**',
              page: '0'
              }
            }).as('randomWordResult');
  
          Cypress._.times(6, () => {
            cy.get('#search')
              .clear()
              .type(`${faker.random.word()}{enter}`)
  
            cy.wait('@randomWordResult').then(res=>{
              expect(res.response.statusCode).eq(200);
            });
          });
  
          cy.get('.last-searches button')
            .should('have.length', 5)
        });
      });
    });
  });
});

context('Errors', () => {
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(`**/search**`, {statusCode: 500})
      .as('getServerFailure');

    cy.visit('/');
    cy.wait('@getServerFailure');
  });

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(`**/search**`, {forceNetworkError: true})
      .as('getNetworkError');

    cy.visit('/')
    cy.wait('@getNetworkError');
  });
});