import { INewBook, INewBookUserInput } from '../Main/MainPresenter';
import { INavigationService } from '../../Services/INavigationService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../Services/Types';

@injectable()
export class NewBookInputPresenter implements INewBookUserInput {
  constructor(@inject(TYPES.NavigationService) private readonly navigation: INavigationService) {}

  public promptUser(): Promise<INewBook> {
    console.log('navigation', this.navigation);
    return Promise.resolve({
      name: '',
      totalPages: 0,
    });
  }
}
