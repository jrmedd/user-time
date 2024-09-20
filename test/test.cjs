const assert = require("assert");
const UserTime = require("../lib/userTime.cjs");

describe("UserTime", () => {
  it("Single or double-digits less than 12 return time in am by default", () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(new UserTime(`${i}`).formattedTime, `${i}:00 am`);
    }
  });
  it('Single or double-digits less than 12 return time in pm if "pm" is passed as an optional parameter', () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(
        new UserTime(`${i}`, { defaultTimeOfDay: "pm" }).formattedTime,
        `${i}:00 pm`,
      );
    }
  });
  it("0 returns 12:00 am", () => {
    assert.strictEqual(new UserTime("0").formattedTime, "12:00 am");
  });
  it('12 returns 12:00 am or pm depending on the optional "defaultTimeOfDay" paramter (am, by default)', () => {
    assert.strictEqual(new UserTime("12").formattedTime, "12:00 am");
    assert.strictEqual(
      new UserTime("12", { defaultTimeOfDay: "pm" }).formattedTime,
      "12:00 pm",
    );
  });
  it("Single or double-digits greater than 12 return time in pm", () => {
    for (let i = 13; i < 24; i += 1) {
      assert.strictEqual(new UserTime(`${i}`).formattedTime, `${i - 12}:00 pm`);
    }
  });
  it("24 returns 12:00 am", () => {
    assert.strictEqual(new UserTime("24").formattedTime, "12:00 am");
  });
  it("3-digit numbers provide minutes", () => {
    assert.strictEqual(new UserTime("115").formattedTime, "1:15 am");
    assert.strictEqual(new UserTime("230").formattedTime, "2:30 am");
    assert.strictEqual(new UserTime("345").formattedTime, "3:45 am");
  });
  it("Increments of 100 up to 2400 provide the time on the hour", () => {
    for (let i = 1; i < 12; i += 1) {
      assert.strictEqual(
        new UserTime(`${i * 100}`).formattedTime,
        `${i}:00 am`,
      );
    }
    assert.strictEqual(new UserTime("1200").formattedTime, "12:00 am");
    for (let i = 13; i < 24; i += 1) {
      assert.strictEqual(
        new UserTime(`${i * 100}`).formattedTime,
        `${i - 12}:00 pm`,
      );
    }
    assert.strictEqual(new UserTime("2400").formattedTime, "12:00 am");
  });
  it("4-digit numbers provide minutes", () => {
    assert.strictEqual(new UserTime("0115").formattedTime, "1:15 am");
    assert.strictEqual(new UserTime("0230").formattedTime, "2:30 am");
    assert.strictEqual(new UserTime("0345").formattedTime, "3:45 am");
    assert.strictEqual(new UserTime("1315").formattedTime, "1:15 pm");
    assert.strictEqual(new UserTime("1430").formattedTime, "2:30 pm");
    assert.strictEqual(new UserTime("1545").formattedTime, "3:45 pm");
  });
  it("5-digit numbers provide minutes", () => {
    assert.strictEqual(new UserTime("011500").formattedTime, "1:15 am");
    assert.strictEqual(new UserTime("023015").formattedTime, "2:30 am");
    assert.strictEqual(new UserTime("034530").formattedTime, "3:45 am");
    assert.strictEqual(new UserTime("131500").formattedTime, "1:15 pm");
    assert.strictEqual(new UserTime("143015").formattedTime, "2:30 pm");
    assert.strictEqual(new UserTime("154530").formattedTime, "3:45 pm");
  });
  it("5-digit numbers provide seconds with the appropriate formatting object as an optional paramter", () => {
    assert.strictEqual(
      new UserTime("011500", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "1:15:00 am",
    );
    assert.strictEqual(
      new UserTime("023015", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "2:30:15 am",
    );
    assert.strictEqual(
      new UserTime("034530", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "3:45:30 am",
    );
    assert.strictEqual(
      new UserTime("131500", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "1:15:00 pm",
    );
    assert.strictEqual(
      new UserTime("143015", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "2:30:15 pm",
    );
    assert.strictEqual(
      new UserTime("154530", {
        timeFormat: {
          minute: "numeric",
          hour: "numeric",
          second: "numeric",
          hourCycle: "h12",
        },
      }).formattedTime,
      "3:45:30 pm",
    );
  });
  it("3am returns 3:00 am", () => {
    assert.strictEqual(new UserTime("3am").formattedTime, "3:00 am");
  });
  it("3pm returns 3:00 pm", () => {
    assert.strictEqual(new UserTime("3pm").formattedTime, "3:00 pm");
  });
  it("12am returns 12:00 am", () => {
    assert.strictEqual(new UserTime("12am").formattedTime, "12:00 am");
  });
  it("12pm returns 12:00 pm", () => {
    assert.strictEqual(new UserTime("12pm").formattedTime, "12:00 pm");
  });
  it("am or pm in the value being parsed overrides the optional parameter", () => {
    assert.strictEqual(
      new UserTime("3am", { defaultTimeOfDay: "pm" }).formattedTime,
      "3:00 am",
    );
  });
  it("am or pm in the value being parsed overrides the optional parameter", () => {
    assert.strictEqual(
      new UserTime("3pm", { defaultTimeOfDay: "am" }).formattedTime,
      "3:00 pm",
    );
  });
  it("Colon-separators work", () => {
    assert.strictEqual(new UserTime("3:00").formattedTime, "3:00 am");
    assert.strictEqual(new UserTime("15:00").formattedTime, "3:00 pm");
    assert.strictEqual(new UserTime("3:00:00").formattedTime, "3:00 am");
    assert.strictEqual(new UserTime("15:00:00").formattedTime, "3:00 pm");
  });
  it("Colon-separators work with am and pm too, with or without spaces", () => {
    assert.strictEqual(new UserTime("3:00am").formattedTime, "3:00 am");
    assert.strictEqual(new UserTime("3:00pm").formattedTime, "3:00 pm");
    assert.strictEqual(new UserTime("3 : 00 am").formattedTime, "3:00 am");
    assert.strictEqual(new UserTime("3 : 00 pm").formattedTime, "3:00 pm");
  });
  it("ISO strings are always returned, the date of which can be set with an optional parameter", () => {
    assert.strictEqual(
      new UserTime("3:00am", { defaultDate: new Date(2021, 0, 1) }).ISOString,
      "2021-01-01T03:00:00.000Z",
    );
  });
  it("Invalid times give an error", () => {
    assert.strictEqual(
      new UserTime("25:00am", { defaultDate: new Date(2021, 0, 1) }).error,
      true,
    );
    assert.strictEqual(
      new UserTime("-1", { defaultDate: new Date(2021, 0, 1) }).error,
      true,
    );
  });
  it("BONUS: you can type digit o'clock and get a time value", () => {
    assert.strictEqual(new UserTime("3 o'clock").formattedTime, "3:00 am");
  });
});
