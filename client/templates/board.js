Template.board.rendered = function() {
    Meteor.subscribe('pixels', this.data._id);

    var board = new Pixelboard(
        this.data._id,
        this.data.userId
    );
    board.setup();
    Squary.board = board; // TODO Remove dependency with dom on board class
};
