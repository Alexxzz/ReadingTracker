import { Navigation, NavigationProps } from 'react-native-navigation';
import { container } from './inversify.config';
import { Presenter } from './Presenter/Presenter';
import { IMainPresenterViewModel } from './Screens/Main/IMainPresenterViewModel';
import { TYPES } from './Services/Types';
import { connect } from './Presenter/connect';
import { IMainPresenterInput } from './Screens/Main/IMainPresenterInput';
import { MainScreen } from './Screens/Main/MainScreen';

import { BookScreenConnected } from './Screens/Book/bookScreenBuilder';

const mainPresenter = container.get<Presenter<IMainPresenterViewModel>>(TYPES.MainPresenter);

const mainPresenterInitialState: IMainPresenterViewModel = {
  books: [],
};

const MainScreenConnected = connect<
  Presenter<IMainPresenterViewModel>,
  IMainPresenterInput,
  IMainPresenterViewModel,
  NavigationProps
>(mainPresenter, mainPresenterInitialState, MainScreen);

export const start = () => {
  Navigation.registerComponent(`MainScreen`, MainScreenConnected);
  Navigation.registerComponent(`BookScreen`, BookScreenConnected);

  Navigation.events().onAppLaunched(() => {
    Navigation.setRoot({
      stack: {
        options: {
          topBar: {
            hidden: true,
          },
        },
        children: [
          {
            component: {
              name: 'MainScreen',
            },
          },
        ],
      },
    }).then();
  });
};
