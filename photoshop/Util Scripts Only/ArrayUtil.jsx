var ArrayUtil = {};


ArrayUtil.shift = function(array, startIndex) {
  var newArray = [];
  for (var i = startIndex; i < array.length; i++) {
    newArray.push(array[i]);
  }
  return newArray;
}
