import { Presenter } from '../Presenter/Presenter';

export interface ClockService {
  today(): Date;
}

export interface BookProgressProvider {
  store(progress: Progress[]): void;
  restore(): Promise<Progress[]>;
}

export type BookPresenterViewModel = {
  progress: Progress[];
};

export interface BookPresenterInput {
  start(): void;
  addProgress(): void;
}

export interface UserPageNumberInput {
  promptPageNumber(): Promise<string>;
}

export type Progress = {
  page: number;
  date: Date;
};

export class BookPresenter extends Presenter<BookPresenterViewModel> implements BookPresenterInput {
  private progress: Progress[] = [];

  constructor(
    private readonly dateProvider: ClockService,
    private readonly bookProgressProvider: BookProgressProvider,
    private readonly userPageNumberInput: UserPageNumberInput,
  ) {
    super();
  }

  start = async () => {
    try {
      const restoredProgress = await this.bookProgressProvider.restore();
      if (restoredProgress && restoredProgress.length) {
        this.renderToOutput({
          progress: restoredProgress,
        });
        this.progress = restoredProgress;
      }
    } catch (e) {
      console.info('BookPresenter bookProgressProvider error: ', e);
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
        progress: this.progress,
      });
      this.bookProgressProvider.store(this.progress);
    } catch (e) {
      console.log('BookPresenter userPageNumberInput.promptPageNumber error: ', e);
    }
  }

  private addOrUpdateProgress(newProgress: Progress) {
    if (this.progress.length === 0) {
      this.progress = [newProgress];
      return;
    }
    this.progress = this.progress.map((progress) => {
      if (
        progress.date.getUTCFullYear() === newProgress.date.getUTCFullYear() &&
        progress.date.getUTCMonth() === newProgress.date.getUTCMonth() &&
        progress.date.getUTCDay() === newProgress.date.getUTCDay()
      ) {
        return newProgress;
      }
      return progress;
    });
  }
}
