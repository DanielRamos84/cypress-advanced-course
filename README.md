# Lesson 5
## Validate we are testing the application as a real user would do
- Before a user can interact with an element, type, clear, click etc. The element has to be visible.
- In this lesson we simply refactor each test adding `should('be.visible')` before the action that interacts with the element.  This accomplishes two things. First we make our test more reliable telling Cypress to make the extra check and second more important we are testing as a real user would do.
- If there's multiple should assertions for instance `should('be.visible).should('have.length')` we can rewrite this as `should('be.visible').and('have.length')`

## That's all we have to do for this lesson, now we can move on to Lesson 6