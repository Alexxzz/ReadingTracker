import { BookPresenter } from './BookPresenter';
import { connect } from '../../Presenter/connect';
import { BookScreen } from './BookScreen';
import { ClockServiceImpl } from '../../Services/ClockServiceImpl';
import { AsyncStorage } from 'react-native';
import { AsyncStorageGateway } from '../../Services/AsyncStorageGateway';
import { AlertUserPageNumberInput } from '../../Services/AlertUserPageNumberInput';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { BookPresenterInput } from './BookPresenterInput';
import { Book } from '../Main/Book';
import { NavigationProps } from "react-native-navigation";

const presenter = new BookPresenter(
  new ClockServiceImpl(),
  new AsyncStorageGateway(AsyncStorage),
  new AlertUserPageNumberInput(),
);

const initialState: BookPresenterViewModel = {
  progress: [],
};

export type BookScreenProps = {
  book: Book,
};

export const BookScreenConnected = connect<
  BookPresenter,
  BookPresenterInput,
  BookPresenterViewModel,
  NavigationProps & BookScreenProps
>(presenter, initialState, BookScreen);
