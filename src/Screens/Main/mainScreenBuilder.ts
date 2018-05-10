import { MainScreen } from './MainScreen';
import { connect } from '../../Presenter/connect';
import { MainPresenter } from './MainPresenter';
import { AsyncStorageGateway } from '../../Services/AsyncStorageGateway';
import { AsyncStorage } from 'react-native';
import { MainPresenterInput } from './MainPresenterInput';
import { MainPresenterViewModel } from './MainPresenterViewModel';
import { ReactNativeNavigationService } from '../../Services/ReactNativeNavigationService';
import { NavigationProps, Navigation } from 'react-native-navigation';

const presenter = new MainPresenter(
  new AsyncStorageGateway(AsyncStorage),
  new ReactNativeNavigationService(Navigation),
);

const initialState: MainPresenterViewModel = {
  books: [],
};

export const MainScreenConnected = connect<
  MainPresenter,
  MainPresenterInput,
  MainPresenterViewModel,
  NavigationProps
>(presenter, initialState, MainScreen);
