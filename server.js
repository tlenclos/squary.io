// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if(PixelBoardsCollection.find().count() === 0) {
      PixelBoardsCollection.insert({color: "#CCC"});
    }
  });
}