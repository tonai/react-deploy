const getCategoriesRoute = '/dev/categories';
const getArticlesRoute = '/dev/articles';
const addArticleRoute = '/dev/articles';
const getArticleRoute = '/dev/articles/';
const editArticleRoute = '/dev/articles/';
const deleteArticleRoute = '/dev/articles/';

describe('E2E', () => {
  it('Visits the app', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');

    cy.visit('/');
    cy.get('.Title__title').should('contain', 'Articles');
    cy.get('.Article').should('have.length', 3);
  });

  it('Filters articles', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');

    cy.visit('/');
    cy.get('.Article').should('have.length', 3);
    cy.get('[name=title]').type('1');
    cy.get('.Article').should('have.length', 1);
    cy.get('[name=title]').clear();
    cy.get('[name=category]').select('1');
    cy.get('.Article').should('have.length', 2);
    cy.get('[name=category]').select('');
    cy.get('[name=published][value=draft]').check();
    cy.get('.Article').should('have.length', 1);
  });

  it('Go to add page', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');

    cy.visit('/');
    cy.get('.Title__button').click();
    cy.location('pathname').should('eq', '/article');
    cy.get('.Title__title').should('contain', 'Add new article');
  });

  it('Add article', () => {
    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');
    cy.route('POST', addArticleRoute, 'fixture:addArticle.json').as('addArticle');

    cy.visit('/article');
    cy.get('[name=title]').type('Article 4');
    cy.get('[name=category]').select('2');
    cy.get('[name=content]').type('This is a test.');
    cy.get('[name=published]').check();
    cy.get('.ArticleForm__button').click();
    // cy.get('.Title__title').should('contain', 'Edit article (4)');
    cy.get('.Title__title')
      .invoke('text')
      .then((title) => {
        const id = title.match(/\((.*)\)/)[1];
        cy.location('pathname').should('eq', '/article/' + id);
        cy.get('.Title__button').click();
        cy.location('pathname').should('eq', '/');
        // cy.get('.Article').should('have.length', 4);
      });
  });

  it('Go to edit page', () => {
    const id = 3;

    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');
    cy.route(getArticleRoute + id, 'fixture:getArticle.json').as('getArticle');

    cy.visit('/');
    cy.get('.Article')
      .eq(id - 1)
      .find('.Article__link')
      .eq(0)
      .click();
    cy.location('pathname').should('eq', '/article/' + id);
    cy.get('.Title__title').should('contain', `Edit article (${id})`);
    // cy.get('[name=content]').should('contain', 'This is a test.');
    cy.get('[name=content]').should('contain', 'Phasellus sit amet bibendum augue.');
  });

  it('Edit article', () => {
    const id = 3;

    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');
    cy.route(getArticleRoute + id, 'fixture:getArticle.json').as('getArticle');
    cy.route('PUT', editArticleRoute + id, 'fixture:editArticle.json').as('editArticle');

    cy.visit('/article/' + id);
    cy.get('[name=category]').select('1');
    cy.get('.ArticleForm__button').click();
    cy.get('.Title__button').click();
    cy.location('pathname').should('eq', '/');
    // cy.get('.Article').eq(3).find('.Article__cell').eq(1).should('contain', 'News');
  });

  it('Remove article', () => {
    const id = 3;

    cy.server();
    cy.route(getCategoriesRoute, 'fixture:getCategories.json').as('getCategories');
    cy.route(getArticlesRoute, 'fixture:getArticles.json').as('getArticles');
    cy.route('DELETE', deleteArticleRoute + id, 'fixture:deleteArticle.json').as('deleteArticle');

    cy.visit('/');
    cy.get('.Article')
      .eq(id - 1)
      .find('.Article__link')
      .eq(1)
      .click();
    cy.get('.Article').should('have.length', 2);
  });
});
