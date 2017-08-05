exports.port = 3001;
exports.defaultFailResponse = { error: "An unexpected error occurred", status: -2 };
exports.defaultTaxRate = 0.153;
// on home view, if range to be displayed is larger than this number of days, use month resolution instead of day
exports.MONTH_RESOLUTION_THRESHOLD = 120;
exports.DB_OPTIONS = {
  host: "",
  database: "",
  user: "",
  password: "",
  dateStrings: true
};
exports.FB_APP = {
  clientID: "",
  clientSecret: "",
  //callbackURL: 'https://beautybooks.biz/login/facebook/return'
  callbackURL: 'http://beautybooks.biz:3000/login/facebook/return'
};
exports.GOOG_APP = {
  clientID: "",
  clientSecret: "",
  //callbackURL: 'https://beautybooks.biz/login/google/return'
  callbackURL: 'http://beautybooks.biz:3000/login/google/return'
}
