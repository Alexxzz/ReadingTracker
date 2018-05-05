import { BookPresenter } from './BookPresenter';
import { connect } from '../../Presenter/connect';
import { BookScreen } from './BookScreen';
import { ClockServiceImpl } from '../../Services/ClockServiceImpl';
import { AsyncStorage } from 'react-native';
import { AsyncStorageGateway } from '../../Services/AsyncStorageGateway';
import { AlertUserPageNumberInput } from '../../Services/AlertUserPageNumberInput';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { BookPresenterInput } from './BookPresenterInput';

const presenter = new BookPresenter(
  new ClockServiceImpl(),
  new AsyncStorageGateway(AsyncStorage),
  new AlertUserPageNumberInput(),
);

const initialState: BookPresenterViewModel = {
  progress: [],
};

export const BookScreenConnected = connect<
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel
>(presenter, initialState, BookScreen);
