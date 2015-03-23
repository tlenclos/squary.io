ColorsCollections = new Meteor.Collection("colors");

// Only allow user to add color
ColorsCollections.allow({
    insert: function(userId, board) {
        return board.userId === userId;
    },
    remove: function(userId, board) {
        return board.userId === userId;
    }
});

Meteor.methods({
    addColor: function(boardId, color) {
        return ColorsCollections.insert({color: color, boardId: boardId, createdAt: new Date()});
    },
    removeColor: function(boardId, colorId) {
        return ColorsCollections.remove({_id: colorId, boardId: boardId});
    }
});
