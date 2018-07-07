import { IBook } from '../Screens/Main/IBook';

export interface INavigationService {
  showBookScreen(componentId: string, book: IBook): void;
  showNewBookScreen(): void;
}
