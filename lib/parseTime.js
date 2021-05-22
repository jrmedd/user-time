"use strict";

var parseTime = function parseTime(timeString) {
  var _time$, _time$2;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$defaultDate = _ref.defaultDate,
      defaultDate = _ref$defaultDate === void 0 ? new Date() : _ref$defaultDate,
      _ref$defaultTimeOfDay = _ref.defaultTimeOfDay,
      defaultTimeOfDay = _ref$defaultTimeOfDay === void 0 ? 'am' : _ref$defaultTimeOfDay,
      _ref$timeFormat = _ref.timeFormat,
      timeFormat = _ref$timeFormat === void 0 ? {
    minute: 'numeric',
    hour: 'numeric',
    hourCycle: 'h12'
  } : _ref$timeFormat;

  if (typeof timeString !== 'string') throw new Error('Strings only');
  var date = defaultDate; // eslint-disable-next-line no-nested-ternary

  var time = (timeString.match(/\d+/) !== null ? timeString.length === 3 ? timeString.match(/(\w{1})(\w{1,2})/).slice(1) : timeString.match(/\d{1,2}/gi) : [] // eslint-disable-next-line no-bitwise
  ).map(function (digit) {
    return digit | 0;
  });
  var error = false;
  if (time.length === 0 || time.length > 3) error = true;
  if (time[0] > 24) error = true;
  if (time.length > 1 && time[1] > 59) error = true;
  if (error) throw new Error('Unable to parse time');
  date.setHours(time[0]);
  date.setMinutes((_time$ = time[1]) !== null && _time$ !== void 0 ? _time$ : 0);
  date.setSeconds((_time$2 = time[2]) !== null && _time$2 !== void 0 ? _time$2 : 0);

  if (time[0] <= 12) {
    var _timeString$match;

    var letters = (_timeString$match = timeString.match(/[a-zA-Z]{1,2}/)) !== null && _timeString$match !== void 0 ? _timeString$match : [];
    var timeOfDay = letters.length > 0 ? letters[0].toLowerCase() : defaultTimeOfDay;

    switch (timeOfDay) {
      case 'pm':
        date.setHours(time[0] === 12 ? 12 : time[0] + 12);
        break;

      default:
        date.setHours(time[0] % 12);
        break;
    }
  }

  return {
    ISOString: date.toISOString(),
    formattedTime: new Intl.DateTimeFormat('en-GB', timeFormat).format(date)
  };
};

module.exports = parseTime;