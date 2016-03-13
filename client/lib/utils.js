Utils = {
  formatPhone: function(num) {
    // Strip the +1
    if (!num) return "";
    if (num.length == 11) num = num.substring(1);
    if (num.length == 12) num = num.substring(2);
    var areaCode = num.substring(0,3);
    var exchange = num.substring(3,6);
    var last4 = num.substring(6,10);

    return "(" + areaCode + ") " + exchange + "-" + last4;
  },
  getNameOrEmail: function() {
    if (!Meteor.user()) return "";
    if (!Meteor.user().profile || !Meteor.user().profile.name) return Meteor.user().emails[0].address;
    return Meteor.user().profile.name;
  },
  formatSeconds: function(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
  },
  validateEmail: function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }
};
