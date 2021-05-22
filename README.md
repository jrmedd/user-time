![build](https://github.com/jrmedd/user-time/actions/workflows/main.yml/badge.svg)

# User time
Takes user-input time values and parses them, outputting Intl-formatted strings and ISO timestamps.

## Overview

In all of my time working as web designer and developer, I've always struggled with the idea of simple time inputs for users. I've seen users struggle with `<input type="time" />` (as I have myself) and nobody wants a masked input. [Material's time picker](https://material.io/components/time-pickers) for Android is nice, but isn't available for the web and [kids these days struggle with analogue clockfaces](https://slate.com/human-interest/2018/05/analog-clock-reading-skills-arent-that-important-anymore.html).

My favourite time input on the web is [Google's calendar](https://calendar.google.com), which lets me type an awful lot of rubbish and still get the write time. I've needed some similar functionality recently, so I finally wrote up a zero-dependency function that does it.

## Usage

### Basic usage

Import the module:

```js
import parseTime from "user-time";
//or
const parseTime = require("user-time");
```

Give the function a string and it will attempt to parse:

```js
// Formatted value:
parseTime("09:30").formattedTime // 9:30 am

//ISO string
parseTime("15:30").ISOString // 2021-05-22T15:30:00.000Z
```

### Optional parameters

`formattedTime` can be adjusted using the same options from [Intl.DateTimeFormat](https://tc39.es/ecma402/#datetimeformat-objects):

```js
const options = { minute: '2-digit', hour: '2-digit', hourCycle: 'h24' }

parseTime("1pm", { timeFormat: options}).formattedTime // 13:00
```

`defaultTimeOfDay` can be set to `"pm"`:

```js
parseTime("6", { defaultTimeOfDay: 'pm'}).formattedTime // 6:00pm
```

`defaultDate` can adjust the date of the `ISOString` returned:

```js
const janFirst = new Date(2021, 0, 1)

parseTime("1", { defaultDate: janFirst }).ISOString // 2021-01-01T01:00:00.000Z
```

## Examples

There are plenty of inputs that `parseTime` will accept. Below are a bunch of examples:

Single or double-digits less than 12 return time in am by default.
```js
parseTime('1').formattedTime // 1:00
parseTime('12').formattedTime // 12:00
```

Single or double-digits less than 12 return time in pm if "pm" is passed as an optional parameter.
```js
parseTime('1', { defaultTimeOfDay: 'pm' }).formattedTime // 1:00 pm
```

0 returns 12:00 am.

```js
parseTime('0').formattedTime // 12:00 am
```

12 returns 12:00 am or pm depending on the optional "defaultTimeOfDay" parameter (am, by default).

```js
parseTime('12').formattedTime // 12:00 am
parseTime('12', { defaultTimeOfDay: 'pm' }).formattedTime // 12:00 pm
```

Single or double-digits greater than 12 return time in pm.

```js
parseTime(`13`).formattedTime // 1:00 pm
```

24 returns 12:00 am.

```js
parseTime('24').formattedTime // 12:00 am
```

3-digit numbers provide minutes.

```js
parseTime('115').formattedTime // 1:15 am
parseTime('230').formattedTime // 2:30 am
parseTime('345').formattedTime // 3:45 am
```

Increments of 100 up to 2400 provide the time on the hour.
```js
parseTime('100').formattedTime /// 1:00 am
parseTime('1200').formattedTime // 12:00 am
parseTime('1300').formattedTime // 1:00 pm
parseTime('2400').formattedTime // 12:00 am
```

4-digit numbers provide minutes.

```js
parseTime('0115').formattedTime // 1:15 am
parseTime('0230').formattedTime // 2:30 am
parseTime('0345').formattedTime // 3:45 am
parseTime('1315').formattedTime // 1:15 pm
parseTime('1430').formattedTime // 2:30 pm
parseTime('1545').formattedTime // 3:45 pm
```

5-digit numbers provide minutes.

```js
parseTime('011500').formattedTime // 1:15 am
parseTime('023015').formattedTime // 2:30 am
parseTime('034530').formattedTime // 3:45 am
parseTime('131500').formattedTime // 1:15 pm
parseTime('143015').formattedTime // 2:30 pm
parseTime('154530').formattedTime // 3:45 pm
```

5-digit numbers provide seconds with the appropriate formatting object as an optional parameter.

```js
parseTime('011500', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 1:15:00 am

parseTime('023015', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 2:30:15 am

parseTime('034530', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 3:45:30 am

parseTime('131500', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 1:15:00 pm

parseTime('143015', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 2:30:15 pm

parseTime('154530', {
  timeFormat: {
    minute: 'numeric', hour: 'numeric', second: 'numeric', hourCycle: 'h12',
  },
}).formattedTime // 3:45:30 pm
```

3am returns 3:00 am.

```js
parseTime('3am').formattedTime // 3:00 am
```

3pm returns 3:00 pm.

```js
parseTime('3pm').formattedTime // 3:00 pm
```

12am returns 12:00 am.

```js
parseTime('12am').formattedTime // 12:00 am
```

12pm returns 12:00 pm.

```js
parseTime('12pm').formattedTime // 12:00 pm
```

am or pm in the value being parsed overrides the optional parameter.

```js
parseTime('3am', { defaultTimeOfDay: 'pm' }).formattedTime // 3:00 am
```

am or pm in the value being parsed overrides the optional parameter.

```js
parseTime('3pm', { defaultTimeOfDay: 'am' }).formattedTime // 3:00 pm
```

Colon-separators work.

```js
parseTime('3:00').formattedTime // 3:00 am
parseTime('15:00').formattedTime // 3:00 pm
parseTime('3:00:00').formattedTime // 3:00 am
parseTime('15:00:00').formattedTime // 3:00 pm
```

Colon-separators work with am and pm too, with or without spaces.

```js
parseTime('3:00am').formattedTime // 3:00 am
parseTime('3:00pm').formattedTime // 3:00 pm
parseTime('3 : 00 am').formattedTime // 3:00 am
parseTime('3 : 00 pm').formattedTime // 3:00 pm
```

ISO strings are always returned, the date of which can be set with an optional parameter (today by default).

```js
parseTime('3:00am', { defaultDate: new Date(2021, 0, 1) }).ISOString // 2021-01-01T03:00:00.000Z
```

BONUS: you can type digit o'clock and get a time value.

```js
parseTime("3 o'clock").formattedTime // 3:00 am
```

