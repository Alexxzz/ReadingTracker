export interface MainPresenterInput {
  start(): void;
  addBook(name: string): void;
  selectBookAtIndex(index: number, componentId: string): void;
}
