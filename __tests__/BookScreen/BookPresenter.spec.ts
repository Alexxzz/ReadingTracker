import {
  BookPresenter,
  } from '../../src/Screens/Book/BookPresenter';
import { PresenterOutput } from '../../src/Presenter/Presenter';
import { ClockService } from '../../src/Services/ClockService';
import { UserPageNumberInput } from '../../src/Services/UserPageNumberInput';
import { createOutputSpy, GatewayStub } from '../testDoubles';
import { BookPresenterViewModel } from '../../src/Screens/Book/BookPresenterViewModel';
import { Book } from '../../src/Screens/Main/Book';

class ClockServiceStub implements ClockService {
  todayStub: Date = new Date();
  today = (): Date => this.todayStub;
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
  const outputSpy: PresenterOutput<BookPresenterViewModel> = createOutputSpy();
  const clockServiceStub = new ClockServiceStub();
  const gatewayStub = new GatewayStub();

  let sut: BookPresenter;

  let userPageNumberInputStub: UserPageNumberInputStub;

  const dayBefore = new Date('2018-03-07T12:00:00Z');
  const todaysDate = new Date('2018-03-08T12:00:00Z');

  beforeEach(() => {
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

  describe('when started', () => {
    it('does not crash if book has no progress', async () => {
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 21,
            date: dayBefore,
          },
          {
            page: 42,
            date: todaysDate,
          },
        ],
      };
      userPageNumberInputStub.pageNumberStub = '33';

      sut.start(book);
      await sut.addProgress();

      expect(outputSpy.renderOutput).toBeCalled();
    });

    it('renders to output provided book when started', () => {
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 42,
            date: todaysDate,
          },
        ],
      };

      sut.start(book);

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

    it('does not trigger render if no progress restored', () => {
      const book: Book = {
        name: 'Book 1',
        progress: [],
      };

      sut.start(book);

      expect(outputSpy.renderOutput).not.toBeCalled();
    });
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
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 21,
            date: dayBefore,
          },
        ],
      };
      userPageNumberInputStub.pageNumberStub = '42';

      sut.start(book);
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
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 21,
            date: dayBefore,
          },
          {
            page: 42,
            date: todaysDate,
          },
        ],
      };

      userPageNumberInputStub.pageNumberStub = '111';
      clockServiceStub.todayStub = todaysDate;

      sut.start(book);
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
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 21,
            date: dayBefore,
          },
          {
            page: 42,
            date: todaysDate,
          },
        ],
      };

      await sut.start(book);
      await sut.addProgress();

      expect(gatewayStub.store).toBeCalledWith({
        name: 'Book 1',
        progress: [
          {
            page: 21,
            date: dayBefore,
          },
          {
            page: 33,
            date: todaysDate,
          },
        ],
      });
    });

  });
  describe('Outputs Day of a log', () => {
    it('sets day number to a log index', () => {
      const book: Book = {
        name: 'Book 1',
        progress: [
          {
            page: 42,
            date: dayBefore,
          },
          {
            page: 100,
            date: todaysDate,
          },
        ],
      };

      sut.start(book);

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
