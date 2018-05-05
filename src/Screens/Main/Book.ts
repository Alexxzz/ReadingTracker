import { Progress } from '../Book/Progress';

export type Book = {
  name: string;
  progress: Progress[];
};

export const NullBook: Book = {
  name: '',
  progress: [],
};
