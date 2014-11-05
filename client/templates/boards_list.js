Template.boardsList.helpers({
    boards: function() {
        return BoardsCollections.find();
    }
});
