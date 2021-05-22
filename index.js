const parseTime = (
  timeString,
  {
    defaultDate = new Date(),
    defaultTimeOfDay = 'am',
    timeFormat = { minute: 'numeric', hour: 'numeric', hourCycle: 'h12' },
  } = {},
) => {
  if (typeof timeString !== 'string') throw new Error('Strings only');
  const date = defaultDate;
  // eslint-disable-next-line no-nested-ternary
  const time = (timeString.match(/\d+/) !== null
    ? timeString.length === 3
      ? timeString.match(/(\w{1})(\w{1,2})/).slice(1)
      : timeString.match(/\d{1,2}/gi)
    : []
  // eslint-disable-next-line no-bitwise
  ).map((digit) => digit | 0);
  let error = false;
  if (time.length === 0 || time.length > 3) error = true;
  if (time[0] > 24) error = true;
  if (time.length > 1 && time[1] > 59) error = true;
  if (error) throw new Error('Unable to parse time');
  date.setHours(time[0]);
  date.setMinutes(time[1] ?? 0);
  date.setSeconds(time[2] ?? 0);
  if (time[0] <= 12) {
    const letters = timeString.match(/[a-zA-Z]{1,2}/) ?? [];
    const timeOfDay = letters.length > 0 ? letters[0].toLowerCase() : defaultTimeOfDay;
    switch (timeOfDay) {
      case 'pm':
        date.setHours(time[0] === 12 ? 12 : time[0] + 12);
        break;
      default:
        date.setHours(time[0] % 12);
        break;
    }
  }
  return ({
    ISOString: date.toISOString(),
    formattedTime: new Intl.DateTimeFormat('en-GB', timeFormat).format(date),
  });
};

module.exports = parseTime;
