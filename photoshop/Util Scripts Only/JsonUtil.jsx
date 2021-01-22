var JsonUtil = {};

JsonUtil.parseJson = function(string) {
  return (new Function( "return " + string) )();
}
