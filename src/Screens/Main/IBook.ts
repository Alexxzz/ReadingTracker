import { Progress } from '../Book/Progress';

export interface IBook {
  name: string;
  progress: Progress[];
  total: number;
}

export const NullBook: IBook = {
  name: '',
  progress: [],
  total: 0,
};
