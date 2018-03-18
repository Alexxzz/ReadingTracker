export abstract class Presenter<T> {
  private output?: PresenterOutput<T>;

  renderToOutput(viewModel: Partial<T>): void {
    if (!this.output) throw `Output is not set!: ${this}`;
    this.output.renderOutput(viewModel);
  }

  setOutput(output: PresenterOutput<T>): void {
    this.output = output;
  }
}

export interface PresenterOutput<T> {
  renderOutput(viewModel: Partial<T>): void;
}

export const actionsKey = Symbol('actions');
export function action(proto: any, name: string) {
  if (proto.hasOwnProperty(actionsKey)) {
    proto[actionsKey].push(name);
  } else {
    Object.defineProperty(proto, actionsKey, { value: [name] });
  }
}
