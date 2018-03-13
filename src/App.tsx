import { Navigation } from 'react-native-navigation';
import { BookScreenConnected } from './Screens/Book/bookScreenBuilder';
import { MainScreenConnected } from './Screens/Main/mainScreenBuilder';

export const start = () => {
  Navigation.registerComponent(`BookScreen`, BookScreenConnected);
  Navigation.registerComponent(`MainScreen`, MainScreenConnected);

  Navigation.events().onAppLaunched(() => {
    Navigation.setRoot({
      component: {
        name: 'MainScreen',
      },
    });
  });
};
