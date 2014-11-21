Template.boardsList.helpers({
    boards: function() {
        return BoardsCollections.find({}, {sort: {createdAt: -1}});
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


Router.route('/board/create', function() {;
    if (!Meteor.userId()) {
        alert('Please login first.');
    } else {
        var boardId = BoardsCollections.insert({title: 'My pixel art'}); // TODO Unsafe
        Router.go('board', {_id: boardId});
    }
});
