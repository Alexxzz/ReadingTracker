import { BookProgressProvider, Progress } from '../Screens/BookPresenter';
import { AsyncStorage } from 'react-native';

const BookProgressKey = 'BookProgressKey';

const reviver = (key: string, value: any) => {
  if (key === 'date') return new Date(value);
  return value;
};

export class AsyncStorageBookProgressProvider implements BookProgressProvider {
  constructor(private readonly asyncStorage: AsyncStorage) {}

  store(progress: Progress[]): void {
    this.asyncStorage.setItem(BookProgressKey, JSON.stringify(progress));
  }

  async restore(): Promise<Progress[]> {
    try {
      const string = await this.asyncStorage.getItem(BookProgressKey);
      return JSON.parse(string, reviver);
    } catch (e) {
      console.log('AsyncStorageBookProgressProvider restore error: ', e);
      return Promise.resolve([]);
    }
  }
}
