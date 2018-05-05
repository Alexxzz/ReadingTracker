import isSameDay from 'date-fns/is_same_day';
import { action, Presenter } from '../../Presenter/Presenter';
import { Gateway } from './Gateway';
import { ClockService } from '../../Services/ClockService';
import { UserPageNumberInput } from '../../Services/UserPageNumberInput';
import { BookPresenterViewModel } from './BookPresenterViewModel';
import { ProgressViewModel } from './ProgressViewModel';
import { BookPresenterInput } from './BookPresenterInput';
import { Progress } from './Progress';
import { Book, NullBook } from '../Main/Book';

const mapProgressToVM =
  (progress: Progress, index: number, array: ReadonlyArray<Progress>): ProgressViewModel => {
    const fromPage = index > 0 ? array[index - 1].page : 0;
    const toPage = progress.page;
    const pagesRead = toPage - fromPage;
    return {
      dayAndDate: `Day ${index + 1} – ${progress.date.toDateString()}`,
      fromPage: `From page ${fromPage}`,
      toPage: `To page ${toPage}`,
      pagesRead: `${pagesRead} pages`,
    };
  };

export class BookPresenter extends Presenter<BookPresenterViewModel> implements BookPresenterInput {
  private book: Book = NullBook;

  constructor(
    private readonly dateProvider: ClockService,
    private readonly gateway: Gateway,
    private readonly userPageNumberInput: UserPageNumberInput,
  ) {
    super();
  }

  @action
  start(book: Book) {
    this.book = book;

    if (book.progress.length === 0) return;

    this.renderToOutput({
      progress: book.progress.map(mapProgressToVM),
    });
  }

  @action
  addProgress = async () => {
    try {
      const page = await this.userPageNumberInput.promptPageNumber();

      const pageNumber = Number(page);
      if (!pageNumber) return;

      const newProgress: Progress = {
        page: pageNumber,
        date: this.dateProvider.today(),
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
