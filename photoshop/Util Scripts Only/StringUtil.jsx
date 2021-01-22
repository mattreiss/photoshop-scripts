var StringUtil = {};

StringUtil.stripOutInteger = function(o) {
    var r = String(o)
    r = r.substring(r.lastIndexOf("/") + 1);
    r = r.replace(/^\D+|\D+$/g, "");
    while (r.charAt(0) == "0"){
      r = r.substring(1);
    }
    return parseInt(r);
}
