import {
  AsyncStorageGateway,
} from '../../src/Services/AsyncStorageGateway';
import { AsyncStorage } from 'react-native';
import { Book } from '../../src/Screens/Main/Book';

class AsyncStorageStub implements AsyncStorage {
  setItem = jest.fn();
  getItem = jest.fn();

  removeItem = jest.fn();
  mergeItem = jest.fn();
  clear = jest.fn();
  getAllKeys = jest.fn();
  multiGet = jest.fn();
  multiSet = jest.fn();
  multiRemove = jest.fn();
  multiMerge = jest.fn();
}

describe('Progress storage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const asyncStorageStub = new AsyncStorageStub();
  const date1 = new Date('2018-02-25T18:17:14.593Z');
  const date2 = new Date('2018-03-04T15:17:14.593Z');

  describe('store', () => {
    it('stores progress to async storage', async () => {
      const sut = new AsyncStorageGateway(asyncStorageStub);
      asyncStorageStub.getItem.mockReturnValue(Promise.resolve(
        '[{"name":"Book 1",' +
        '"progress":' +
        '[{"page":3,"date":"2018-01-05T18:16:14.593Z"},' +
        '{"page":15,"date":"2018-02-14T15:12:14.593Z"}]}]',
      ));

      const book: Book = {
        name: 'Book 2',
        progress: [
          {
            page: 67,
            date: date1,
          }, {
            page: 88,
            date: date2,
          },
        ],
      };

      await sut.store(book);

      expect(asyncStorageStub.setItem).toBeCalledWith(
        'BooksKey',
        '[' +
        '{"name":"Book 1",' +
        '"progress":' +
        '[{"page":3,"date":"2018-01-05T18:16:14.593Z"},' +
        '{"page":15,"date":"2018-02-14T15:12:14.593Z"}]},' +
        '{"name":"Book 2",' +
        '"progress":' +
        '[{"page":67,"date":"2018-02-25T18:17:14.593Z"},' +
        '{"page":88,"date":"2018-03-04T15:17:14.593Z"}]}' +
        ']',
      );
    });

    describe('when no books stored', () => {
      it('stores first book', async () => {
        const sut = new AsyncStorageGateway(asyncStorageStub);
        asyncStorageStub.getItem.mockReturnValue(Promise.resolve(null));
        const book: Book = {
          name: 'Book 2',
          progress: [
            {
              page: 67,
              date: date1,
            }, {
              page: 88,
              date: date2,
            },
          ],
        };

        await sut.store(book);

        expect(asyncStorageStub.setItem).toBeCalledWith(
          'BooksKey',
          '[' +
          '{"name":"Book 2",' +
          '"progress":' +
          '[{"page":67,"date":"2018-02-25T18:17:14.593Z"},' +
          '{"page":88,"date":"2018-03-04T15:17:14.593Z"}]}' +
          ']',
        );
      });
    });
  });

  describe('restore', () => {
    it('restores progress from async storage', async () => {
      const sut = new AsyncStorageGateway(asyncStorageStub);
      asyncStorageStub.getItem.mockReturnValue(Promise.resolve(
        '[{"name":"Book 1",' +
        '"progress":' +
        '[{"page":3,"date":"2018-02-25T18:17:14.593Z"},' +
        '{"page":15,"date":"2018-03-04T15:17:14.593Z"}]}]',
      ));

      const res = await sut.getAllBooks();

      expect(asyncStorageStub.getItem).toBeCalledWith('BooksKey');
      expect(res).toEqual([{
        name: 'Book 1',
        progress: [
          {
            page: 3,
            date: date1,
          }, {
            page: 15,
            date: date2,
          },
        ],
      }]);
    });

    it('catches error and returns empty array', async () => {
      const sut = new AsyncStorageGateway(asyncStorageStub);
      asyncStorageStub.getItem.mockReturnValue(Promise.reject('test reject'));

      const books = await sut.getAllBooks();

      expect(books).toHaveLength(0);
    });
  });
});
