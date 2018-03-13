import {
  BookPresenter,
  BookPresenterViewModel,
  } from '../../src/Screens/Book/BookPresenter';
import { PresenterOutput } from '../../src/Presenter/Presenter';
import { Gateway } from '../../src/Services/Gateway';
import { ClockService } from '../../src/Services/ClockService';
import { UserPageNumberInput } from '../../src/Services/UserPageNumberInput';

class ClockServiceStub implements ClockService {
  todayStub: Date = new Date();
  today = (): Date => this.todayStub;
}

class GatewayStub implements Gateway {
  store = jest.fn();
  restore = jest.fn();
}

class UserPageNumberInputStub implements UserPageNumberInput {
  pageNumberStub: string = '';
  reject: boolean = false;

  promptPageNumber(): Promise<string> {
    if (this.reject) return Promise.reject('Rejecting stub');
    return Promise.resolve(this.pageNumberStub);
  }
}

describe('BookPresenter', () => {
  let sut: BookPresenter;

  const clockServiceStub = new ClockServiceStub();
  const gatewayStub = new GatewayStub();
  let userPageNumberInputStub: UserPageNumberInputStub;

  let outputSpy: PresenterOutput<BookPresenterViewModel>;

  const dayBefore = new Date('2018-03-07T12:00:00Z');
  const todaysDate = new Date('2018-03-08T12:00:00Z');

  beforeEach(() => {
    const OutputSpy = jest.fn<PresenterOutput<BookPresenterViewModel>>(() => ({
      renderOutput: jest.fn(),
    }));
    outputSpy = new OutputSpy();
    clockServiceStub.todayStub = todaysDate;
    userPageNumberInputStub = new UserPageNumberInputStub();

    sut = new BookPresenter(
      clockServiceStub,
      gatewayStub,
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
            dayAndDate: 'Day 1 – Thu Mar 08 2018',
            fromPage: 'From page 0',
            toPage: 'To page 42',
            pagesRead: '42 pages',
          },
        ],
      });
    });

    it('adds current date to log', async () => {
      gatewayStub.restore.mockReturnValue(Promise.resolve(
        [
          {
            page: 21,
            date: dayBefore,
          },
        ],
      ));
      userPageNumberInputStub.pageNumberStub = '42';

      await sut.start();
      await sut.addProgress();

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [
          {
            dayAndDate: 'Day 1 – Wed Mar 07 2018',
            fromPage: 'From page 0',
            toPage: 'To page 21',
            pagesRead: '21 pages',
          },
          {
            dayAndDate: 'Day 2 – Thu Mar 08 2018',
            fromPage: 'From page 21',
            toPage: 'To page 42',
            pagesRead: '21 pages',
          },
        ],
      });
    });

    it('updates log if log for that day is already there', async () => {
      userPageNumberInputStub.pageNumberStub = '111';
      clockServiceStub.todayStub = todaysDate;
      gatewayStub.restore.mockReturnValue(Promise.resolve(
        [
          {
            page: 21,
            date: dayBefore,
          },
          {
            page: 42,
            date: todaysDate,
          },
        ],
      ));

      await sut.start();
      await sut.addProgress();

      expect(outputSpy.renderOutput).lastCalledWith({
        progress: [
          {
            dayAndDate: 'Day 1 – Wed Mar 07 2018',
            fromPage: 'From page 0',
            toPage: 'To page 21',
            pagesRead: '21 pages',
          },
          {
            dayAndDate: 'Day 2 – Thu Mar 08 2018',
            fromPage: 'From page 21',
            toPage: 'To page 111',
            pagesRead: '90 pages',
          },
        ],
      });
    });

    it('does not output and does not add new log if input was not numeric', async () => {
      userPageNumberInputStub.pageNumberStub = 'Hai!';

      await sut.addProgress();

      expect(outputSpy.renderOutput).not.toBeCalled();
      expect(gatewayStub.store).not.toBeCalled();
    });

    it('does not output and does not add new log if input was rejected', async () => {
      userPageNumberInputStub.reject = true;

      await sut.addProgress();

      expect(outputSpy.renderOutput).not.toBeCalled();
      expect(gatewayStub.store).not.toBeCalled();
    });
  });

  describe('persistence', () => {
    it('stores added log', async () => {
      userPageNumberInputStub.pageNumberStub = '33';

      await sut.addProgress();

      expect(gatewayStub.store).toBeCalledWith([
        {
          page: 33,
          date: todaysDate,
        },
      ]);
    });

    describe('when started', () => {
      it('does not crash if no logs stored', async () => {
        gatewayStub.restore.mockReturnValue(Promise.resolve(null));
        userPageNumberInputStub.pageNumberStub = '33';

        await sut.start();
        await sut.addProgress();

        expect(outputSpy.renderOutput).toBeCalled();
      });

      it('restores logs and renders to output when started', async () => {
        gatewayStub.restore.mockReturnValue(Promise.resolve(
          [{
            page: 42,
            date: todaysDate,
          }],
        ));

        await sut.start();

        expect(outputSpy.renderOutput).toBeCalledWith({
          progress: [
            {
              dayAndDate: 'Day 1 – Thu Mar 08 2018',
              fromPage: 'From page 0',
              toPage: 'To page 42',
              pagesRead: '42 pages',
            },
          ],
        });
      });

      it('does not trigger render if no progress restored', async () => {
        gatewayStub.restore.mockReturnValue(Promise.resolve([]));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });

      it('catches errors', async () => {
        gatewayStub.restore.mockReturnValue(Promise.reject('any error'));

        await sut.start();

        expect(outputSpy.renderOutput).not.toBeCalled();
      });
    });
  });

  describe('Outputs Day of a log', () => {
    it('sets day number to a log index', async () => {
      gatewayStub.restore.mockReturnValue(Promise.resolve(
        [
          {
            page: 42,
            date: dayBefore,
          },
          {
            page: 100,
            date: todaysDate,
          },
        ],
      ));

      await sut.start();

      expect(outputSpy.renderOutput).toBeCalledWith({
        progress: [
          {
            dayAndDate: 'Day 1 – Wed Mar 07 2018',
            fromPage: 'From page 0',
            toPage: 'To page 42',
            pagesRead: '42 pages',
          },
          {
            dayAndDate: 'Day 2 – Thu Mar 08 2018',
            fromPage: 'From page 42',
            toPage: 'To page 100',
            pagesRead: '58 pages',
          },
        ],
      });
    });
  });
});
