import isSameDay from 'date-fns/is_same_day';
import { action, Presenter } from '../../Presenter/Presenter';
import { IGateway } from './IGateway';
import { IClockService } from '../../Services/IClockService';
import { ISingleUserInput } from '../../Services/ISingleUserInput';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { ProgressViewModel } from './ProgressViewModel';
import { IBookPresenterInput } from './IBookPresenterInput';
import { Progress } from './Progress';
import { IBook, NullBook } from '../Main/IBook';

const mapProgressToVM =
  (progress: Progress, index: number, array: ReadonlyArray<Progress>): ProgressViewModel => {
    const fromPage = index > 0 ? array[index - 1].page : 0;
    const toPage = progress.page;
    const pagesRead = toPage - fromPage;
    return {
      dayAndDate: `Day ${index + 1} – ${progress.date.toDateString()}`,
      fromPage: `From page ${fromPage}`,
      pagesRead: `${pagesRead} pages`,
      toPage: `To page ${toPage}`,
    };
  };

export class BookPresenter extends Presenter<BookPresenterViewModel> implements IBookPresenterInput {
  private book: IBook = NullBook;

  constructor(
    private readonly dateProvider: IClockService,
    private readonly gateway: IGateway,
    private readonly userPageNumberInput: ISingleUserInput,
  ) {
    super();
  }

  @action
  public start(book: IBook) {
    this.book = book;

    if (book.progress.length === 0) {
      return;
    }

    this.renderToOutput({
      progress: book.progress.map(mapProgressToVM),
    });
  }

  @action
  public addProgress = async () => {
    try {
      const page = await this.userPageNumberInput.promptUser({
        promptText: 'Please enter the page you stopped today',
      });

      const pageNumber = Number(page);
      if (!pageNumber) {
        return;
      }

      const newProgress: Progress = {
        date: this.dateProvider.today(),
        page: pageNumber,
      };
      this.addOrUpdateProgress(newProgress);

      this.renderToOutput({
        progress: this.book.progress.map(mapProgressToVM),
      });

      this.gateway.store(this.book);
    } catch (e) {
      console.log('BookPresenter userPageNumberInput.promptPageNumber error: ', e);
    }
  }

  private addOrUpdateProgress(newProgress: Progress) {
    if (this.book.progress.length === 0) {
      this.book.progress = [newProgress];
      return;
    }

    const sameDayIdx = this.book.progress.findIndex(p => isSameDay(p.date, newProgress.date));

    if (sameDayIdx >= 0) {
      this.book.progress = [
        ...this.book.progress.slice(0, sameDayIdx),
        newProgress,
        ...this.book.progress.slice(sameDayIdx + 1, this.book.progress.length),
      ];
      return;
    }

    this.book.progress = [...this.book.progress, newProgress];
  }
}
