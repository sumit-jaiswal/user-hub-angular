import * as moment from 'moment';

export class DateUtil {
  static getYear(date: any) {
    return moment(date).year();
  }

  static getMonth(date: any) {
    return moment(date).month();
  }
}
