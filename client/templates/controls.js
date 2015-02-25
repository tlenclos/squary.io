Template.controls.rendered = function() {
    $("#picker").spectrum({
        clickoutFiresChange: true,
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showButtons: false,
        preferredFormat: "hex",
        replacerClassName: 'tool-color'
    });
    $('.sp-preview-inner').text('Color');
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
    message: function() {
        return Session.get('message');
    }
});

Template.controls.events({
    'click #board-title': function(event, context) {
        // Make title editable on click
        var titleDom = event.currentTarget;
        var title = $(event.currentTarget);
        title.attr('contenteditable', true);
        title.trigger('focus');

        // Set selection
        var sel = window.getSelection();
        sel.collapse(titleDom.firstChild, title.text().length);

        // Display save button
        $('#board-title-save').css('display', 'block');
    },
    'click #board-title-save': function(event, context) {
        event.preventDefault();

        event.target.style.display = 'none';
        var title = $('#board-title').text()
        BoardsCollections.update(context.data._id, {$set:{title: title}});
    },
    'click #link-delete-board': function(event, context) {
        event.preventDefault();

        var deleteConfirmed = confirm('Are you sure to delete the board "'+context.data.title+'"');
        if (deleteConfirmed) {
            Meteor.call('deleteBoard', context.data._id);
            Router.go('boardsList');
        }
    },
    'click #link-download-board': function(event, context) {
        event.preventDefault();

        // TODO capture canvas OR download full image rendered
        alert("Sorry this feature is not implemented yet");
    }
});
