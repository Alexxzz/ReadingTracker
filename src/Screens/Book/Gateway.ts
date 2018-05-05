import { Book } from '../Main/Book';

export interface Gateway {
  store(book: Book): void;
  getAllBooks(): Promise<Book[]>;
}
