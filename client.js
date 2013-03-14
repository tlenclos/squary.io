if (Meteor.isClient) {

  // This method runs EVERY time the client is opened, which includes page refreshes.
  Meteor.startup(function()
  {
    // TODO : Check if connection with the server has been established
    setTimeout(function() {
      var pixelboards = new PixelBoards();
      pixelboards.setup();
      pixelboards.setupEvents();
      pixelboards.startUpdateListener();
    }, 500);
  });

  // Templates
  Template.tcontrols.events({
    'click p#clean': function () {
      console.log('Clean board');
      // We can't remove all items from an events
      _.each(PixelBoardsCollection.find({}).fetch(), function(item) {
        PixelBoardsCollection.remove({'_id': item._id});
      });

      //TODO : Redraw canvas
    }
  });

}