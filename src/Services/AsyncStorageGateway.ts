import { IGateway } from '../Screens/Book/IGateway';
import { IBook } from '../Screens/Main/IBook';
import { inject, injectable } from 'inversify';
import { TYPES } from './Types';
import { IAsyncStorage } from './IAsyncStorage';

const BookProgressKey = 'BooksKey';

const reviver = (key: string, value: any) => {
  if (key === 'date') {
    return new Date(value);
  }
  return value;
};

@injectable()
export class AsyncStorageGateway implements IGateway {
  constructor(@inject(TYPES.AsyncStorage) private readonly asyncStorage: IAsyncStorage) {}

  public async getAllBooks(): Promise<IBook[]> {
    try {
      const string = await this.asyncStorage.getItem(BookProgressKey);
      return JSON.parse(string, reviver);
    } catch (e) {
      console.log('AsyncStorageGateway restore error: ', e);
      return Promise.resolve([]);
    }
  }

  public async store(book: IBook): Promise<void> {
    try {
      let storedBooks = await this.getAllBooks();
      if (!storedBooks) {
        storedBooks = [];
      }

      storedBooks = [
        ...storedBooks,
        book,
      ];
      this.asyncStorage.setItem(BookProgressKey, JSON.stringify(storedBooks));
    } catch (e) {
      console.log('AsyncStorageGateway store error: ', e);
      console.log('   book: ', book);
    }
  }
}
