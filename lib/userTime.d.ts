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
 * A class for parsing and managing user-inputted time strings.
 *
 * @remarks
 * The `UserTime` class takes an input string and date settings to create a `Date` object and format it
 * accordingly. It handles various error cases and can manage both 12-hour and 24-hour input formats.
 */
declare class UserTime {
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
    constructor(inputString: string, dateSettings: DateSettings);
}

export { UserTime as default };
export = UserTime