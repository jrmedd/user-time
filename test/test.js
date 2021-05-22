const assert = require('assert');
const { parse } = require('path');
const parseTime = require('../index');

describe('Check various digit-only inputs provide the expected formatted outputs', ()=>{
    it('Single or double-digits less than 12 return time in am by default', ()=>{
        for (let i = 1; i < 12; i ++) {
            assert.strictEqual(parseTime(`${i}`).formattedTime, `${i}:00 am`)
        }
    })
    it('Single or double-digits less than 12 return time in pm if "pm" is passed as the second positional argument', ()=>{
        for (let i = 1; i < 12; i ++) {
            assert.strictEqual(parseTime(`${i}`, 'pm').formattedTime, `${i}:00 pm`)
        }
    })
    it('0 returns 12:00 am', () =>{
        assert.strictEqual(parseTime('0').formattedTime, '12:00 am')
    })
    it('12 returns 12:00 pm', () =>{
        assert.strictEqual(parseTime('12').formattedTime, '12:00 pm')
    })
    it('Single or double-digits greater than 12 return time in pm', ()=>{
        for (let i = 13; i < 24; i ++) {
            assert.strictEqual(parseTime(`${i}`).formattedTime, `${i-12}:00 pm`)
        }
    })
    it('24 returns 12:00 am', () =>{
        assert.strictEqual(parseTime('24').formattedTime, '12:00 am')
    })
    it('3-digit numbers provide minutes', ()=> {
        assert.strictEqual(parseTime('115').formattedTime, '1:15 am')
        assert.strictEqual(parseTime('230').formattedTime, '2:30 am')
        assert.strictEqual(parseTime('345').formattedTime, '3:45 am')
    })
    it('Increments of 100 up to 2400 provide the time on the hour', ()=>{
        for (let i = 1; i < 12; i ++) {
            assert.strictEqual(parseTime(`${i*100}`).formattedTime, `${i}:00 am`)
        }
        assert.strictEqual(parseTime('1200').formattedTime, '12:00 pm')
        for (let i = 13; i < 24; i ++) {
            assert.strictEqual(parseTime(`${i*100}`).formattedTime, `${i-12}:00 pm`)
        }
        assert.strictEqual(parseTime('2400').formattedTime, '12:00 am')
    })
    it('4-digit numbers provide minutes', ()=> {
        assert.strictEqual(parseTime('0115').formattedTime, '1:15 am')
        assert.strictEqual(parseTime('0230').formattedTime, '2:30 am')
        assert.strictEqual(parseTime('0345').formattedTime, '3:45 am')
        assert.strictEqual(parseTime('1315').formattedTime, '1:15 pm')
        assert.strictEqual(parseTime('1430').formattedTime, '2:30 pm')
        assert.strictEqual(parseTime('1545').formattedTime, '3:45 pm')
    })
    it('5-digit numbers provide minutes', ()=> {
        assert.strictEqual(parseTime('011500').formattedTime, '1:15 am')
        assert.strictEqual(parseTime('023015').formattedTime, '2:30 am')
        assert.strictEqual(parseTime('034530').formattedTime, '3:45 am')
        assert.strictEqual(parseTime('131500').formattedTime, '1:15 pm')
        assert.strictEqual(parseTime('143015').formattedTime, '2:30 pm')
        assert.strictEqual(parseTime('154530').formattedTime, '3:45 pm')
    })
    it('5-digit numbers provide seconds with the appropriate formatting string as the third positional argument', ()=> {
        assert.strictEqual(parseTime('011500', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '1:15:00 pm')
        assert.strictEqual(parseTime('023015', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '2:30:15 pm')
        assert.strictEqual(parseTime('034530', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '3:45:30 pm')
        assert.strictEqual(parseTime('131500', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '1:15:00 pm')
        assert.strictEqual(parseTime('143015', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '2:30:15 pm')
        assert.strictEqual(parseTime('154530', 'pm', { minute: "numeric", hour: "numeric", second:"numeric", hourCycle: "h12" }).formattedTime, '3:45:30 pm')
    })
})
