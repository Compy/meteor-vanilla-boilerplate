Template.moveFilesModalBody.helpers({
  files: function() {
    var path = Session.get("fs_currentPath") || "";
    return Files.find({inFolder: path, type: "folder"}, {sort: {name: 1}});
  },
  isFolder: function(f) {
    return (f.type === "folder");
  },
  pathStack: function() {
    var stack = Session.get("fs_folderStack") || [];
    return stack;
  },
  hasNoFiles: function() {
    var path = Session.get("fs_currentPath") || "";
    var fileArray = Files.find({inFolder: path, type: "folder"}, {sort: {name: 1}}).fetch();
    return fileArray.length <= 0;
  },
});

Template.moveFilesModalBody.events({
  'click .folder-link': function(e,t) {
    e.preventDefault();
    if (this._id === Session.get("fs_currentPath")) return;
    Session.set("fs_currentPath", this._id);
    var stack = Session.get("fs_folderStack") || [];
    stack.push({_id: this._id, name: this.name});
    Session.set("fs_folderStack", stack);
  },
  'click .folder-home-link': function(e,t) {
    e.preventDefault();
    Session.set("fs_currentPath", "");
    Session.set("fs_folderStack", []);
  }
});

Template.moveFilesModal.events({
  'click #moveFilesButton': function(e,t) {
    e.preventDefault();
    var selectedFiles = Session.get("fs_selectedFiles") || [];
    var currentFolder = Session.get("fs_currentPath");

    _.each(selectedFiles, function(f) {
      if (f.inFolder == currentFolder) return;
      Files.update({_id: f._id}, {$set: {inFolder: currentFolder}});
    });

    Utils.showSuccess(selectedFiles.length.toString() + " files were moved successfully.");
    $('#moveFilesModal').modal('hide');
  }
});
