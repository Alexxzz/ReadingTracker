import {
  MainPresenter,
  } from '../../src/Screens/Main/MainPresenter';
import { PresenterOutput } from '../../src/Presenter/Presenter';
import { createOutputSpy, GatewayStub, NavigationStub } from '../testDoubles';
import { MainPresenterViewModel } from '../../src/Screens/Main/MainPresenterViewModel';

const date1 = new Date('2018-02-25T18:17:14.593Z');
const date2 = new Date('2018-03-25T15:17:14.593Z');

describe('MainPresenter', () => {
  const gatewayStub = new GatewayStub();
  const navigationStub = new NavigationStub();
  const sut = new MainPresenter(gatewayStub, navigationStub);
  const outputSpy: PresenterOutput<MainPresenterViewModel> = createOutputSpy();
  sut.setOutput(outputSpy);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('when started', () => {
    it('restores books from gateway and outputs to presenter', async () => {
      const storedBooks = [
        {
          name: 'book 11',
          progress: [
            {
              page: 53,
              date: date1,
            },
          ],
        },
        {
          name: 'book 21',
          progress: [
            {
              page: 12,
              date: date1,
            },
          ],
        },
      ];
      gatewayStub.getAllBooks.mockReturnValue(storedBooks);

      await sut.start();

      expect(gatewayStub.getAllBooks).toBeCalled();
      expect(outputSpy.renderOutput).toBeCalledWith({
        books: [
          {
            name: 'book 11',
            progress: '53%',
          },
          {
            name: 'book 21',
            progress: '12%',
          },
        ],
      });
    });

    it('outputs nothing if no boos stored', async () => {
      gatewayStub.getAllBooks.mockReturnValue(null);

      await sut.start();

      expect(gatewayStub.getAllBooks).toBeCalled();
      expect(outputSpy.renderOutput).not.toBeCalled();
    });

    it('outputs as "0%" if book has no progress', async () => {
      gatewayStub.getAllBooks.mockReturnValue([
        {
          name: 'book 1',
          progress: [],
        },
      ]);

      await sut.start();

      expect(outputSpy.renderOutput).toBeCalledWith({
        books: [
          {
            name: 'book 1',
            progress: '0%',
          },
        ],
      });
    });
  });

  describe('when new book added', () => {
    it('outputs new book to presenter', async () => {
      gatewayStub.getAllBooks.mockReturnValue([
        {
          name: 'book 1',
          progress: [
            {
              page: 33,
              date: date1,
            },
          ],
        },
        {
          name: 'book 2',
          progress: [
            {
              page: 42,
              date: date2,
            },
          ],
        },
      ]);

      await sut.start();
      sut.addBook('book 3');
      sut.addBook('book 4');

      expect(outputSpy.renderOutput).toBeCalledWith({
        books: [
          {
            name: 'book 1',
            progress: '33%',
          },
          {
            name: 'book 2',
            progress: '42%',
          },
          {
            name: 'book 3',
            progress: '0%',
          },
          {
            name: 'book 4',
            progress: '0%',
          },
        ],
      });
    });

    it('stores added book', async () => {
      const storedBooks = [
        {
          name: 'book 11',
          progress: [
            {
              page: 53,
              date: date1,
            },
          ],
        },
        {
          name: 'book 21',
          progress: [
            {
              page: 12,
              date: date1,
            },
          ],
        },
      ];
      gatewayStub.getAllBooks.mockReturnValue(storedBooks);

      await sut.start();
      sut.addBook('new book');

      expect(gatewayStub.store).toBeCalledWith({
        name: 'new book',
        progress: [],
      });
    });
  });

  describe('when selected book in list', () => {
    it('navigates to book details using componentId', async () => {
      const book1 = {
        name: 'book 11',
        progress: [
          {
            page: 53,
            date: date1,
          },
        ],
      };
      const book2 = {
        name: 'book 21',
        progress: [
          {
            page: 12,
            date: date1,
          },
        ],
      };
      const storedBooks = [
        book1,
        book2,
      ];
      gatewayStub.getAllBooks.mockReturnValue(storedBooks);

      await sut.start();
      sut.selectBookAtIndex(1, 'componentId');

      expect(navigationStub.showBookScreen).toBeCalledWith('componentId', book2);
    });
  });
});
