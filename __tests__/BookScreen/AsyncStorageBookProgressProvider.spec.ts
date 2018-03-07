import {
  AsyncStorageBookProgressProvider,
} from '../../src/Services/AsyncStorageBookProgressProvider';
import { AsyncStorage } from 'react-native';

class AsyncStorageStub implements AsyncStorage {
  setItem = jest.fn();
  getItem = jest.fn();

  removeItem = jest.fn();
  mergeItem = jest.fn();
  clear = jest.fn();
  getAllKeys = jest.fn();
  multiGet = jest.fn();
  multiSet = jest.fn();
  multiRemove = jest.fn();
  multiMerge = jest.fn();
}

describe('Progress storage', () => {
  const asyncStorageStub = new AsyncStorageStub();
  const date1 = new Date('2018-02-25T18:17:14.593Z');
  const date2 = new Date('2018-02-25T18:17:14.593Z');

  it('stores progress to async storage', () => {
    const sut = new AsyncStorageBookProgressProvider(asyncStorageStub);

    sut.store([{
      page: 3,
      date: date1,
    }, {
      page: 15,
      date: date2,
    }]);

    expect(asyncStorageStub.setItem).toBeCalledWith(
      'BookProgressKey',
      '[{"page":3,"date":"2018-02-25T18:17:14.593Z"},' +
      '{"page":15,"date":"2018-02-25T18:17:14.593Z"}]',
    );
  });

  it('restores progress from async storage', async () => {
    const sut = new AsyncStorageBookProgressProvider(asyncStorageStub);
    asyncStorageStub.getItem.mockReturnValue(Promise.resolve(
      '[{"page":3,"date":"2018-02-25T18:17:14.593Z"},' +
      '{"page":15,"date":"2018-02-25T18:17:14.593Z"}]',
    ));

    const res = await sut.restore();

    expect(asyncStorageStub.getItem).toBeCalledWith('BookProgressKey');
    expect(res).toEqual([{
      page: 3,
      date: date1,
    }, {
      page: 15,
      date: date2,
    }]);
  });
});
