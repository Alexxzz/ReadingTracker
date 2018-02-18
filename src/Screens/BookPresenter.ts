import { Presenter } from '../Presenter/Presenter';

export type BookPresenterViewModel = {
  progress: number[];
};

export type BookPresenterInput = {
  addProgress(page: number): void;
};

export class BookPresenter extends Presenter<BookPresenterViewModel> implements BookPresenterInput {
  private progress: number[] = [];

  addProgress = (page: number): void => {
    this.progress = [...this.progress, page];
    this.renderToOutput({
      progress: this.progress,
    });
  }
}
