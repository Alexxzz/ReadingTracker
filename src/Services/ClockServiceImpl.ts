import { ClockService } from './ClockService';

export class ClockServiceImpl implements ClockService {
  today = () => new Date();
}
