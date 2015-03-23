Template.board.rendered = function() {
    Meteor.subscribe('pixels', this.data._id);

    var board = new Pixelboard(
        this.data._id,
        this.data.userId
    );
    board.setupBoard();
    Squary.board.set(board); // TODO Remove dependency with dom on board class
};
