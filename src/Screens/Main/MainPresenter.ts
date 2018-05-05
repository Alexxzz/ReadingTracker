import { action, Presenter } from '../../Presenter/Presenter';
import { Book } from './Book';
import { MainPresenterInput } from './MainPresenterInput';
import { MainPresenterViewModel } from './MainPresenterViewModel';
import { Gateway } from '../Book/Gateway';
import { Progress } from '../Book/Progress';
import { Maybe } from '../../Utility/Maybe';
import { NavigationService } from '../../Services/NavigationService';

export class MainPresenter extends Presenter<MainPresenterViewModel> implements MainPresenterInput {
  private books: ReadonlyArray<Book> = [];

  constructor(
    private readonly gateway: Gateway,
    private readonly navigationService: NavigationService) {
    super();
  }

  @action
  async start(): Promise<void> {
    this.books = Maybe
      .create(await this.gateway.getAllBooks())
      .defaultTo([]);
    this.outputBooks();
  }

  @action
  addBook(name: string): void {
    const newBook: Book = {
      name,
      progress: [],
    };
    this.books = [
      ...this.books,
      newBook,
    ];

    this.outputBooks();

    this.gateway.store(newBook);
  }

  @action
  selectBookAtIndex(_index: number) {
    this.navigationService.showBookScreen('1');
  }

  private outputBooks() {
    if (this.books.length === 0) return;

    console.log('this.books: ', this.books);
    this.renderToOutput({
      books: this.books.map(b => ({
        name: b.name,
        progress: MainPresenter.getLastProgressFormatted(b.progress),
      })),
    });
  }

  private static getLastProgressFormatted(progress: Progress[]) {
    // return Maybe.create(progress)
    //   .map(p => Maybe.create(p[progress.length - 1]))
    //   .bind(p => p.map(progress => `${progress.page}%`))
    //   .defaultTo('0%');
    return Maybe.create(progress)
      .map(p => p[p.length - 1])
      .map(p => `${p.page}%`)
      .defaultTo('0%');
  }
}
