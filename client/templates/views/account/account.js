Template.account.events({
  'submit #accountSettingsForm': function(e,t) {
    e.preventDefault();
    var email = $("#txtEmail").val();
    var name = $("#txtName").val();
    if (!email || !name || email === "" || name === "") {
      Notifications.error('Missing Required Fields', 'Your name and email address are required.');
      return;
    }

    // Is our password changing?
    var password = $("#txtPassword1").val();
    var password2 = $("#txtPassword2").val();

    if (password !== "") {
      // Password was specified, assume its a change.
      if (password.length < 6) {
        Notifications.error('Password Too Short', 'Passwords must be at least 6 characters long.');
        return;
      }
      if (password !== password2) {
        Notifications.error('Password Mismatch', 'Your new password and confirmation password must be the same.');
        return;
      }
    }

    Meteor.call("updateAccountSettings", name, email, password, function(err,res) {
      if (err) {
        Notifications.error('Settings Not Saved', err.reason);
      } else {
        Notifications.success('Account Settings Saved', 'Your account settings have been saved successfully.');
      }
    });
  }
});
