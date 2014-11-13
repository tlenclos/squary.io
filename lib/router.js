Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    trackPageView: true
});

Router.route('/', {
    name: 'boardsList',
    waitOn: function() { return [Meteor.subscribe('boards')]; }

});

Router.route('/board/:_id', {
    name: 'board',
    waitOn: function() { return [Meteor.subscribe('pixels'), Meteor.subscribe('boardUser', this.params._id)]; },
    data: function() { return BoardsCollections.findOne(this.params._id); }
});

Router.onBeforeAction('dataNotFound', {only: 'board'});
