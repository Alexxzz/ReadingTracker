import { Navigation } from 'react-native-navigation';
import { BookScreenConnected } from './Screens/Book/bookScreenBuilder';
import { MainScreenConnected } from './Screens/Main/mainScreenBuilder';

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
