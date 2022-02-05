# Lesson 1
Learned different way to format our intercept calls, usually I would use something as follows:
`cy.intercept('method', 'pathname').as('someAlias')`

However, we can also use the following passing the object properties
`cy.intercept({
  pathname: **/search,
  query: {
    query: 'someName',
    page: '#'
  }
}).as('someAlias');`
