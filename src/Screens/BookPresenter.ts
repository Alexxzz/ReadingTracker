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
  addProgress(page: number): void;
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
    ) {
    super();
  }

  async start() {
    try {
      this.progress = await this.bookProgressProvider.restore();
      if (this.progress.length) {
        this.renderToOutput({
          progress: this.progress,
        });
      }
    } catch (e) {
      console.error('BookPresenter bookProgressProvider error: ', e);
    }
  }

  addProgress(page: number): void {
    const newProgress: Progress = {
      page,
      date: this.dateProvider.today(),
    };
    this.progress = [...this.progress, newProgress];
    this.renderToOutput({
      progress: this.progress,
    });
    this.bookProgressProvider.store(this.progress);
  }
}
