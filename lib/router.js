Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

Router.route('/', {
    name: 'boardsList',
    waitOn: function() { return Meteor.subscribe('boards'); }

});
Router.route('/board/:_id', {
    name: 'board',
    waitOn: function() { return Meteor.subscribe('pixels'); },
    data: function() { return BoardsCollections.findOne(this.params._id); },
    onBeforeAction: function (pause) {
        // Create board dynamically if it does not exist
        if (!this.params._id)
            this.next();

        var board = BoardsCollections.findOne(this.params._id);
        if (!board) {
            var boardId = BoardsCollections.insert({title: this.params._id});
            this.redirect('/board/'+boardId);
        } else {
            this.next();
        }
    }
});
