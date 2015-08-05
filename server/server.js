// Startup work
Meteor.startup(function(){
    // Mongo indexes
    console.log('Ensure index mongo DB');
    BoardsCollections._ensureIndex({createdAt:1});

    // Configure oauth accounts
    var configureService = function(name, config) {
        console.log("Configuring " + name + " oauth");

        // first, remove configuration entry in case service is already configured
        ServiceConfiguration.configurations.remove({
            service: name
        });

        var data = {
            service: name,
            secret: config.secret,
            loginStyle: 'popup'
        };

        if (name === 'facebook') {
            data.appId = config.clientId;
        } else if (name === 'google') {
            data.clientId = config.clientId;
        }

        ServiceConfiguration.configurations.insert(data);
    };

    if (Meteor.settings.facebook) {
        configureService("facebook", Meteor.settings.facebook);
    }
    if (Meteor.settings.google) {
        configureService("google", Meteor.settings.google);
    }

    // Cronjobs
    /*
    SyncedCron.add({
        name: 'Clear boards not linked to a user',
        schedule: function(parser) {
            return parser.text('at 01:00 am');
        },
        job: function() {
            var boardsWithoutUser = BoardsCollections.find({userId: null}).fetch();
            _.each(boardsWithoutUser, function(board) {
                PixelsCollection.remove({boardId: board._id});
                BoardsCollections.remove({_id: board._id});
            });

            return true;
        }
    });
    */

    SyncedCron.add({
        name: 'Render recently updated board',
        schedule: function(parser) {
            return parser.text('every 10 minutes');
        },
        job: function() {
            Meteor.call('renderAllBoardImage');
            return true;
        }
    });

    SyncedCron.start();

    // Emails
    Meteor.Mandrill.config({
        username: Meteor.settings.mandrillUsername,
        key: Meteor.settings.mandrillapiKey
    });

    Accounts.emailTemplates.siteName = "Squary";
    Accounts.emailTemplates.from = "no-reply@squary.io";
});
