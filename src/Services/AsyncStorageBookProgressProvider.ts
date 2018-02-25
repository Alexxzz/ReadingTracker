import { BookProgressProvider, Progress } from '../Screens/BookPresenter';
import { AsyncStorage } from 'react-native';

export class AsyncStorageBookProgressProvider implements BookProgressProvider {
  constructor(private readonly asyncStorage: AsyncStorage) {}

  store(progress: Progress[]): void {
    this.asyncStorage.setItem('key', JSON.stringify(progress));
  }

  restore(): Promise<Progress[]> {
    return Promise.reject('');
  }
}
