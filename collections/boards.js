BoardsCollections = new Meteor.Collection("boards");

// Only allow user to update board
// TODO What is the best practice, use allow or methods ?
BoardsCollections.allow({
    update: function(userId, board) {
        return board.userId === userId;
    }
});

Meteor.methods({
    createBoard: function() {
        var userId = Meteor.userId();
        if (!userId) {
            throw new Meteor.Error(401, 'Please login before creating a board.');
        }

        return BoardsCollections.insert({title: 'My pixel art', userId: userId});;

    },
    deleteBoard: function(id) {
        check(id, String);

        var board = BoardsCollections.findOne(id);
        if (board.userId != Meteor.userId()) {
            throw new Meteor.error(401, 'You are not allowed to do that o_O');
        }

        PixelsCollection.remove({boardId: id});
        BoardsCollections.remove({_id: id});

        return true;
    }
});
