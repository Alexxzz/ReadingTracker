export interface IMainPresenterInput {
  start(): Promise<void>;
  addBook(): Promise<void>;
  selectBookAtIndex(index: number, componentId: string): void;
}
