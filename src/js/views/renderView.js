import { mark } from 'regenerator-runtime';
import icons from '../../img/icons.svg';
// import Fraction from 'fraction.js';
import fracty from 'fracty';
import View from './view';

class RenderView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'Oops! Nothings Found!. Try another Recipe!';
  _message = 'Success Message!';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const newServings = +btn.dataset.updateTo;
      if (newServings > 0) handler(newServings);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
       <figure class="recipe__fig">
          <img src="${this._data.recipe.image}" alt="${
      this._data.recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.recipe.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes"> ${
              this._data.recipe.cookingTime
            } </span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to ="${
                this._data.recipe.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to = "${
                this._data.recipe.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div> 

          <div class="recipe__user-generated ${
            this._data.recipe.key ? '' : 'hidden'
          }">
             <svg>
                 <use href="${icons}#icon-user"></use>
              </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.recipe.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

            ${this._data.recipe.ingredients
              .map(ing => this._generateIngredient(ing))
              .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.recipe.src}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateIngredient(ing) {
    return `
             <li class="recipe__ingredient">
              <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
                             </svg>
                  <div class="recipe__quantity">${
                    // ing.quantity
                    //   ? new Fraction(ing.quantity).toFraction(true)
                    //   : ''
                    ing.quantity ? fracty(ing.quantity).toString() : ''
                  }</div>
                 <div class="recipe__description">
               <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
               </div>
              </li>`;
  }
}

export default new RenderView();
