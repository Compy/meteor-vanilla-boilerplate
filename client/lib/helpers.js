UI.registerHelper("shortMonthYear", function(date) {
  return moment(date).format("MMM. YYYY");
});

UI.registerHelper("formatPhone", function(phone) {
  return Utils.formatPhone(phone);
});

UI.registerHelper("formatSeconds", function(seconds) {
  return Utils.formatSeconds(seconds);
});
UI.registerHelper("formatBytes", function (fileSizeInBytes) {
  if (typeof(fileSizeInBytes) === "undefined") return "0 kB";
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
});

UI.registerHelper("formatDate", function(date) {
  return moment(date).format("ddd MMM D, YYYY HH:mm:ss");
});

UI.registerHelper("getNameOrEmail", function() {
  return Utils.getNameOrEmail();
});
