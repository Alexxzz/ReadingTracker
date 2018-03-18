import { action, Presenter } from '../../Presenter/Presenter';

export interface MainPresenterInput {
  addBook(): void;
  start(): void;
}

export interface MainPresenterViewModel {
}

export class MainPresenter extends Presenter<MainPresenterViewModel> implements MainPresenterInput {
  @action
  addBook() {
    console.log('MainPresenter addBook!!!');
  }

  start() {

  }
}
