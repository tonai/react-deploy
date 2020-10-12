import 'cypress-plugin-snapshots/commands';

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));
