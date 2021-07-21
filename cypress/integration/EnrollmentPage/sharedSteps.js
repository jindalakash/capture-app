Given('you open the enrollment page', () => {
    cy.visit('#/enrollment?enrollmentId=wBU0RAsYjKE');
});

Given('you open the enrollment page which has multiples events and stages', () => {
    cy.visit('#/enrollment?enrollmentId=ek4WWAgXX5i');
});

Then(/^you see the following (.*)$/, (message) => {
    cy.contains(message);
});
