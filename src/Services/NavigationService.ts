import { Book } from '../Screens/Main/Book';

export interface NavigationService {
  showBookScreen(componentId: string, book: Book): void;
}
