import icons from '../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet!!. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerLoad(handler) {
    window.addEventListener('load', function () {
      handler();
    });
  }
}

export default new BookmarkView();
