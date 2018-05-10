import { NavigationService } from './NavigationService';
import { NavigationClass } from 'react-native-navigation';
import { Book } from '../Screens/Main/Book';

export class ReactNativeNavigationService implements NavigationService {
  constructor(private readonly navigator: NavigationClass) { }

  showBookScreen(componentId: string, book: Book): void {
    this.navigator.push(componentId, {
      component: {
        name: 'BookScreen',
        passProps: {
          book,
        },
      },
    }).then(a => console.log('Navigation.push next: ', a))
      .catch(e => console.log('Navigation.push e:', e));
  }
}
