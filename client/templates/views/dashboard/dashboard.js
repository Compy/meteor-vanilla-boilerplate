var saveLocationHandler = null;
var saveCommentHandler = null;
Template.dashboard.onRendered(function() {
  $(".content-wrapper").css("min-height", $("body").height() - 32 - $(".main-footer").height());

  Session.set("currentPath","");
  Session.set("folderStack",[]);
  Session.setDefault("currentSort", {name: 1, type: -1});

  var totalSize = 0;
  Files.find({}).forEach(function(f) {
    totalSize += f.size;
  });
  Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.usage": totalSize}});

  $(window).on('resize', function() {
    $(".main-file-manager").css("min-height", $("body").height() - 180 - $(".main-footer").height());
  });
  $(".main-file-manager").css("min-height", $("body").height() - 180 - $(".main-footer").height());

  saveLocationHandler = _.debounce( function(element, doc){
    $(element).closest(".saving-data").first().show();
    Files.update({_id: doc._id}, {$set: {location: $(element).val()}}, function() {
      $(element).closest(".saving-data").first().hide();
    });
  }, 500 );

  saveCommentHandler = _.debounce( function(element, doc){
    $(element).closest(".saving-data").first().show();
    Files.update({_id: doc._id}, {$set: {comments: $(element).val()}}, function() {
      $(element).closest(".saving-data").first().hide();
    });
  }, 500 );
});

Template.dashboard.events({
  'click .sort-trigger': function(evt,tpl) {
    var sortCol = $(evt.target).data("sort");
    var currentSort = Session.get("currentSort") || {};
    if (typeof(currentSort[sortCol]) === "undefined") currentSort[sortCol] = 1;
    else if (currentSort[sortCol] === -1) currentSort[sortCol] = 1;
    else currentSort[sortCol] = -1;

    var newSort = {};
    newSort["type"] = -1;
    newSort[sortCol] = currentSort[sortCol];
    Session.set("currentSort", newSort);
  },
  'click .btn-move-files': function(evt,tpl) {
    evt.preventDefault();
    Session.set("fs_currentPath","");
    Session.set("fs_folderStack",[]);

    var selectedFiles = [];

    _.each($(".file-selector:checked"), function(f) {
      var d = Blaze.getData(f);
      if (!d) return;
      selectedFiles.push(d);
    });

    if (selectedFiles.length < 1) {
      bootbox.alert("You must select one or more files or folders in order to move them.");
      return;
    }

    Session.set("fs_selectedFiles", selectedFiles);

    $('#moveFilesModal').modal('show');
  },
  'click .btn-new-folder': function(evt,tpl) {
    bootbox.prompt("Enter a name for the new folder", function(r) {
      if (!r || r == "") return;
      var path = Session.get("currentPath") || "";
      console.log("Creating new folder in", path);

      // Make sure the folder doesn't exist
      var f = Files.findOne({name: r, type: "folder"});
      if (f) {
        bootbox.alert("The folder '" + r + "' already exists!");
        return;
      }

      // Folder doesn't exist, so create it.
      Files.insert({
        name: r,
        type: "folder",
        owner: Meteor.user().emails[0].address,
        inFolder: path,
        size: 0,
        uploadDate: new Date()
      });
    });
  },
  'click .btn-delete': function(e,t) {
    e.preventDefault();
    bootbox.confirm("Are you sure you wish to delete the selected files?", function(res) {
      if (!res) return;
      var folders = [];
      _.each($(".file-selector:checked"), function(f) {
        var d = Blaze.getData(f);
        if (!d) return;

        var path = d.s3path;
        if (!path) {
          path = Session.get("folderStack") || [];
          path.push(d.name);
          path = "/" + path.join("/");
        }

        console.log(path);

        S3.delete(path, function(err,res) {
          if (err) {
            console.error(err);
            bootbox.alert("There was an error deleting your file. Please try again.");
          } else {
            Files.remove({_id: d._id});
            if (d.type == "folder") folders.push(d._id);
          }
        });
      });

      // Now toast any folders we may have found
      _.each(folders, function(f) {
        Files.find({inFolder: f}).forEach(function(fldr) {
          Files.remove({_id: fldr._id});
        });
      });

      Meteor.setTimeout(function() {
        var totalSize = 0;
        Files.find({}).forEach(function(f) {
          totalSize += f.size;
        });
        Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.usage": totalSize}});
      }, 1000);
    });
  },
  'click .toggle-detail-view': function(e,t) {
    e.preventDefault();
    var fId = this._id;
    if ($(".details-"+fId).is(":visible")) {
      $(".details-"+fId).hide();
    } else {
      $(".details-"+fId).show();
    }
  },
  'click .folder-link': function(e,t) {
    e.preventDefault();
    if (this._id === Session.get("currentPath")) return;
    Session.set("currentPath", this._id);
    var stack = Session.get("folderStack") || [];
    stack.push({_id: this._id, name: this.name});
    Session.set("folderStack", stack);
  },
  'click .folder-home-link': function(e,t) {
    e.preventDefault();
    Session.set("currentPath", "");
    Session.set("folderStack", []);
  },
  'click .btn-upload-files': function(e,t) {
    e.preventDefault();
    $("#fileUpload").trigger("click");
  },
  'change #fileUpload': function(e,t) {
    uploadFiles(e.currentTarget.files);
  },
  'change .master-file-selector': function(e,t) {
    $(".file-selector").prop("checked", $(".master-file-selector").is(":checked"));
  },
  'keyup .file-location': function(e,t) {
    saveLocationHandler($(e.target), this);
  },
  'keyup .file-comments': function(e,t) {
    saveCommentHandler($(e.target), this);
  },
  'dragenter .main-file-manager': function(ev) { ev.preventDefault(); },
  'dragover .main-file-manager': function(ev) { ev.preventDefault(); },
  'drop .main-file-manager': function(event) {
    event.preventDefault();
    event.stopPropagation();
    uploadFiles(event.originalEvent.dataTransfer.files);
  }
});

function uploadFiles(fileList) {
  if (fileList && fileList.length > 0) {


    //console.log(event.originalEvent.dataTransfer.files);

    var errors = "";
    /*
    _.each(event.originalEvent.dataTransfer.files, function(f) {
      // Make sure the file doesn't exist. If so, kick it back.
      var fCheck = Files.findOne({name: f.name});
      if (fCheck) {
        errors += "Could not upload file " + f.name + " (File already exists)<br/>";
      } else {
        var file = {
          name: f.name,
          size: f.size,
          owner: Meteor.userId(),
          type: "file",
          inFolder: Session.get("currentPath"),
          uploadDate: new Date(),
          processingPercentage: 0
        };
        Files.insert(file);
        Meteor.users.update({_id: Meteor.userId()}, {$inc: {"profile.usage": file.size}});
      }
    });
    */
    var path = "";
    var stack = Session.get("folderStack") || [];
    if (stack.length > 0) path = _.pluck(stack,"name").join("/");
    S3.upload({
      files: fileList,
      bucket: Meteor.userId().toLowerCase() + ".optigo.net",
      path: path,
    },function(e,r){
      console.log(e);
      console.log(r);
      if (e)
      {
        bootbox.alert("There was an error uploading your PCAP file. Please try again.");
      } else {
        /*
        Attachments.insert({
          meetingId: meetingId,
          cardId: cardId,
          uploadedBy: Meteor.user().profile.name,
          uploadedEmail: Meteor.user().emails[0].address,
          url: r.secure_url,
          size: r.size,
          relative_url: r.relative_url,
          name: getFileName(r.relative_url),
          mimeType: file.type
        });
        */

        var file = {
          name: r.file.original_name,
          size: r.file.size,
          owner: Meteor.user().emails[0].address,
          type: "file",
          inFolder: Session.get("currentPath"),
          uploadDate: new Date(),
          processingPercentage: 25,
          s3path: r.relative_url,
          s3url: r.secure_url
        };
        var _fileId = Files.insert(file);
        Meteor.users.update({_id: Meteor.userId()}, {$inc: {"profile.usage": file.size}});
        Meteor.call("capinfo", r.secure_url, _fileId);
      }
    });
    if (errors != "") {
      bootbox.alert(errors);
    }
    /*
    var d = Blaze.getData(event.target);
    if (!d) return;
    var cardText = event.originalEvent.dataTransfer.files[0].name,
        listId = d._id,
        meetingId = d.meetingId,
        sort = d.cards().count()

    var newCard = {
        text: cardText,
        listId: listId,
        meetingId: meetingId,
        checked: false,
        sort: sort
    };

    var cardId = Cards.insert(newCard);

    if (event.originalEvent.dataTransfer.files.length > 0) {
      _.each(event.originalEvent.dataTransfer.files, function(f) {
        uploadFile(f, newCard.meetingId, cardId);
      });
    }

    setTimeout(function() { $('[data-toggle="tooltip"]').tooltip(); }, 250);
    */
  }
}

Template.dashboard.helpers({
  files: function() {
    var path = Session.get("currentPath") || "";
    return Files.find({inFolder: path}, {sort: Session.get("currentSort")});
  },
  isFolder: function(f) {
    return (f.type === "folder");
  },
  pathStack: function() {
    var stack = Session.get("folderStack") || [];
    return stack;
  },
  uploads: function() {
    return S3.collection.find({status: {$ne: "complete"}});
  },
  isSorted: function(col) {
    var cs = Session.get("currentSort");
    return cs && !!cs[col];
  },
  isDescSort: function(col) {
    var cs = Session.get("currentSort");
    return cs && cs[col] == -1;
  },
  isAscSort: function(col) {
    var cs = Session.get("currentSort");
    return cs && cs[col] == 1;
  }
});
