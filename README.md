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