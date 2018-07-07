import 'reflect-metadata';

import { NewBookInputPresenter } from '../../src/Screens/NewBook/NewBookInputPresenter';
import { NavigationStub } from '../testDoubles';

let sut: NewBookInputPresenter;
let navigationStub: NavigationStub;
describe('NewBookInputPresenter', () => {
  beforeEach(() => {
    navigationStub = new NavigationStub();
    sut = new NewBookInputPresenter(navigationStub);
  });

  describe('when promptUser called', () => {
    it('presents NewBookScreen', async () => {
      await sut.promptUser();
    });
  });
});
