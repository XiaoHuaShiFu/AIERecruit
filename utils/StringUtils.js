const objectUtils = require('../utils/ObjectUtils.js');
/**
 * @Dest 此文件主要提供一些处理字符串的函数
 * 
 * @Author XHSF
 * @Date 2019/03/08
 * @UpdateDate 2019/03/20
 */
module.exports = {
    isEmpty: isEmpty,
    isBlank: isBlank,
    trim: trim,
    trimStr: trimStr,
    trimObj: trimObj
}


/**
 * 判断一个字符串是否为空
 * 如 "  ",undefined,null 都被视为空
 * 
 * @Author xhsf
 */
function isEmpty(s) {
    //1.如果isBlank(s) || s == null || s == undefined return true
    //2.return false
    if (s === null || s === undefined || isBlank(s)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断一个字符串是否为空白
 * 如： "  " 被视为空白
 * 
 * @Author xhsf
 */
function isBlank(s) {
    if (trim(s) === "") {
        return true;
    } else {
        return false;
    }
}

/**
 * 去掉一个字符串的首尾空格
 * 如: " string" -> "string"
 *     " str " -> "str"
 *     "s t r" -> "s t r"
 * 
 * @Author xhsf
 */
function trim(s) {
    return String(s).replace(/(^\s*)|(\s*$)/, "");
}

/**
 * 对字符串进行裁剪，如果超过长度限制则加上尾部，并裁剪到maxLen长度
 * 
 * @Author xhsf
 * @Date 2019.3.20
 */
function trimStr(str, maxLen, tail) {
    //如果为空直接返回
    if (isEmpty(str)) return str;
    //如果长度小于最大长度直接返回
    if (str.length <= maxLen) return str;
    //进行截取
    return String(str).substr(0, maxLen - tail.length) + tail;
}

/**
 * 对对象里的字符串进行裁剪，如果超过长度限制则加上尾部，并裁剪到maxLen长度
 * 
 * 此操作是递归的
 * @Author xhsf
 * @Date 2019.3.20
 */
function trimObj(o, maxLen, tail) {
    //如果为空直接返回
    if (objectUtils.isEmpty(o)) {
        return o;
    }
    var o0 = {};
    for (var key in o) {
        if (!objectUtils.isEmpty(o[key])) {
            if (typeof(o[key]) === 'object') {
                o0[key] = trimObj(o[key], maxLen, tail);
            } else {
                o0[key] = trimStr(o[key], maxLen, tail);
            }
        }
    }
    return o0;
}