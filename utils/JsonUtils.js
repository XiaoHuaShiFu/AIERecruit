const objectUtils = require('../utils/ObjectUtils.js');
/**
 * 此类主要提供一些处理js对象的方法
 * 
 * @author XHSF
 * @date 2019/03/08
 */
module.exports = { 
    trimObject: trimObject,
    connect_data: do_url
}



/**
 * 对js对象进行处理，如果里面的元素的值为空，则把此元素移除
 * 
 * 此操作是递归的
 * 
 * @Author xhsf
 */
function trimObject(o) {
    var o0 = {};
    //如果对象为空，直接返回
    if (objectUtils.isEmpty(o)) {
        return o;
    }
    for (var key in o) {
        if (!objectUtils.isEmpty(o[key])) {
            if (typeof (o[key]) === 'object') {
                o0[key] = trimObject(o[key])
            } else {
                o0[key] = o[key];
            }
        }
    }
    return o0;
}

function do_url(obj){
  if (objectUtils.isEmpty(obj)) return ;
  var str = "";
  for (var key in obj) {
    str += key+'=' + obj[key] + '&';
  }
  return "?" + str.substring(0, str.length - 1);
}

