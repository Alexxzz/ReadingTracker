import { BookProgressProvider, ClockService } from '../Screens/BookPresenter';
import { ClockServiceImpl } from './DateProvider';
import { AsyncStorage } from 'react-native';
import { AsyncStorageBookProgressProvider } from './AsyncStorageBookProgressProvider';

export type Dependencies = {
  dateProvider: ClockService;
  progressStorageProvider: BookProgressProvider;
};

export const dependencies: Dependencies = {
  dateProvider: new ClockServiceImpl(),
  progressStorageProvider: new AsyncStorageBookProgressProvider(AsyncStorage),
};
