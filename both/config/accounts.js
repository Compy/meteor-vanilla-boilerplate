AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: true,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
      socialIcons: {
          "azureAd": "fa fa-windows"
      },
    },

    onSubmitHook: function(err,state) {
      Session.set("loginWarning",undefined);
      if (state == "signIn" && !err) {
        Meteor.call("loginSuccessful");
        return;
      }

      if (state == "signIn" && err && err.error == 403) {
        var email = $("#at-field-email").val();
        Meteor.call("invalidLoginAttempt", email, function(e,r) {
          if (r) {
            Session.set("loginWarning", r);
          }
        });
      }
    }
});
