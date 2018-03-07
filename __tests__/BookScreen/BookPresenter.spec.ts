import {
  BookPresenter,
  BookPresenterViewModel,
  BookProgressProvider,
  ClockService,
  UserPageNumberInput,
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

class UserPageNumberInputStub implements UserPageNumberInput {
  pageNumberStub: string;
  reject: boolean;

  promptPageNumber(): Promise<string> {
    if (this.reject) return Promise.reject('Rejecting stub');
    return Promise.resolve(this.pageNumberStub);
  }
}

describe('BookPresenter', () => {
  let sut: BookPresenter;

  const clockServiceStub = new ClockServiceStub();
  const bookProgressProviderStub = new BookProgressProviderStub();
  let userPageNumberInputStub: UserPageNumberInputStub;

  let outputSpy: PresenterOutput<BookPresenterViewModel>;

  const todaysDate = new Date('01/01/2000');

  beforeEach(() => {
    const OutputSpy = jest.fn<PresenterOutput<BookPresenterViewModel>>(() => ({
      renderOutput: jest.fn(),
    }));
    outputSpy = new OutputSpy();
    clockServiceStub.todayStub = todaysDate;
    userPageNumberInputStub = new UserPageNumberInputStub();

    sut = new BookPresenter(
      clockServiceStub,
      bookProgressProviderStub,
      userPageNumberInputStub,
    );
    sut.setOutput(outputSpy);

    jest.resetAllMocks();
  });

  describe('adds logs', () => {
    it('outputs added logs', async () => {
      userPageNumberInputStub.pageNumberStub = '42';

      await sut.addProgress();

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [
          {
            page: 42,
            date: todaysDate,
          },
        ],
      });
    });

    it('adds current date to log', async () => {
      userPageNumberInputStub.pageNumberStub = '42';

      await sut.addProgress();

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [{
          page: 42,
          date: todaysDate,
        }],
      });
    });

    it('updates log if log for that day is already there', async () => {
      userPageNumberInputStub.pageNumberStub = '111';
      bookProgressProviderStub.restore.mockReturnValue(Promise.resolve(
        [{
          page: 42,
          date: todaysDate,
        }],
      ));

      await sut.start();
      await sut.addProgress();

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [{
          page: 111,
          date: todaysDate,
        }],
      });
    });

    it('does not output and does not add new log if input was not numeric', async () => {
      userPageNumberInputStub.pageNumberStub = 'Hai!';

      await sut.addProgress();

      expect(outputSpy.renderOutput).not.toBeCalled();
      expect(bookProgressProviderStub.store).not.toBeCalled();
    });

    it('does not output and does not add new log if input was rejected', async () => {
      userPageNumberInputStub.reject = true;

      await sut.addProgress();

      expect(outputSpy.renderOutput).not.toBeCalled();
      expect(bookProgressProviderStub.store).not.toBeCalled();
    });
  });

  describe('persistence', () => {
    it('stores added log', async () => {
      userPageNumberInputStub.pageNumberStub = '33';

      await sut.addProgress();

      expect(bookProgressProviderStub.store).toBeCalledWith([
        {
          page: 33,
          date: todaysDate,
        },
      ]);
    });

    describe('when started', () => {
      it('does not crash if no logs stored', async () => {
        bookProgressProviderStub.restore.mockReturnValue(Promise.resolve(null));
        userPageNumberInputStub.pageNumberStub = '33';

        await sut.start();
        await sut.addProgress();

        expect(outputSpy.renderOutput).toBeCalled();
      });

      it('restores logs and renders to output when started', async () => {
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
        bookProgressProviderStub.restore.mockReturnValue(Promise.resolve([]));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });

      it('catches errors', async () => {
        bookProgressProviderStub.restore.mockReturnValue(Promise.reject('any error'));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });
    });
  });
});
