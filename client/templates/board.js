Template.board.rendered = function() {
    Meteor.subscribe('pixels', this.data._id);

    new Pixelboard(
        this.data._id,
        this.data.userId
    ).setup(); // TODO How to clear previous objects created while we navigate to boards ?
};
