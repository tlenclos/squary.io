Template.profile.helpers({
    isCurrentUser: function() {
        return this.user._id === Meteor.userId();
    }
});
