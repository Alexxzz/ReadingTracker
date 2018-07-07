import { IBook } from '../Main/IBook';

export interface IBookPresenterInput {
  start(book: IBook): void;
  addProgress(): void;
}
