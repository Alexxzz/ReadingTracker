import isSameDay from 'date-fns/is_same_day';
import { Presenter } from '../Presenter/Presenter';
import { Gateway } from '../Services/Gateway';
import { ClockService } from './ClockService';
import { UserPageNumberInput } from './UserPageNumberInput';

export type Progress = {
  page: number;
  date: Date;
};

export type ProgressViewModel = {
  dayAndDate: string;
  fromPage: string;
  toPage: string;
  pagesRead: string;
};

// Input/VM
export type BookPresenterViewModel = {
  progress: ProgressViewModel[];
};

export interface BookPresenterInput {
  start(): void;
  addProgress(): void;
}

const mapProgressToVM =
  (progress: Progress, index: number, array: ReadonlyArray<Progress>): ProgressViewModel => {
    const fromPage = index > 0 ? array[index - 1].page : 0;
    const toPage = progress.page;
    const pagesRead = toPage - fromPage;
    return {
      dayAndDate: `Day ${index + 1} – ${progress.date.toDateString()}`,
      fromPage: `From page ${fromPage}`,
      toPage: `To page ${toPage}`,
      pagesRead: `${pagesRead} pages`,
    };
  };

export class BookPresenter extends Presenter<BookPresenterViewModel> implements BookPresenterInput {
  private progress: ReadonlyArray<Progress> = [];

  constructor(
    private readonly dateProvider: ClockService,
    private readonly gateway: Gateway,
    private readonly userPageNumberInput: UserPageNumberInput,
  ) {
    super();
  }

  start = async () => {
    try {
      const restoredProgress = await this.gateway.restore();
      if (restoredProgress && restoredProgress.length) {
        this.renderToOutput({
          progress: restoredProgress.map(mapProgressToVM),
        });
        this.progress = restoredProgress;
      }
    } catch (e) {
      console.info('BookPresenter gateway error: ', e);
    }
  }

  addProgress = async () => {
    try {
      const page = await this.userPageNumberInput.promptPageNumber();

      const pageNumber = Number(page);
      if (!pageNumber) return;

      const newProgress: Progress = {
        page: pageNumber,
        date: this.dateProvider.today(),
      };
      this.addOrUpdateProgress(newProgress);

      this.renderToOutput({
        progress: this.progress.map(mapProgressToVM),
      });

      this.gateway.store([...this.progress]);
    } catch (e) {
      console.log('BookPresenter userPageNumberInput.promptPageNumber error: ', e);
    }
  }

  private addOrUpdateProgress(newProgress: Progress) {
    if (this.progress.length === 0) {
      this.progress = [newProgress];
      return;
    }

    const sameDayIdx = this.progress.findIndex(p => isSameDay(p.date, newProgress.date));

    if (sameDayIdx >= 0) {
      this.progress = [
        ...this.progress.slice(0, sameDayIdx),
        newProgress,
        ...this.progress.slice(sameDayIdx + 1, this.progress.length),
      ];
      return;
    }

    this.progress = [...this.progress, newProgress];
  }
}
