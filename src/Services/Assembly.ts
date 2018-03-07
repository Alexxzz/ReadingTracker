import { AsyncStorage } from 'react-native';
import { BookProgressProvider, ClockService, UserPageNumberInput } from '../Screens/BookPresenter';
import { ClockServiceImpl } from './ClockService';
import { AsyncStorageBookProgressProvider } from './AsyncStorageBookProgressProvider';
import { AlertUserPageNumberInput } from './AlertUserPageNumberInput';

export type Dependencies = {
  dateProvider: ClockService;
  progressStorageProvider: BookProgressProvider;
  userPageNumberInput: UserPageNumberInput;
};

export const dependencies: Dependencies = {
  dateProvider: new ClockServiceImpl(),
  progressStorageProvider: new AsyncStorageBookProgressProvider(AsyncStorage),
  userPageNumberInput: new AlertUserPageNumberInput(),
};
