import { ReactNativeNavigationService } from '../../src/Services/ReactNativeNavigationService';

const date1 = new Date('2018-02-25T18:17:14.593Z');

class NavigationClassMock {
  push = jest.fn().mockReturnValue(Promise.resolve());
}

describe('ReactNativeNavigationService', () => {
  it('Navigates to BookScreen passing book in parameters', () => {
    const book = {
      name: 'book 11',
      progress: [
        {
          page: 53,
          date: date1,
        },
      ],
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
