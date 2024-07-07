import 'core-js/stable'; // Transpiling-Polifyling
import 'regenerator-runtime/runtime';
import * as model from './model';
import renderView from './views/renderView';
import resultView from './views/resultView';
import bookmarkView from './views/bookmarkView';
import paginationView from './views/paginationView';
import searchView from './views/searchView';
import addRecipeView from './views/addRecipeView';
import { MODEL_CLOSE_SEC } from './config';

// if (modAle.hot) {
//addRecipeView   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    renderView.renderSpinner();

    //  Updating the resultView to Selected
    resultView.update(model.getSearchResultPage());

    //  Loading Recipe
    await model.loadRecipe(id);

    //  Rendering Recipe
    renderView.render(model.state);

    //  Rendering Bookmarks
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    renderView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    //  Getting Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //  Rendering Spinnner
    resultView.renderSpinner();

    //  Loading the Search Results
    await model.loadSearchResults(query);

    //  Rendering the Search Results
    resultView.render(model.getSearchResultPage());

    //  Rendering the Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //  Rendering the Search Results
  resultView.render(model.getSearchResultPage(goToPage));

  //  Rendering the Pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //  Updating state in the Model
  model.updateServings(newServings);

  //  Rendering the renderView for new Servings
  renderView.update(model.state);
};

const controlAddBookmarks = function () {
  // Adding/Removing Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deletBookmark(model.state.recipe.id);

  // Rendering in View
  renderView.update(model.state);

  // Rendering in Bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controllBookmarksLoad = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controllAddNewRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // Uploading the New recipe
    await model.uploadRecipe(newRecipe);

    // Rendering the Recipe in renderView
    renderView.render(model.state);

    // Rendering the Success Message
    addRecipeView.renderMessage('Your Recipe was Successfully Saved :)');

    // Closing the Form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

    // Changing ID in the Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Rendering the bookmarksView
    bookmarkView.render(model.state.bookmarks);
  } catch (err) {
    console.log(err.message);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  renderView.addHandlerRender(controlRecipes);
  renderView.addHandlerUpdateServings(controlServing);
  renderView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  bookmarkView.addHandlerLoad(controllBookmarksLoad);
  addRecipeView.addHandlerNewRecipe(controllAddNewRecipe);
};

init();
