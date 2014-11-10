Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'boardsList',
    waitOn: function() { return Meteor.subscribe('boards'); }

});

Router.route('/board/create', function() {
    var boardId = BoardsCollections.insert({title: 'My pixel art'}); // TODO Unsafe
    Router.go('board', {_id: boardId});
});

Router.route('/board/:_id', {
    name: 'board',
    waitOn: function() { return Meteor.subscribe('pixels'); },
    data: function() { return BoardsCollections.findOne(this.params._id); }
});

Router.onBeforeAction('dataNotFound', {only: 'board'});
