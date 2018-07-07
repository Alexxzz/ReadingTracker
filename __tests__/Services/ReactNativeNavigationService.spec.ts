import 'reflect-metadata';

import { ReactNativeNavigationService } from '../../src/Services/ReactNativeNavigationService';
import { IBook } from '../../src/Screens/Main/IBook';

jest.mock('react-native-navigation', () => ({

}));

const date1 = new Date('2018-02-25T18:17:14.593Z');

class NavigationClassMock {
  public push = jest.fn().mockReturnValue(Promise.resolve());
}

describe('ReactNativeNavigationService', () => {
  it('Navigates to BookScreen passing book in parameters', () => {
    const book: IBook = {
      name: 'book 11',
      progress: [
        {
          page: 53,
          date: date1,
        },
      ],
      total: 0,
    };
    const navigationClassMock = new NavigationClassMock();
    const sut = new ReactNativeNavigationService(navigationClassMock);

    sut.showBookScreen('componentId', book);

    expect(navigationClassMock.push).toBeCalledWith('componentId', {
      component: {
        name: 'BookScreen',
        passProps: {
          book,
        },
      },
    });
  });
});
