import { Book } from '../Main/Book';

export interface BookPresenterInput {
  start(book: Book): void;
  addProgress(): void;
}
