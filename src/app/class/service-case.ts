
import * as moment from 'moment';

export class ServiceCase {
  id: number;
  start: any;
  end: any;
  title: string;
  color: string;
  resizable: {
    beforeStart: boolean,
    afterEnd: boolean
  };
  draggable: boolean;
  staff: string;
  staff_id: number;
  className: string;
  company: string;
  url: string;
  status: string;
}
