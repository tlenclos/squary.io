Template.controls.rendered = function() {
    $("#picker").spectrum({
        clickoutFiresChange: true,
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showButtons: false,
        preferredFormat: "hex"
    });
};

Template.controls.helpers({
    ownBoard: function() {
        return this.userId === Meteor.userId();
    },
    drawers: function () {
        return UserConnections.find().count();
    },
    owner: function() {
        var user = Meteor.users.findOne({_id: this.userId});
        return user ? user.profile.name : false;
    },
    disableTitleEdition: function() {
        return this.userId === Meteor.userId() ? "false" : "true";
    },
    message: function() {
        return Session.get('message');
    }
});

Template.controls.events({
    'click p#clean': function () {
        var pixels = PixelsCollection.find({}).fetch();
        _.each(pixels, function(item) {
            PixelsCollection.remove({'_id': item._id});
        });
    },
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
