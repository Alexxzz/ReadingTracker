import {
  BookPresenter,
  BookPresenterViewModel,
  PresenterOutput,
} from '../../src/Screens/BookPresenter';

describe('BookPresenter', () => {
  it('outputs added logs', () => {
    const Spy = jest.fn<PresenterOutput<BookPresenterViewModel>>(() => ({
      renderOutput: jest.fn(),
    }));
    const spy = new Spy();
    const sut = new BookPresenter();
    sut.setOutput(spy);

    sut.addProgress(42);
    sut.addProgress(99);

    expect(spy.renderOutput).lastCalledWith({
      progress: [42, 99],
    });
  });
});
