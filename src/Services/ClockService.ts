import { ClockService } from '../Screens/ClockService';

export class ClockServiceImpl implements ClockService {
  today = () => new Date();
}
