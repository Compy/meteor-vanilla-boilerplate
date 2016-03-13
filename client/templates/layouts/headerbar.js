Template.headerBar.helpers({
  displayAlert: function() {
    return (Session.get("success") || Session.get("error"));
  },
  success: function() {
    return Session.get("success");
  },
  error: function() {
    return Session.get("error");
  },
  prospectCount: function() {
    return Prospects.find({}).count();
  }
});

Template.headerBar.events({
  'click .btn-logout': function(e,t) {
    e.preventDefault();
    Meteor.logout();
  }
});
