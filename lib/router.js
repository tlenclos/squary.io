var subscriptions = new SubsManager();

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    trackPageView: true,
    fastRender: true
});

Router.route('/', {
    name: 'boardsList',
    waitOn: function() { return subscriptions.subscribe('boards'); }
});

Router.route('/board/:_id', {
    name: 'board',
    waitOn: function() {
        var boardId = this.params._id;
        return [
            subscriptions.subscribe('boardUser', boardId),
            subscriptions.subscribe('board', boardId)
        ];
    },
    data: function() {
        return BoardsCollections.findOne(this.params._id);
    }
});

Router.route('/changelog', function() {
    Meteor.call('getChangelog', function(err, data) {
        if (err)
            console.log(err);

        if (data)
            Session.set('changelog', data.content);
    });

    this.render('changelog');
});

Router.onBeforeAction(function() {
    Session.set('message', null); // Clear flash message on page change
    this.next();
});
Router.onBeforeAction('dataNotFound', {only: 'board'});
