import 'reflect-metadata';
import {
  MainPresenter,
  } from '../../src/Screens/Main/MainPresenter';
import { IPresenterOutput } from '../../src/Presenter/Presenter';
import { createOutputSpy, GatewayStub, NavigationStub, NewBookUserInputStub } from '../testDoubles';
import { IMainPresenterViewModel } from '../../src/Screens/Main/IMainPresenterViewModel';

const date1 = new Date('2018-02-25T18:17:14.593Z');
const date2 = new Date('2018-03-25T15:17:14.593Z');

const createNewBook = (name = '', totalPages = 0) => ({
  name,
  totalPages,
});

describe('MainPresenter', () => {
  const gatewayStub = new GatewayStub();
  const navigationStub = new NavigationStub();
  let newBookUserInputStub: NewBookUserInputStub;
  let sut: MainPresenter;
  const outputSpy: IPresenterOutput<IMainPresenterViewModel> = createOutputSpy();

  beforeEach(() => {
    jest.resetAllMocks();

    newBookUserInputStub = new NewBookUserInputStub();
    sut = new MainPresenter(gatewayStub, navigationStub, newBookUserInputStub);
    sut.setOutput(outputSpy);
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

    it('outputs nothing if no books are stored', async () => {
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

  describe('when adding new book', () => {
    it('asks user for a book name', async () => {
      newBookUserInputStub.resolve = createNewBook('any book name');

      await sut.addBook();

      expect(newBookUserInputStub.promptUser).toBeCalledWith();
    });

    it('asks user for total pages', async () => {
      newBookUserInputStub.resolve = createNewBook('some book', 152);

      await sut.addBook();

      expect(outputSpy.renderOutput).toBeCalledWith({
        books: [
          {
            name: 'some book',
            progress: '0%',
            total: 152,
          },
        ],
      });
    });

    it('does nothing if user cancels', async () => {
      newBookUserInputStub.reject = true;

      await sut.addBook();

      expect(outputSpy.renderOutput).not.toBeCalled();
    });
  });

  describe('when new book added', () => {
    it('outputs new book to presenter', async () => {
      gatewayStub.getAllBooks.mockReturnValue([
        {
          name: 'book 1',
          total: 0,
          progress: [
            {
              page: 33,
              date: date1,
            },
          ],
        },
        {
          name: 'book 2',
          total: 0,
          progress: [
            {
              page: 42,
              date: date2,
            },
          ],
        },
      ]);

      await sut.start();
      newBookUserInputStub.resolve = createNewBook('book 3');
      await sut.addBook();
      newBookUserInputStub.resolve = createNewBook('book 4');
      await sut.addBook();

      expect(outputSpy.renderOutput).toBeCalledWith({
        books: [
          {
            name: 'book 1',
            progress: '33%',
            total: 0,
          },
          {
            name: 'book 2',
            progress: '42%',
            total: 0,
          },
          {
            name: 'book 3',
            progress: '0%',
            total: 0,
          },
          {
            name: 'book 4',
            progress: '0%',
            total: 0,
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
      newBookUserInputStub.resolve = createNewBook('new book');
      await sut.addBook();

      expect(gatewayStub.store).toBeCalledWith({
        name: 'new book',
        progress: [],
        total: 0,
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
