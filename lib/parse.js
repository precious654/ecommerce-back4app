import Parse from "parse/dist/parse.min.js";
 
const PARSE_APP_ID = "aaKLlYLStiigwpCBgN0yzSNoYX7ZzFzVwID3egit";
const PARSE_JS_KEY = "BWMVjn1kwD1xGt64iBfwwEwiY2QFK6ZfveVPtGZN";
const PARSE_SERVER_URL = "https://parseapi.back4app.com/";
 
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
Parse.serverURL = PARSE_SERVER_URL;
 
export default Parse;