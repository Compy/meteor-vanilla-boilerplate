Accounts.onCreateUser(function(options, user) {
    //pass the surname in the options
    // Copies options.profile to new user document

    user.profile = options.profile || {};
    user.refreshTokens = {};

    if (user.services && user.services.google) {
        user.profile.avatar = user.services.google.picture;
        user.emails = [{address: user.services.google.email, verified: true}];
        user.refreshTokens.google = user.services.google.refreshToken || undefined;

    }
    if (user.services && user.services.azureAd) {
        user.emails = [{address: user.services.azureAd.mail, verified: true}];
        user.refreshTokens.azureAd = user.services.azureAd.refreshToken || undefined;
    }

    user.profile.accountCreated = new Date();
    user.profile.lastLogin = new Date();

    // Place any other custom fields here.

    return user
});

Accounts.onLogin(function(e) {
  var update = {
    "profile.lastLogin": new Date()
  };
  if (e.user.services && e.user.services.google && e.user.services.google.refreshToken) {
    update.refreshTokens = {
      google: e.user.services.google.refreshToken
    };
  }

  Meteor.users.update({_id: e.user._id},{$set: update});

});
