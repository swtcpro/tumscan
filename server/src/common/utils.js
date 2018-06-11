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

const util = {
    unique: unique,
}

export default util;