import { BookPresenter, BookPresenterInput, BookPresenterViewModel } from './BookPresenter';
import { Actions, connect } from '../Presenter/connect';
import { BookScreen } from './BookScreen';
import { dependencies } from '../Services/Assembly';

const presenter = new BookPresenter(
  dependencies.dateProvider,
  dependencies.progressStorageProvider,
  dependencies.userPageNumberInput,
);

const mapPresenterToActions = (presenter: BookPresenter): Actions<BookPresenterInput> => ({
  actions: {
    start: presenter.start,
    addProgress: presenter.addProgress,
  },
});

const initialState: BookPresenterViewModel = {
  progress: [],
};

export const connectedComponent = connect<
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel
>(presenter, initialState, BookScreen, mapPresenterToActions);
