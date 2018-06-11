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

const util = {
    unique: unique,
    promiseAll: promiseAll
}

export default util;