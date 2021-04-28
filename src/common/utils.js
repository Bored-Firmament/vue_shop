let typeToString = Object.prototype.toString;

export function objectsLoop(result, ...objects) {
  // 遍历 对象
  if(typeToString.call(objects) === '[object Array]' || typeToString.call(objects) === '[object Object]') {
    objects.map(function(objItem) {
      // 收集 对象的 键名数组
      let objItemKeys = Object.keys(objItem);
      // 遍历 对象的 键名
      objItemKeys.map(function(key) {
        // 判断 当前 遍历的 对象的 键名 是否已经存在(在结果对象中)
        if(!result[key]) {
          // 不存在:保存
          result[key] = objItem[key];
        } else {
          // 不是 可迭代类型(数组/对象)时
          if(typeToString.call(objItem[key]) !== '[object Array]' || typeToString.call(objItem[key]) === '[object Object]') {
            // 下面这一页代码:决定相同键名,属性覆盖
            result[key] = objItem[key];
            // 因为不是可迭代类,也就没有更深层级的数据,可以结束啦!
            return ;
          }
          // 是 可迭代类型(数组/对象)时,需要继续深入
          result[key].map(function(resItem) {
            // 递归
            objectsLoop(resItem, ...objItem[key]);
          })
        }
      })
    })
  }
  return result;
}