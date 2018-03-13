import { MainScreen } from './MainScreen';
import { Actions, connect } from '../../Presenter/connect';
import { MainPresenter, MainPresenterInput, MainPresenterViewModel } from './MainPresenter';

const presenter = new MainPresenter();

const initialState: MainPresenterViewModel = {

};

const mapPresenterToActions = (_presenter: MainPresenter): Actions<MainPresenterInput> => ({
  actions: { },
});

export const MainScreenConnected = connect<
  MainPresenter,
  MainPresenterInput,
  MainPresenterViewModel
  >(presenter, initialState, MainScreen, mapPresenterToActions);
