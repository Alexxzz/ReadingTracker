import { Progress } from '../Screens/Book/BookPresenter';
import { AsyncStorage } from 'react-native';
import { Gateway } from './Gateway';

const BookProgressKey = 'BookProgressKey';

const reviver = (key: string, value: any) => {
  if (key === 'date') return new Date(value);
  return value;
};

export class AsyncStorageGateway implements Gateway {
  constructor(private readonly asyncStorage: AsyncStorage) {}

  store(progress: Progress[]): void {
    this.asyncStorage.setItem(BookProgressKey, JSON.stringify(progress));
  }

  async restore(): Promise<Progress[]> {
    try {
      const string = await this.asyncStorage.getItem(BookProgressKey);
      return JSON.parse(string, reviver);
    } catch (e) {
      console.log('AsyncStorageGateway restore error: ', e);
      return Promise.resolve([]);
    }
  }
}
