import { Progress } from '../Screens/Book/BookPresenter';

export interface Gateway {
  store(progress: Progress[]): void;
  restore(): Promise<Progress[]>;
}
