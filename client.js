if (Meteor.isClient) {

  // This method runs EVERY time the client is opened, which includes page refreshes.
  Meteor.startup(function()
  {
    // TODO Check if connection with the server has been established
    setTimeout(function() {
      var pixelboards = new PixelBoards();
      pixelboards.setup();
      pixelboards.setupEvents();
      pixelboards.startUpdateListener();
    }, 500);
  });
}