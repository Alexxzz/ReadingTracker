export abstract class Presenter<T> {
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
