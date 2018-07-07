import { IBook } from '../Main/IBook';

export interface IGateway {
  store(book: IBook): void;
  getAllBooks(): Promise<IBook[]>;
}
