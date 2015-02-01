Template.boardsList.helpers({
    boards: function() {
        return BoardsCollections.find({}, {sort: {createdAt: -1}});
    },
    author: function() {
        var user = Meteor.users.findOne(this.userId);
        if (user) {
            return user.profile.name;
        } else {
            return 'Anonymous';
        }
    }
});
