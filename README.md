# Lesson 6
## Different ways to select elements
- We have the ability to find selectors using single query method which is recommended for test retries purposes but sometimes we are faced with situations where we need to make assertions on a child element.
- Several commands are available and the most common is `cy.within`
- Instead of using single command such as

        cy.get('last-searches button')
            .should('have.length', 5);


- This can be implemented as follows:

        cy.get('.last-searches')
                .within(() => {
                cy.get('button')
                    .should('be.visible')
                    .and('have.length', 5)
                });
        });