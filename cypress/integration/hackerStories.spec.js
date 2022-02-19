const previousWord= 'React'
const currentWord= 'Testing'

describe('Hacker Stories', () => {
  context('Mocking the API', () => {
    beforeEach(() => {
      cy.intercept(`api/v1/search?query=React&page=0`, {fixture: 'stories'})
        .as('getStories');

      cy.intercept(`api/v1/search?query=${currentWord}&page=0`, {fixture: 'stories'})
        .as('searchCurrentWord');

    cy.visit('/');

    });

    it('Shows no story when none is returned', () => {
      cy.intercept(`api/v1/search?query=React&page=0`, {fixture: 'empty'})
      .as('emptyStories');

      cy.visit('/');

      cy.wait('@emptyStories');

      cy.get('.item').should('not.exist')
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

    context('List of stories', () =>{
      const stories= require ('../fixtures/stories.json');

      beforeEach(() => {
        cy.wait('@getStories');
        cy.visit('/');
      });

      it('Shows the right data for all rendered stories', () => {        
        cy.get('.item:eq(0) span', {log:false})
          .as('firstRowItem')
        
        cy.get('@firstRowItem').within(span => {
          cy.wrap(span, {log:false}).eq(0, {log:false}).should('have.text', stories.hits[0].title).and('be.visible');
          cy.wrap(span).contains('a', {log:false}).should('have.attr', 'href', stories.hits[0].url);
          cy.wrap(span, {log:false}).eq(1, {log:false}).should('have.text', stories.hits[0].author).and('be.visible');
          cy.wrap(span, {log:false}).eq(2, {log:false}).should('have.text', stories.hits[0].num_comments).and('be.visible');
          cy.wrap(span, {log:false}).eq(3, {log:false}).should('have.text', stories.hits[0].points).and('be.visible');
        });
  
        cy.get('.item:eq(1) span', {log:false})
          .as('secondRowItem')
        
        cy.get('@secondRowItem').within(span => {
          cy.wrap(span, {log:false}).eq(0, {log:false}).should('have.text', stories.hits[1].title).and('be.visible');
          cy.wrap(span).contains('a', {log:false}).should('have.attr', 'href', stories.hits[1].url);
          cy.wrap(span, {log:false}).eq(1, {log:false}).should('have.text', stories.hits[1].author).and('be.visible');
          cy.wrap(span, {log:false}).eq(2, {log:false}).should('have.text', stories.hits[1].num_comments).and('be.visible');
          cy.wrap(span, {log:false}).eq(3, {log:false}).should('have.text', stories.hits[1].points).and('be.visible');
        });
      });

      context('Order by', () => {
        it('orders by title', () => {
          cy.contains('[type="button"]', 'Title')
            .as('titleHeader')
            .should('be.visible')
            .click();

          cy.get('.item span:eq(0)').should('have.text', stories.hits[0].title).and('be.visible');

          cy.get('.item span:eq(0) a').should('have.attr', 'href', stories.hits[0].url).and('be.visible');
            
          cy.get('@titleHeader')
            .click();

          cy.get('.item span:eq(0)').should('have.text', stories.hits[1].title).and('be.visible');

          cy.get('.item span:eq(0) a').should('have.attr', 'href', stories.hits[1].url).and('be.visible');
        });
  
        it('orders by author', () => {
          cy.contains('[type="button"]', 'Author')
          .as('authorHeader')
          .should('be.visible')
          .click();

        cy.get('.item span:eq(1)').should('have.text', stories.hits[0].author).and('be.visible');

        cy.get('@authorHeader')
          .click();

        cy.get('.item span:eq(1)').should('have.text', stories.hits[1].author).and('be.visible');
        });
  
        it('orders by comments', () => {
          cy.contains('[type="button"]', 'Comments')
          .as('commentsHeader')
          .should('be.visible')
          .click();

        cy.get('.item span:eq(2)').should('have.text', stories.hits[1].num_comments).and('be.visible');

        cy.get('@commentsHeader')
          .click();

        cy.get('.item span:eq(2)').should('have.text', stories.hits[0].num_comments).and('be.visible');
        });
  
        it('orders by points', () => {
          cy.contains('[type="button"]', 'Points')
          .as('pointsHeader')
          .should('be.visible')
          .click();

        cy.get('.item span:eq(3)').should('have.text', stories.hits[1].points).and('be.visible');

        cy.get('@pointsHeader')
          .click();

        cy.get('.item span:eq(3)').should('have.text', stories.hits[0].points).and('be.visible');
        });
      });
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

      cy.get('#search')
        .should('be.visible')
          .clear();
  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

context('List of stories', () => {
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

      cy.get('.item')
        .should('be.visible')
        .and('have.length', 20);

      cy.contains('button', 'More').click();

      cy.wait('@page1').then(res=>{
        expect(res.response.statusCode).eq(200);
      });

      cy.get('.item')
        .should('be.visible')
          .and('have.length', 40)
    })

    it('shows only nineteen stories after dismissing the first story', () => {
      cy.get('.button-small')
        .should('be.visible')
        .first()
        .click();

      cy.get('.item')
        .should('be.visible')
          .and('have.length', 19)
    });

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

      cy.get('#search')
        .should('be.visible')
          .type(`${currentWord}{enter}`);

      cy.wait('@searchCurrentWord').then(res => {
        expect(res.response.statusCode).eq(200);
      });
    });

    it('Types and clicks the submit button', () => {
      cy.get('#search')
        .should('be.visible')
        .type(currentWord);
      
      cy.contains('button', 'Submit')
        .should('be.visible')
          .click();

      cy.wait('@searchCurrentWord').then(res=>{
        expect(res.response.statusCode).eq(200);
      });

      cy.get('div.item')
        .should('be.visible')
          .as('displayHitsPage1');

      cy.get('@displayHitsPage1').each((result, index) => {
        cy.log(`***Line #${index+1} ${result.text()}***`);

        cy.wrap(result, {log:false}).contains(currentWord, {matchCase:false})
      });

      cy.get('.last-searches button')
        .should('be.visible')
          .contains(previousWord);
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
          .should('be.visible')
          .type(`${currentWord}{enter}`);

        cy.wait('@searchCurrentWord').then(res=>{
          expect(res.response.statusCode).eq(200);
        });

        cy.get('.last-searches button')
          .should('be.visible')
          .contains(previousWord).should('be.visible').click();

        cy.wait('@previousWordResult').then(res=>{
          expect(res.response.statusCode).eq(200);
        });

        cy.get('div.item')
          .should('be.visible')
          .as('displayHitsPage1');

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
              .should('be.visible')
              .clear()
              .type(`${faker.random.word()}{enter}`)
  
            cy.wait('@randomWordResult').then(res=>{
              expect(res.response.statusCode).eq(200);
            });
          });
  
          cy.get('.last-searches button')
            .should('be.visible')
            .and('have.length', 5);
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