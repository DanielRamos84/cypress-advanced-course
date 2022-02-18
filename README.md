# Lesson 4
## Front end independent tests from API
- Purpose of these tests is to validate results without relying on calling API endpoints, this way we are in full control of the data we want our application to work with.
- We create an `example.json` file under `cypress/fixtures` folder and create an object to mock the response we send to the front end, contains 2 stories

      {
        "hits": [
          {
            "title": "Sample 1",
            "url": "https://example.com/1",
            "author": "Author 1",
            "num_comments": 34,
            "points": 91,
            "objectID": 0
          },
          {
            "title": "Sample 2",
            "url": "https://example.com/2",
            "author": "Author 2",
            "num_comments": 55,
            "points": 98,
            "objectID": 1
          }
        ]
      }

- At this point we also further isolate the tests by creating a new `context` declaration in which we'll create our tests that mock the API
- We intercept the call so the front end displays both objects from our json file and declare this in a beforeEach hook

      cy.intercept(`api/v1/search?query=React&page=0`, {fixture: 'example'})
      .as('getStories');
- We then visit our baseUrl
- Working of our previous tests that relied on the API, we can copy most of the commands and change the assertion we made on those to account for the correct number of records we are now displaying.

## Check that UI displays information that we are mocking from our fixture file
- We want to assert the information we are loading into the browser that's coming from our fixture file.  Fist wait for the stories to load, in this case we have two stories in our `stories.json` file.  Next, we declare a constant to require the use of the file in our it block

      cy.wait('@getStories');
        const stories= require ('../fixtures/stories.json');

- Target an alias each of our rows so we can easily identify which one are working with and then we use the within command to move in between each index property.

      cy.get('.item:eq(0) span', {log:false})
        .as('firstRowItem')

      cy.get('@firstRowItem').within(span => {
        cy.wrap(span, {log:false}).eq(0, {log:false}).should('have.text', stories.hits[0].title).and('be.visible');
        cy.wrap(span).contains('a', {log:false}).should('have.attr', 'href', stories.hits[0].url);
        cy.wrap(span, {log:false}).eq(1, {log:false}).should('have.text', stories.hits[0].author).and('be.visible');
        cy.wrap(span, {log:false}).eq(2, {log:false}).should('have.text', stories.hits[0].num_comments).and('be.visible');
        cy.wrap(span, {log:false}).eq(3, {log:false}).should('have.text', stories.hits[0].points).and('be.visible');
      });

- Use the same approach for the second row replacing the index from 0 to 1.  Notice we are using `{log:false}` in several commands, this is to minimize chatter in the command log.  Even if we're suppressing the log from grabbing certain elements, if the test was to fail on any of those Cypress will still log that information for us.  While it seems tedious to repeat this process it helps to tidy things up in the command log so we can focus on the information that matters.  In addition to asserting the text we also assert the url contained in the fixture file for each of the objects.

## Check that we can sort our items list by title, header, comments or points
- Being that we are implementing a second test that will look at the fixture file, it makes sense to move that file declaration above our beforeEach hook so we can access the information for any other tests that wall in our context ('List of stories').

    context('List of stories', () =>{
          const stories= require ('../fixtures/stories.json');

          beforeEach(() => {
            cy.wait('@getStories');
            cy.visit('/');
          });

- All we have to do is click on each headers and assert the information is sorted as we expect comparing the text value to its respective property in `stories.hits[index]...`