import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './Services/Types';
import { IGateway } from './Screens/Book/IGateway';
import { AsyncStorageGateway } from './Services/AsyncStorageGateway';
import { INavigationService } from './Services/INavigationService';
import { ReactNativeNavigationService } from './Services/ReactNativeNavigationService';
import { INewBookUserInput, MainPresenter } from './Screens/Main/MainPresenter';
import { NewBookInputPresenter } from './Screens/NewBook/NewBookInputPresenter';
import { Presenter } from './Presenter/Presenter';
import { IMainPresenterViewModel } from './Screens/Main/IMainPresenterViewModel';
import { IAsyncStorage } from './Services/IAsyncStorage';
import { NavigationClass, Navigation } from 'react-native-navigation';
import { AsyncStorage } from 'react-native';

export const container = new Container();

// Services
container.bind<IAsyncStorage>(TYPES.AsyncStorage).toConstantValue(AsyncStorage);
container.bind<NavigationClass>(TYPES.Navigator).toConstantValue(Navigation);

container.bind<IGateway>(TYPES.Gateway).to(AsyncStorageGateway);
container.bind<INavigationService>(TYPES.NavigationService).to(ReactNativeNavigationService);
container.bind<INewBookUserInput>(TYPES.NewBookUserInput).to(NewBookInputPresenter);

// Presenters
container.bind<Presenter<IMainPresenterViewModel>>(TYPES.MainPresenter).to(MainPresenter);
