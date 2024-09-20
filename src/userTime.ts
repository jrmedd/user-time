/**
 * Represents a valid time of day.
 *
 * @remarks
 * The allowed values are "am", "AM", "pm", and "PM". Case-insensitive but expected to be lowercase by default.
 */
type Meridiem = "am" | "AM" | "pm" | "PM";

/**
 * Configuration settings for the date and time.
 *
 * @property defaultDate - The default date to be used.
 * @property defaultTimeOfDay - The default meridiem to be used (AM/PM).
 * @property timeFormat - The format options for the time, compatible with `Intl.DateTimeFormat`.
 */
interface DateSettings {
  defaultDate: Date;
  defaultTimeOfDay: Meridiem;
  timeFormat: object;
}

/**
 * The default settings for dates and times.
 *
 * @remarks
 * This object provides default values for the date settings, including the current date,
 * defaulting to AM, and a 12-hour time format.
 */
const defaults: DateSettings = {
  defaultDate: new Date(),
  defaultTimeOfDay: "am",
  timeFormat: { minute: "numeric", hour: "numeric", hourCycle: "h12" },
};

/**
 * A class for parsing and managing user-inputted time strings.
 *
 * @remarks
 * The `UserTime` class takes an input string and date settings to create a `Date` object and format it
 * accordingly. It handles various error cases and can manage both 12-hour and 24-hour input formats.
 */
class UserTime {
  /**
   * The time input provided by the user as a string.
   */
  inputString: string;

  /**
   * The configuration settings for date and time formatting.
   */
  dateSettings: DateSettings;

  /**
   * A boolean indicating whether an error occurred during time parsing.
   */
  error: boolean;

  /**
   * The resulting `Date` object after parsing the input time.
   */
  dateObject: Date;

  /**
   * The ISO 8601 string representation of the parsed date.
   */
  ISOString: string;

  /**
   * The formatted time string, based on the provided time format.
   */
  formattedTime: string;

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
  constructor(inputString: string, dateSettings: DateSettings) {
    this.dateSettings = { ...defaults, ...dateSettings };
    this.error = false;
    this.inputString = inputString;

    const time: number[] = (
      this.inputString.match(/\d+/) !== null
        ? this.inputString.length === 3
          ? (this.inputString.match(/(\w{1})(\w{1,2})/)?.slice(1) as string[])
          : (this.inputString.match(/\d{1,2}/g) as string[])
        : []
    ).map((digit: string) => parseInt(digit, 10) || 0);

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
        const letters: string[] = this.inputString.match(/[a-zA-Z]{1,2}/) ?? [];
        const timeOfDay =
          letters.length > 0
            ? letters[0].toLowerCase()
            : this.dateSettings.defaultTimeOfDay;
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
        this.dateSettings.timeFormat,
      ).format(this.dateObject);
    }
  }
}

export default UserTime;
