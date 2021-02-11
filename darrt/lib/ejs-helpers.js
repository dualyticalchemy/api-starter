/**
 * @module lib/ejs-helpers
 * @author Mike Amundsen (@mamund)
 * @description
 * ejs helpers for DARRT
 */

exports.stateValue = stateValue;
exports.iif = iff;
exports.sayHi = sayHi;

/**
 * @function stateValue
 * @static
 * @param {} val
 * @param {} state
 * @param {} request
 * @param {} def
 * @description
 * token replacement
 * val = "{id}"
 * state = {id:"123",....}
 * def = "<default-value>"
 *
 * note: {makeid} is special, generates unique ID
 */
function stateValue (val, state, request, def) {
  var v = val.toString() || "";
  var st = state || {};
  var d = def || v;
  var x=0;
  var req = request || {};
  var hst = "";
  var pxy = "";
  var aty = "";

  // compute HTTP authority & check for proxied requests  
  pxy = (req.get && req.get("proxy-prefix") ? req.get("proxy-prefix") : "");
  hst = (req.get && req.get("host") ? req.get("host") : "");
  aty = (pxy !== "" ? pxy : hst);

  // handle special macros
  if (v.indexOf("{makeid}") !== -1) {
    v = v.replace("{makeid}", makeId());
    x=1
  }
  if (v.indexOf("{fullurl}") !== -1) {
    v = v.replace("{fullurl}", (req ? req.protocol : "http") + "://" + aty + (req ? req.originalUrl : "/"));
    x=1;
  }
  if (v.indexOf("{fullhost}") !== -1) {
    v = v.replace("{fullhost}", (req ? req.protocol : "http") + "://"+ aty );  
    x=1;
  }
  if (v.indexOf("{date}") !== -1) {
    v = v.replace("{date}", fDate());
    x=1;
  }

  // handle named properties
  for (var s in st) {
    if(v.indexOf('{'+s+'}') !== -1) {
      v = v.replace('{'+s+'}', st[s]);
      x=1;
    }
  }
  
  // insert default, if nothing found
  if (x == 0) {
    v = d;
  }
  
  return v;
}

/**
 * @function iff
 * @static
 * @param {} cond
 * @param {} value
 * @description
 * immediate if
 */
function iff (cond,value){
  if (cond) return value;
  return '';
}  

/**
 * @function sayHi
 * @static
 * @param {} name
 * @description
 * for testing
 */
function sayHi (name) {
  return "Hello " + name;
} 

// formatted date
/**
 * @function fDate
 * @inner
 * @param {Date} dte A date object.
 */
function fDate (dte) {
  var cdate = dte||new Date();
  let fdte = cdate.getFullYear() + "-" 
    + lz(cdate.getMonth() + 1) + "-" 
    + lz(cdate.getDate()) + " " 
    + lz(cdate.getHours()) + ":" 
    + lz(cdate.getMinutes()) + ":" 
    + lz(cdate.getSeconds());
     
  return fdte;
}

/**
 * @function lz
 * @inner
 * @param {number} n A number for representing subcomponents of a date.
 */
function lz (n){
  var rtn = "";
  if (n <= 9){
    rtn = "0" + n;
  } else {
    rtn = n
  }
  return rtn;
}

/**
 * @function makeId
 * @inner
 * @return {string} A randomized ID.
 * @description
 * local unique id generator
 */
function makeId () {
  var rtn;

  rtn = String(Math.random());
  rtn = rtn.substring(2);
  rtn = parseInt(rtn).toString(36);

  return rtn;
}

// EOF
