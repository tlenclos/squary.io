if (Meteor.isClient) {
    var firstRun = true;

    // This method runs EVERY time the client is opened, which includes page refreshes.
    Meteor.startup(function()
    {
        Meteor.subscribe("pixels", function() {
            $('#loader').hide('slow');
        });

        Deps.autorun(function() {
            var isConnected = Meteor.status().connected;

            if (isConnected && firstRun) {
                Template.canvas.rendered = function() {
                    var pixelboards = new PixelBoards();
                    pixelboards.setup();
                    pixelboards.setupEvents();
                    pixelboards.startUpdateListener();

                    firstRun = false;
                };
            }
        });
    });

    // Templates
    Template.tcontrols.events({
        'click p#clean': function () {
            var pixels = PixelsCollection.find({}).fetch();
            _.each(pixels, function(item) {
                PixelsCollection.remove({'_id': item._id});
            });
        }
    });

    Template.tcontrols.rendered = function() {
        $.colorcanvas.replaceInputs();
    };

    Template.tcontrols.drawers = function () {
        return UserConnections.find().count();
    };
}
