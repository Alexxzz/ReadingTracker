import { PresenterOutput } from '../../src/Presenter/Presenter';
import { Gateway } from '../../src/Screens/Book/Gateway';
import { NavigationService } from '../../src/Services/NavigationService';

export const createOutputSpy = <T>() => {
  const OutputSpy = jest.fn<PresenterOutput<T>>(() => ({
    renderOutput: jest.fn(),
  }));
  return new OutputSpy;
};

export class GatewayStub implements Gateway {
  store = jest.fn();
  getAllBooks = jest.fn();
}

export class NavigationStub implements NavigationService {
  showBookScreen = jest.fn();
}
