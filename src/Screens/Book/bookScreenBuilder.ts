import { BookPresenter, BookPresenterInput, BookPresenterViewModel } from './BookPresenter';
import { Actions, connect } from '../../Presenter/connect';
import { BookScreen } from './BookScreen';
import { ClockServiceImpl } from '../../Services/ClockServiceImpl';
import { AsyncStorage } from 'react-native';
import { AsyncStorageGateway } from '../../Services/AsyncStorageGateway';
import { AlertUserPageNumberInput } from '../../Services/AlertUserPageNumberInput';

const presenter = new BookPresenter(
  new ClockServiceImpl(),
  new AsyncStorageGateway(AsyncStorage),
  new AlertUserPageNumberInput(),
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

export const BookScreenConnected = connect<
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel
>(presenter, initialState, BookScreen, mapPresenterToActions);
