import { ClockService } from '../Screens/BookPresenter';

export class ClockServiceImpl implements ClockService {
  today = () => new Date();
}
