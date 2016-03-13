Template.login.onRendered(function() {
  $('input').iCheck({
    checkboxClass: 'icheckbox_square-blue',
    radioClass: 'iradio_square-blue',
    increaseArea: '20%' // optional
  });
});

Template.login.helpers({
  'loginWarning': function() { return Session.get("loginWarning"); }
})
