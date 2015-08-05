Meteor.publish("pixels", function(boardId) {
    this.unblock();
    return PixelsCollection.find({boardId: boardId});
});

Meteor.publish("colors", function(boardId) {
    this.unblock();
    return ColorsCollections.find({boardId: boardId});
});

Meteor.publishComposite("boards", function(limit) {
    this.unblock();

    return {
        find: function() {
            limit = limit || 10;
            return BoardsCollections.find({}, {
                sort: {pixels: -1, createdAt: -1},
                limit: limit
            });
        },
        children: [
            {
                // Find board author.
                find: function(board) {
                    return Meteor.users.find(
                        { _id: board.userId },
                        { limit: 1, fields: { profile: 1 } });
                }
            },
            {
                // Find board preview.
                find: function(board) {
                    return ImagesCollection.find(
                        { _id: board.thumbnail },
                        { limit: 1 });
                }
            }
        ]
    };
});

Meteor.publishComposite("userBoards", function(userId) {
    this.unblock();

    return {
        find: function() {
            return BoardsCollections.find({userId: userId});
        },
        children: [
            {
                // Find board preview.
                find: function(board) {
                    return ImagesCollection.find(
                        { _id: board.thumbnail },
                        { limit: 1 });
                }
            }
        ]
    };
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
