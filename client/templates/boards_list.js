Template.boardsList.rendered = function() {
    var header = new Header(document.getElementById('header-canvas'), document.getElementById('header'));
    $(window).resize(function() {
        header.draw();
    });
};

Template.boardsList.helpers({
    loggedIn: function() {
        return Meteor.userId();
    },
    boards: function() {
        return BoardsCollections.find({}, {sort: {createdAt: -1}});
    },
    author: function() {
        var user = Meteor.users.findOne(this.userId);
        if (user) {
            return user.profile.name;
        }
    }
});

Template.boardsList.events({
    'click #createBoard': function(event, context) {
        event.preventDefault();

        Meteor.call('createBoard', function(error, result) { // display the error to the user and abort
            if (error)
                return alert(error.reason);

            Router.go('board', {_id: result});
        });
    }
});
