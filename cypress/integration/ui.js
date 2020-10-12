const getCategoriesRoute = '/dev/categories';
const getArticlesRoute = '/dev/articles';
const getArticleRoute = '/dev/articles/';

describe('UI', () => {
  it('Homepage', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');

    cy.visit('/');
    cy.document().toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001,
        thresholdType: 'percent'
      }
    });
  });

  it('Add page', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');

    cy.visit('/article');
    cy.document().toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001,
        thresholdType: 'percent'
      }
    });
  });

  it('Edit page', () => {
    const id = 1;

    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');
    cy.route(getArticleRoute + id, 'fixture:getArticle.json').as('getArticle');

    cy.visit('/article/1');
    cy.document().toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001,
        thresholdType: 'percent'
      }
    });
  });
});
