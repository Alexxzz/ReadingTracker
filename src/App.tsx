import { Navigation } from 'react-native-navigation';
import { connectedComponent } from './Screens/bookScreenBuilder';

export const start = () => {
  Navigation.registerComponent(`BookScreen`, connectedComponent);

  Navigation.events().onAppLaunched(() => {
    Navigation.setRoot({
      component: {
        name: 'BookScreen',
      },
    });
  });
};
