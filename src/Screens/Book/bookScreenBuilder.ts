import { BookPresenter } from './BookPresenter';
import { connect } from '../../Presenter/connect';
import { BookScreen } from './BookScreen';
import { ClockServiceImpl } from '../../Services/ClockServiceImpl';
import { AsyncStorage } from 'react-native';
import { AsyncStorageGateway } from '../../Services/AsyncStorageGateway';
import { AlertUserInput } from '../../Services/AlertUserInput';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { IBookPresenterInput } from './IBookPresenterInput';
import { IBook } from '../Main/IBook';
import { NavigationProps } from "react-native-navigation";

const presenter = new BookPresenter(
  new ClockServiceImpl(),
  new AsyncStorageGateway(AsyncStorage),
  new AlertUserInput(),
);

const initialState: BookPresenterViewModel = {
  progress: [],
};

export interface IBookScreenProps {
  book: IBook;
}

export const BookScreenConnected = connect<
  BookPresenter,
  IBookPresenterInput,
  BookPresenterViewModel,
  NavigationProps & IBookScreenProps
>(presenter, initialState, BookScreen);
