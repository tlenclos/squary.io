Template.board.rendered = function() {
    new PixelBoards(this.data._id).setup(); // TODO How to clear previous objects created while we navigate to boards ?
};
