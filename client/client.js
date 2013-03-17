if (Meteor.isClient) {
  // This method runs EVERY time the client is opened, which includes page refreshes.
  Meteor.startup(function()
  {
    // TODO : Display a preloader untill connection and data
    Deps.autorun(function() {
      var isConnected = Meteor.status().connected;

      if (isConnected) {
        var pixelboards = new PixelBoards();
        pixelboards.setup();
        pixelboards.setupEvents();
        pixelboards.startUpdateListener();
      }
    });
  });

  // Templates
  Template.tcontrols.events({
    'click p#clean': function () {
      var pixels = PixelBoardsCollection.find({}).fetch();
      _.each(pixels, function(item) {
        PixelBoardsCollection.remove({'_id': item._id});
      });
    }
  });

}