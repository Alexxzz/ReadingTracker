export class Presenter<T> {
  private output: PresenterOutput<T>;

  renderToOutput(viewModel: Partial<T>): void {
    this.output.renderOutput(viewModel);
  }

  setOutput(output: PresenterOutput<T>): void {
    this.output = output;
  }
}
export interface PresenterOutput<T> {
  renderOutput(viewModel: Partial<T>): void;
}

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
