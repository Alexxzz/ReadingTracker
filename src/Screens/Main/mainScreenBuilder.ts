import { MainScreen } from './MainScreen';
import { connect } from '../../Presenter/connect';
import { IMainPresenterInput } from './IMainPresenterInput';
import { IMainPresenterViewModel } from './IMainPresenterViewModel';
import { NavigationProps } from 'react-native-navigation';
import { container } from '../../inversify.config';
import { TYPES } from '../../Services/Types';
import { Presenter } from '../../Presenter/Presenter';

const mainPresenter = container.get<Presenter<IMainPresenterViewModel>>(TYPES.MainPresenter);

const mainPresenterInitialState: IMainPresenterViewModel = {
  books: [],
};

export const MainScreenConnected = connect<
  Presenter<IMainPresenterViewModel>,
  IMainPresenterInput,
  IMainPresenterViewModel,
  NavigationProps
>(mainPresenter, mainPresenterInitialState, MainScreen);
