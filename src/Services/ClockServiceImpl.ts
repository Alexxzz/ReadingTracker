import { IClockService } from './IClockService';

export class ClockServiceImpl implements IClockService {
  public today = () => new Date();
}
