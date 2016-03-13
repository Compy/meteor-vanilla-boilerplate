Template.layout.onRendered(function() {
  var classes = "hold-transition fixed";
  classes += " sidebar-mini";
  $("body").addClass(classes);
  $(".content-wrapper").css("min-height", $("body").height() - 32 - $(".main-footer").height());
  $(window).on("resize", function() {
    $(".content-wrapper").css("min-height", $("body").height() - 32 - $(".main-footer").height());
  });
  Meteor.setTimeout(function() {
    $(".content-wrapper").css("min-height", $("body").height() - 32 - $(".main-footer").height());
  }, 1000);
});

Template.layout.helpers({
  displayAlert: function() {
    return (Session.get("success") || Session.get("error"));
  },
  success: function() {
    return Session.get("success");
  },
  error: function() {
    return Session.get("error");
  }
});
