// Publish a modified subset of the user document
Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {profile: 1, emails: 1, _id: 1, someRestrictedProp: 1}});
});
