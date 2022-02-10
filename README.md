# Lesson 3
## Simulate Network Errors
- For this test we are simply visiting the application and then intercepting the request to simulate an internal server error status 500 or network error by passing either either option below to our request:

  `{statusCode: 500})`

  `{forceNetworkError: true})`