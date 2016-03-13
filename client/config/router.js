Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
});

Router.route('dashboard', {
  path: '/',
  waitOn: function() {
    return [
    ];
  },
  action: function () {
    this.render('dashboard');
    this.layout('layout');
  }
});

Router.route('account', {
  path: '/account',
  action: function () {
    this.render('account');
    this.layout('layout');
  }
});


Router.route('logout', {
    path: '/logout',
    onBeforeAction: function() {
        Meteor.logout(function() {
            Router.go('/')
        })
    }
});


var OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId() || !Meteor.user()) {
      this.render('login');
      this.layout('blankLayout');
    } else {
      this.next();
    }
  }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['signIn','signUp']
});
