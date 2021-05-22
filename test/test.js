const assert = require('assert');
const parseTime = require('../lib/parseTime');

describe('parseTime', () => {
  it('Single or double-digits less than 12 return time in am by default', () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(parseTime(`${i}`).formattedTime, `${i}:00 am`);
    }
  });
  it('Single or double-digits less than 12 return time in pm if "pm" is passed as an optional parameter', () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(parseTime(`${i}`, { defaultTimeOfDay: 'pm' }).formattedTime, `${i}:00 pm`);
    }
  });
  it('0 returns 12:00 am', () => {
    assert.strictEqual(parseTime('0').formattedTime, '12:00 am');
  });
  it('12 returns 12:00 am or pm depending on the optional "defaultTimeOfDay" paramter (am, by default)', () => {
    assert.strictEqual(parseTime('12').formattedTime, '12:00 am');
    assert.strictEqual(parseTime('12', { defaultTimeOfDay: 'pm' }).formattedTime, '12:00 pm');
  });
  it('Single or double-digits greater than 12 return time in pm', () => {
    for (let i = 13; i < 24; i += 1) {
      assert.strictEqual(parseTime(`${i}`).formattedTime, `${i - 12}:00 pm`);
    }
  });
  it('24 returns 12:00 am', () => {
    assert.strictEqual(parseTime('24').formattedTime, '12:00 am');
  });
  it('3-digit numbers provide minutes', () => {
    assert.strictEqual(parseTime('115').formattedTime, '1:15 am');
    assert.strictEqual(parseTime('230').formattedTime, '2:30 am');
    assert.strictEqual(parseTime('345').formattedTime, '3:45 am');
  });
  it('Increments of 100 up to 2400 provide the time on the hour', () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(parseTime(`${i * 100}`).formattedTime, `${i}:00 am`);
    }
    assert.strictEqual(parseTime('1200').formattedTime, '12:00 am');
    for (let i = 13; i < 24; i += 1) {
      assert.strictEqual(parseTime(`${i * 100}`).formattedTime, `${i - 12}:00 pm`);
    }
    assert.strictEqual(parseTime('2400').formattedTime, '12:00 am');
  });
  it('4-digit numbers provide minutes', () => {
    assert.strictEqual(parseTime('0115').formattedTime, '1:15 am');
    assert.strictEqual(parseTime('0230').formattedTime, '2:30 am');
    assert.strictEqual(parseTime('0345').formattedTime, '3:45 am');
    assert.strictEqual(parseTime('1315').formattedTime, '1:15 pm');
    assert.strictEqual(parseTime('1430').formattedTime, '2:30 pm');
    assert.strictEqual(parseTime('1545').formattedTime, '3:45 pm');
  });
  it('5-digit numbers provide minutes', () => {
    assert.strictEqual(parseTime('011500').formattedTime, '1:15 am');
    assert.strictEqual(parseTime('023015').formattedTime, '2:30 am');
    assert.strictEqual(parseTime('034530').formattedTime, '3:45 am');
    assert.strictEqual(parseTime('131500').formattedTime, '1:15 pm');
    assert.strictEqual(parseTime('143015').formattedTime, '2:30 pm');
    assert.strictEqual(parseTime('154530').formattedTime, '3:45 pm');
  });
  it('5-digit numbers provide seconds with the appropriate formatting object as an optional paramter', () => {
    assert.strictEqual(parseTime('011500', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '1:15:00 am');
    assert.strictEqual(parseTime('023015', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '2:30:15 am');
    assert.strictEqual(parseTime('034530', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '3:45:30 am');
    assert.strictEqual(parseTime('131500', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '1:15:00 pm');
    assert.strictEqual(parseTime('143015', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '2:30:15 pm');
    assert.strictEqual(parseTime('154530', {
      timeFormat: {
        minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
      },
    }).formattedTime, '3:45:30 pm');
  });
  it('3am returns 3:00 am', () => {
    assert.strictEqual(parseTime('3am').formattedTime, '3:00 am');
  });
  it('3pm returns 3:00 pm', () => {
    assert.strictEqual(parseTime('3pm').formattedTime, '3:00 pm');
  });
  it('12am returns 12:00 am', () => {
    assert.strictEqual(parseTime('12am').formattedTime, '12:00 am');
  });
  it('12pm returns 12:00 pm', () => {
    assert.strictEqual(parseTime('12pm').formattedTime, '12:00 pm');
  });
  it('am or pm in the value being parsed overrides the optional parameter', () => {
    assert.strictEqual(parseTime('3am', { defaultTimeOfDay: 'pm' }).formattedTime, '3:00 am');
  });
  it('am or pm in the value being parsed overrides the optional parameter', () => {
    assert.strictEqual(parseTime('3pm', { defaultTimeOfDay: 'am' }).formattedTime, '3:00 pm');
  });
  it('Colon-separators work', () => {
    assert.strictEqual(parseTime('3:00').formattedTime, '3:00 am');
    assert.strictEqual(parseTime('15:00').formattedTime, '3:00 pm');
    assert.strictEqual(parseTime('3:00:00').formattedTime, '3:00 am');
    assert.strictEqual(parseTime('15:00:00').formattedTime, '3:00 pm');
  });
  it('Colon-separators work with am and pm too, with or without spaces', () => {
    assert.strictEqual(parseTime('3:00am').formattedTime, '3:00 am');
    assert.strictEqual(parseTime('3:00pm').formattedTime, '3:00 pm');
    assert.strictEqual(parseTime('3 : 00 am').formattedTime, '3:00 am');
    assert.strictEqual(parseTime('3 : 00 pm').formattedTime, '3:00 pm');
  });
  it('ISO strings are always returned, the date of which can be set with an optional paramter', () => {
    assert.strictEqual(parseTime('3:00am', { defaultDate: new Date(2021, 0, 1) }).ISOString, '2021-01-01T03:00:00.000Z');
  });
  it("BONUS: you can type digit o'clock and get a time value", () => {
    assert.strictEqual(parseTime("3 o'clock").formattedTime, '3:00 am');
  });
});
