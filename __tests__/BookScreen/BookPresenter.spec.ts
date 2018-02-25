import {
  BookPresenter,
  BookPresenterViewModel, BookProgressProvider, ClockService,
} from '../../src/Screens/BookPresenter';
import { PresenterOutput } from '../../src/Presenter/Presenter';

class ClockServiceStub implements ClockService {
  todayStub: Date;
  today = (): Date => this.todayStub;
}

class BookProgressProviderStub implements BookProgressProvider {
  store = jest.fn();
  restore = jest.fn();
}

describe('BookPresenter', () => {
  let outputSpy: PresenterOutput<BookPresenterViewModel>;
  const clockServiceStub = new ClockServiceStub();
  const bookProgressProviderStub = new BookProgressProviderStub();
  const todaysDate = new Date('01/01/2000');
  beforeEach(() => {
    const OutputSpy = jest.fn<PresenterOutput<BookPresenterViewModel>>(() => ({
      renderOutput: jest.fn(),
    }));
    outputSpy = new OutputSpy();
    clockServiceStub.todayStub = todaysDate;
  });

  describe('adds logs', () => {
    it('outputs added logs', () => {
      const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
      sut.setOutput(outputSpy);

      sut.addProgress(42);
      sut.addProgress(99);

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [
          {
            page: 42,
            date: todaysDate,
          },
          {
            page: 99,
            date: todaysDate,
          },
        ],
      });
    });

    it('adds current date to log', () => {
      const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
      sut.setOutput(outputSpy);

      sut.addProgress(42);

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [{
          page: 42,
          date: todaysDate,
        }],
      });
    });
  });

  describe('persistence', () => {
    it('stores added log', () => {
      const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
      sut.setOutput(outputSpy);

      sut.addProgress(33);

      expect(bookProgressProviderStub.store).toBeCalledWith([
        {
          page: 33,
          date: todaysDate,
        },
      ]);
    });

    describe('when started', () => {
      it('restores logs and renders to output when started', async () => {
        const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
        sut.setOutput(outputSpy);
        bookProgressProviderStub.restore.mockReturnValue(Promise.resolve(
          [{
            page: 42,
            date: todaysDate,
          }],
        ));

        await sut.start();

        expect(outputSpy.renderOutput).toBeCalledWith({
          progress: [{
            page: 42,
            date: todaysDate,
          }],
        });
      });

      it('does not trigger render if no progress restored', async () => {
        const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
        sut.setOutput(outputSpy);
        bookProgressProviderStub.restore.mockReturnValue(Promise.resolve([]));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });

      it('catches errors', async () => {
        const sut = new BookPresenter(clockServiceStub, bookProgressProviderStub);
        sut.setOutput(outputSpy);
        bookProgressProviderStub.restore.mockReturnValue(Promise.reject('any error'));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });
    });
  });
});
