import { NavigationService } from './NavigationService';
import { Navigation } from 'react-native-navigation';

export class ReactNativeNavigationService implements NavigationService {
  showBookScreen(componentId: string): void {
    Navigation.push(componentId, {
      component: {
        name: 'BookScreen',
      },
    });
  }
}
