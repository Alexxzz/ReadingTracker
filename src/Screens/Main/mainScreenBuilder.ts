import { MainScreen } from './MainScreen';
import { connect } from '../../Presenter/connect';
import { MainPresenter, MainPresenterInput, MainPresenterViewModel } from './MainPresenter';

const presenter = new MainPresenter();

const initialState: MainPresenterViewModel = {

};

export const MainScreenConnected = connect<
  MainPresenter,
  MainPresenterInput,
  MainPresenterViewModel
  >(presenter, initialState, MainScreen);
