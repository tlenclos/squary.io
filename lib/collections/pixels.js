PixelsCollection = new Meteor.Collection("pixels");

var validateBoardUser = function(ownerId) {
    if (ownerId) {
        var userId = Meteor.userId();
        if (!userId || ownerId !== userId) {
            throw new Meteor.Error('board-rights', 'You are not allowed to draw on this board');
        }
    }
};

Meteor.methods({
    addPixel: function(attributes) {
        this.unblock();
        check(attributes, {
            x: Match.Integer,
            y: Match.Integer,
            color: String,
            boardId: String,
            ownerId: Match.OneOf(String, null)
        });

        validateBoardUser(attributes.ownerId);

        PixelsCollection.upsert(
            {
                x: attributes.x,
                y: attributes.y,
                boardId: attributes.boardId
            },
            {$set: {color : attributes.color, x: attributes.x, y: attributes.y, boardId: attributes.boardId}}
        );
    },
    removePixel: function(attributes) {
        this.unblock();
        check(attributes, {
            x: Match.Integer,
            y: Match.Integer,
            boardId: String,
            ownerId: Match.OneOf(String, null)
        });

        validateBoardUser(attributes.ownerId);

        PixelsCollection.remove({x: attributes.x, y: attributes.y, boardId: attributes.boardId});
    }
});
