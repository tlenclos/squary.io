Template.board.rendered = function() {
    Meteor.subscribe('pixels', this.data._id);

    var canDraw = Meteor.userId() && (Meteor.userId()  === this.data.userId);
    var board = new Pixelboard(
        this.data._id,
        this.data.userId,
        Meteor.userId(),
        canDraw
    );
    board.setup();
    Squary.board = board; // TODO Remove dependency with dom on board class
};
