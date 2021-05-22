# User time

Takes user-input time values and parses them, outputting Intl-formatted strings and ISO timestamps.

## Overview

In all of my time working as web designer and developer, I've always struggled with the idea of simple time inputs for users. I've seen users struggle with `<input type="time" />` (as I have myself) and nobody wants a masked input. [Material's time picker](https://material.io/components/time-pickers) for Android is nice, but isn't available for the web and [kids these days struggle with analogue clockfaces](https://slate.com/human-interest/2018/05/analog-clock-reading-skills-arent-that-important-anymore.html).

My favourite time input on the web is [Google's calendar](https://calendar.google.com), which lets me type an awful lot of rubbish and still get the write time. I've needed some similar functionality recently, so I finally wrote up a zero-dependency function that does it.

## Examples

See [the tests for now](https://github.com/jrmedd/user-time/blob/master/test/test.js)., I'll write some proper docs soon