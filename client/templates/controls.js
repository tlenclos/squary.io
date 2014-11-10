Template.controls.events({
    'click p#clean': function () {
        var pixels = PixelsCollection.find({}).fetch();
        _.each(pixels, function(item) {
            PixelsCollection.remove({'_id': item._id});
        });
    }
});

Template.controls.rendered = function() {
    $.colorcanvas.replaceInputs();
};

Template.controls.drawers = function () {
    return UserConnections.find().count();
};

Template.controls.events({
    'change input[name=title]': function(event, context) {
        var title = event.target.value;
        BoardsCollections.update(context.data._id, {$set:{title: title}});
        console.log('Title changed to '+title);
    },
    'click #link-delete-board': function(event, context) {
        event.preventDefault();

        var deleteConfirmed = confirm('Are you sure to delete the board "'+context.data.title+'"');
        if (deleteConfirmed) {
            Meteor.call('deleteBoard', context.data._id);
            Router.go('boardsList');
        }
    }
});
