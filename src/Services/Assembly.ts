import { AsyncStorage } from 'react-native';
import { UserPageNumberInput } from '../Screens/UserPageNumberInput';
import { ClockServiceImpl } from './ClockService';
import { AsyncStorageGateway } from './AsyncStorageGateway';
import { AlertUserPageNumberInput } from './AlertUserPageNumberInput';
import { Gateway } from './Gateway';
import { ClockService } from '../Screens/ClockService';

export type Dependencies = {
  dateProvider: ClockService;
  progressStorageProvider: Gateway;
  userPageNumberInput: UserPageNumberInput;
};

export const dependencies: Dependencies = {
  dateProvider: new ClockServiceImpl(),
  progressStorageProvider: new AsyncStorageGateway(AsyncStorage),
  userPageNumberInput: new AlertUserPageNumberInput(),
};
