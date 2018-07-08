/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 0:13
 \* Description:
 \*/

/**
 * 数据去除重复项
 * @param arr
 * @returns {Array}
 */
let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd hh:mm:ss';

function padding(s, len) {
    let l = len - (s + '').length;
    for (let i = 0; i < l; i++) {
        s = '0' + s;
    }
    return s;
}

function unique(arr) {
    var res = [];

    arr.forEach(function (item) {
        res.includes(item) ? '' : res.push(item);
    });
    return res;
}

function isArray(val) {
    return toString.call(val) === '[object Array]';
}

function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        if (!isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        let resolvedCounter = 0;
        let promiseNum = promises.length;
        let resolvedValues = new Array(promiseNum);
        for (let i = 0; i < promiseNum; i++) {
            (function (i) {
                Promise.resolve(promises[i]).then(function (value) {
                    resolvedCounter++;
                    resolvedValues[i] = value;
                    if (resolvedCounter === promiseNum) {
                        return resolve(resolvedValues)
                    }
                }, function (reason) {
                    return reject(reason)
                })
            })(i)
        }
    })
}

function changeTwoDecimal(x) {
    var f_x = x
    if (isNaN(f_x)) {
        console.log('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return parseFloat(s_x);
}

// function generate2000(dateNum, pattern) {
//     // 2000/1/1 8:0:0 的秒数
//     pattern = pattern || DEFAULT_PATTERN;
//     return this.format(new Date((dateNum + 946684800) * 1000), pattern);
// }

function format(date, pattern) {
    pattern = pattern || DEFAULT_PATTERN;
    return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
            case 'y':
                return padding(date.getFullYear(), $0.length);
            case 'M':
                return padding(date.getMonth() + 1, $0.length);
            case 'd':
                return padding(date.getDate(), $0.length);
            case 'w':
                return date.getDay() + 1;
            case 'h':
                return padding(date.getHours(), $0.length);
            case 'm':
                return padding(date.getMinutes(), $0.length);
            case 's':
                return padding(date.getSeconds(), $0.length)
        }
    })
}

 function generate2000(dateNum, pattern) {
    // 2000/1/1 8:0:0 的秒数
    pattern = pattern || DEFAULT_PATTERN;
    return format(new Date((dateNum + 946684800) * 1000), pattern);
}


function parse(dateString, pattern) {
    let matchs1 = pattern.match(SIGN_REGEXP);
    let matchs2 = dateString.match(/(\d)+/g);
    if (matchs1.length === matchs2.length) {
        let _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
            let _int = parseInt(matchs2[i]);
            let sign = matchs1[i];
            switch (sign.charAt(0)) {
                case 'y':
                    _date.setFullYear(_int);
                    break;
                case 'M':
                    _date.setMonth(_int - 1);
                    break;
                case 'd':
                    _date.setDate(_int);
                    break;
                case 'h':
                    _date.setHours(_int);
                    break;
                case 'm':
                    _date.setMinutes(_int);
                    break;
                case 's':
                    _date.setSeconds(_int);
                    break;
            }
        }
        return _date
    }
    return null
}

function isStrEmpty(str) {

    if ((str === null) || (str.length === 0)) return true;

    else return (false);

}

const util = {
    unique: unique,
    promiseAll: promiseAll,
    changeTwoDecimal: changeTwoDecimal,
    format: format,
    generate2000: generate2000
}

export default util;