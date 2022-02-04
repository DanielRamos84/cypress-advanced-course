# Lesson 2
## First extra credit

"shows 20 stories, then the next 20 after clicking "More"
First notice when the page reloads the input field defaults to display the word React, for the purposes of this test we don't want to clear the entry out, we're only interested in making sure our assertion of displaying the next 20 entries in the second page asserting a total of 40 articles passes.

For this we open inspector tool, click Network tab, clear out any content there.  While this is open scroll to the bottom of the actual web page and click more.

This returns a GET request method for url `https://hn.algolia.com/api/v1/search?query=React&page=0`

Now using this information we can intercept that call 2 different ways and set an alias for the response.

`cy.intercept(`api/v1/search?query=React&page=1`).as('page1');`

or

`cy.intercept({
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1'
        }
      }).as('page1');`

Now after we click the button More we wait for that response using an alias and as a follow up make the assertion we have 40 articles.

## Second extra credit Types word Automation and hits ENTER
We intercept `api/v1/search?query=Automation&page=0`).as('searchAutomation');` but notice it fails

![img](/cypress-advanced-course/images/image01.png)

This is because our application reloads every time we execute an it block in our spec file and default behavior of the application is to start the search with React and appends our text to the end of this.

To fix this we set a beforeEach hook where we target the search field and clear this allowing us to execute the test without error.

`beforeEach(() => {
    //current code
    cy.get('#search').clear();
  })`
