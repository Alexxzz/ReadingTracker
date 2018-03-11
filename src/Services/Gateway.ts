import { Progress } from '../Screens/BookPresenter';

export interface Gateway {
  store(progress: Progress[]): void;
  restore(): Promise<Progress[]>;
}
