Meteor.methods({
  "updateAccountSettings": function(name,email,password) {
    var currentEmail = Meteor.user().emails[0].address;
    if (currentEmail !== email) {
      // Email has changed, so make sure that its a valid email and that there
      // aren't any others on the app with this email.
      var user = Accounts.findUserByEmail(email);
      if (user) throw new Meteor.Error(500, "That email is already registered to another account.");

      // Passed check.
    }

    if (password !== "" && password.length < 6) throw new Meteor.Error(500, "Passwords must be at least 6 characters long.");

    if (!name || name == "") throw new Meteor.Error(500, "Your name is required.");

    Meteor.users.update({_id: Meteor.userId()}, {$set: {'emails.0.address': email, 'profile.name': name}});

    if (password !== "")
      Accounts.setPassword(Meteor.userId(), password, {logout: false});
    
    return true;
  }
});
