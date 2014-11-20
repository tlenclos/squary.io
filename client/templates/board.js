Template.board.rendered = function() {
    Meteor.subscribe('pixels', this.data._id);
    var user = Meteor.users.findOne({_id: this.data.userId});

    new Pixelboard(
        this.data._id,
        user ? user._id : null
    ).setup(); // TODO How to clear previous objects created while we navigate to boards ?
};
