// tslint:disable:max-classes-per-file

import { IPresenterOutput } from '../../src/Presenter/Presenter';
import { IGateway } from '../../src/Screens/Book/IGateway';
import { INavigationService } from '../../src/Services/INavigationService';
import { ISingleUserInput } from '../../src/Services/ISingleUserInput';
import { IClockService } from '../../src/Services/IClockService';
import { INewBook, INewBookUserInput } from '../../src/Screens/Main/MainPresenter';

export const createOutputSpy = <T>() => {
  const OutputSpy = jest.fn<IPresenterOutput<T>>(() => ({
    renderOutput: jest.fn(),
  }));
  return new OutputSpy();
};

export class GatewayStub implements IGateway {
  public store = jest.fn();
  public getAllBooks = jest.fn();
}

export class NavigationStub implements INavigationService {
  public showBookScreen = jest.fn();
  public showNewBookScreen = jest.fn();
}

export class ClockServiceStub implements IClockService {
  public todayStub: Date = new Date();
  public today = (): Date => this.todayStub;
}

export class AlertUserInputStub implements ISingleUserInput {
  public resolve: string = '';
  public reject: boolean = false;

  public promptUser = jest.fn(() => {
    if (this.reject) {
      return Promise.reject('Rejecting stub');
    }
    return Promise.resolve(this.resolve);
  });
}

export class NewBookUserInputStub implements INewBookUserInput {
  public resolve: INewBook = {
    name: '',
    totalPages: 0,
  };
  public reject: boolean = false;

  public promptUser = jest.fn(() => {
    if (this.reject) {
      return Promise.reject('Rejecting NewBookUserInputStub stub');
    }
    return Promise.resolve(this.resolve);
  });
}
