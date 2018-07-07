import { action, Presenter } from '../../Presenter/Presenter';
import { IBook } from './IBook';
import { IMainPresenterInput } from './IMainPresenterInput';
import { IMainPresenterViewModel } from './IMainPresenterViewModel';
import { IGateway } from '../Book/IGateway';
import { Progress } from '../Book/Progress';
import { Maybe } from '../../Utility/Maybe';
import { INavigationService } from '../../Services/INavigationService';
import { TYPES } from '../../Services/Types';
import { inject, injectable } from 'inversify';

export interface INewBook {
  name: string;
  totalPages: number;
}

export interface INewBookUserInput {
  promptUser(): Promise<INewBook>;
}

@injectable()
export class MainPresenter extends Presenter<IMainPresenterViewModel> implements IMainPresenterInput {
  private static getLastProgressFormatted(progress: Progress[]) {
    return Maybe.create(progress)
      .map(p => p[p.length - 1])
      .map(p => `${p.page}%`)
      .defaultTo('0%');
  }

  private books: ReadonlyArray<IBook> = [];

  constructor(
    @inject(TYPES.Gateway) private readonly gateway: IGateway,
    @inject(TYPES.NavigationService) private readonly navigationService: INavigationService,
    @inject(TYPES.NewBookUserInput) private readonly userInput: INewBookUserInput,
  ) {
    super();
  }

  @action
  public async start() {
    this.books = Maybe
      .create(await this.gateway.getAllBooks())
      .defaultTo([]);
    this.outputBooks();
  }

  @action
  public async addBook() {
    try {
      const newBookParams = await this.userInput.promptUser();

      const newBook: IBook = {
        name: newBookParams.name,
        total: newBookParams.totalPages,
        progress: [],
      };
      this.books = [
        ...this.books,
        newBook,
      ];

      this.outputBooks();

      this.gateway.store(newBook);
    } catch (e) {
      console.log('addBook error: ', e);
    }
  }

  @action
  public selectBookAtIndex(index: number, componentId: string) {
    const book = this.books[index];
    this.navigationService.showBookScreen(componentId, book);
  }

  private outputBooks() {
    if (this.books.length === 0) {
      return;
    }

    console.log('this.books: ', this.books);
    this.renderToOutput({
      books: this.books.map(b => ({
        name: b.name,
        total: b.total,
        progress: MainPresenter.getLastProgressFormatted(b.progress),
      })),
    });
  }
}
