/**
 * @dest 此文件主要提供一些处理对象的函数
 * 
 * @author XHSF
 * @date 2019/03/10
 */
module.exports = {
    isEmpty: isEmpty
}


/**
 * 判断一个对象是否为空
 * 如"", undefined,null 都被视为空
 */
function isEmpty(o) {
    if (o === null || o === undefined || o === "") {
        return true;
    } else {
        return false;
    }
}

