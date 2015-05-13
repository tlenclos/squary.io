Meteor.publish("pixels", function(boardId) {
    this.unblock();
    return PixelsCollection.find({boardId: boardId});
});
Meteor.publish("colors", function(boardId) {
    this.unblock();
    return ColorsCollections.find({boardId: boardId});
});
Meteor.publish("boards", function(limit) {
    this.unblock();
    limit = limit || 10;

    var options = {
        sort: {createdAt: -1},
        limit: limit
    };

    var boardsCursor = BoardsCollections.find({}, options);
    var userIds = boardsCursor.map(function (board) {
        return board.userId;
    });

    return [
        boardsCursor,
        Meteor.users.find({_id: {$in: userIds}})
    ];
});
Meteor.publish("userBoards", function(userId) {
    return BoardsCollections.find({userId: userId});
});
Meteor.publish("board", function(boardId) { // TODO Merge the user in this subscription
    this.unblock();
    return BoardsCollections.find({_id: boardId});
});
Meteor.publish("boardOwner", function(boardId) { // TODO Merge the user in this subscription
    this.unblock();
    var board = BoardsCollections.findOne({_id: boardId});

    if (board) {
        return Meteor.users.find({_id: board.userId}, {fields: {_id: 1, profile: 1}});
    }
});
Meteor.publish("user", function(userId) {
    this.unblock();
    return Meteor.users.find({_id: userId}, {fields: {_id: 1, profile: 1}});
});

Meteor.publish('onlineUsers', function() {
    this.unblock();

    return [
        Meteor.users.find({
            "status.online": true
        }, {
            fields: {
                status: 1,
                username: 1
            }
        }), UserStatus.connections.find()
    ];
});
