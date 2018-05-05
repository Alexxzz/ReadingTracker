import { AsyncStorage } from 'react-native';
import { Gateway } from '../Screens/Book/Gateway';
import { Book } from '../Screens/Main/Book';

const BookProgressKey = 'BooksKey';

const reviver = (key: string, value: any) => {
  if (key === 'date') return new Date(value);
  return value;
};

export class AsyncStorageGateway implements Gateway {
  constructor(private readonly asyncStorage: AsyncStorage) {}

  async getAllBooks(): Promise<Book[]> {
    try {
      const string = await this.asyncStorage.getItem(BookProgressKey);
      return JSON.parse(string, reviver);
    } catch (e) {
      console.log('AsyncStorageGateway restore error: ', e);
      return Promise.resolve([]);
    }
  }

  async store(book: Book): Promise<void> {
    try {
      let storedBooks = await this.getAllBooks();
      if (!storedBooks) storedBooks = [];

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
