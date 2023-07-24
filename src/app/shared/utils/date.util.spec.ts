import * as moment from 'moment';
import { DateUtil } from './date.util';

describe('DateUtil', () => {
  it('should return the correct year', () => {
    const date = '2023-07-24';
    const expectedYear = moment(date).year();

    const result = DateUtil.getYear(date);
    expect(result).toBe(expectedYear);
  });

  it('should return the correct month', () => {
    const date = '2023-07-24';
    const expectedMonth = moment(date).month();

    const result = DateUtil.getMonth(date);
    expect(result).toBe(expectedMonth);
  });
});
