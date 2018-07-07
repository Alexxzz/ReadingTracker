import { NavigationClass } from 'react-native-navigation';
import { INavigationService } from './INavigationService';
import { IBook } from '../Screens/Main/IBook';
import { inject, injectable } from 'inversify';
import { TYPES } from './Types';

@injectable()
export class ReactNativeNavigationService implements INavigationService {
  constructor(@inject(TYPES.Navigator) private readonly navigator: NavigationClass) { }

  public showBookScreen(componentId: string, book: IBook): void {
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

  public showNewBookScreen(): void {
    this.navigator.push('', {
      component: {
        name: 'BookScreen',
      },
    }).then(a => console.log('Navigation.push next: ', a))
      .catch(e => console.log('Navigation.push e:', e));
  }
}
