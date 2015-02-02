Template.boardsList.helpers({
    boards: function() {
        return BoardsCollections.find({}, {sort: {createdAt: -1}});
    },
    author: function() {
        return Meteor.users.findOne(this.userId);
    }
});
