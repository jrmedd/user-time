// src/userTime.ts
var defaults = {
  defaultDate: /* @__PURE__ */ new Date(),
  defaultTimeOfDay: "am",
  timeFormat: { minute: "numeric", hour: "numeric", hourCycle: "h12" }
};
var UserTime = class {
  /**
   * The time input provided by the user as a string.
   */
  inputString;
  /**
   * The configuration settings for date and time formatting.
   */
  dateSettings;
  /**
   * A boolean indicating whether an error occurred during time parsing.
   */
  error;
  /**
   * The resulting `Date` object after parsing the input time.
   */
  dateObject;
  /**
   * The ISO 8601 string representation of the parsed date.
   */
  ISOString;
  /**
   * The formatted time string, based on the provided time format.
   */
  formattedTime;
  /**
   * Creates an instance of `UserTime`.
   *
   * @param inputString - The time input as a string (e.g., "3pm" or "1430").
   * @param dateSettings - The configuration settings for the time (overrides defaults).
   *
   * @remarks
   * The constructor parses the time string and uses the provided or default settings to set
   * the `dateObject`. It also validates the input and handles both 12-hour (AM/PM) and 24-hour formats.
   * If an error occurs during parsing, the `error` property is set to `true`.
   */
  constructor(inputString, dateSettings) {
    var _a;
    this.dateSettings = { ...defaults, ...dateSettings };
    this.error = false;
    this.inputString = inputString;
    const time = (this.inputString.match(/\d+/) !== null ? this.inputString.length === 3 ? (_a = this.inputString.match(/(\w{1})(\w{1,2})/)) == null ? void 0 : _a.slice(1) : this.inputString.match(/\d{1,2}/g) : []).map((digit) => parseInt(digit, 10) || 0);
    if (/^-\d+/.test(this.inputString)) this.error = true;
    if (time.length === 0 || time.length > 3) this.error = true;
    if (time[0] > 24 || time[0] < 0) this.error = true;
    if (time.length > 1 && time[1] > 59) this.error = true;
    if (!this.error) {
      this.dateObject = new Date(this.dateSettings.defaultDate.valueOf());
      this.dateObject.setHours(time[0]);
      this.dateObject.setMinutes(time[1] ?? 0);
      this.dateObject.setSeconds(time[2] ?? 0);
      if (time[0] <= 12) {
        const letters = this.inputString.match(/[a-zA-Z]{1,2}/) ?? [];
        const timeOfDay = letters.length > 0 ? letters[0].toLowerCase() : this.dateSettings.defaultTimeOfDay;
        switch (timeOfDay) {
          case "pm":
            this.dateObject.setHours(time[0] === 12 ? 12 : time[0] + 12);
            break;
          default:
            this.dateObject.setHours(time[0] % 12);
            break;
        }
      }
      this.ISOString = this.dateObject.toISOString();
      this.formattedTime = new Intl.DateTimeFormat(
        "en-GB",
        this.dateSettings.timeFormat
      ).format(this.dateObject);
    }
  }
};
var userTime_default = UserTime;
export {
  userTime_default as default
};
