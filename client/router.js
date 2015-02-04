var subscriptions = new SubsManager();

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notfound',
    trackPageView: true,
    fastRender: true,
    progressSpinner: false
});

Router.route('/', {
    name: 'boardsList',
    layoutTemplate: 'layoutNoWrapper',
    subscriptions: function() {
        return subscriptions.subscribe('boards');
    }
});

Router.route('/404', {
    name: 'notfound'
});

Router.route('/user/:_id', {
    name: 'profile',
    waitOn: function() {
        return [
            subscriptions.subscribe('user', this.params._id),
            subscriptions.subscribe('userBoards', this.params._id),
        ];
    },
    data: function() {
        return {
            user: Meteor.users.findOne(this.params._id),
            userBoards: BoardsCollections.find({userId: this.params._id}),
            userBoardsCount: BoardsCollections.find({userId: this.params._id}).count()
        };
    }
});

Router.route('/user/:_id/edit', {
    name: 'profileEdit',
    data: function() {
        return Meteor.users.findOne(this.params._id);
    },
    onBeforeAction: function(pause) {
        AccountsTemplates.ensureSignedIn.call(this, pause);

        if (this.params._id != Meteor.userId()) {
            this.redirect('notfound');
        }
    }
});

Router.route('/board/create', function() {;
    if (!Meteor.userId()) {
        alert('Please login first.');
    } else {
        var boardId = BoardsCollections.insert({title: 'My pixel art'}); // TODO Unsafe
        Router.go('board', {_id: boardId});
    }
});

Router.route('/board/:_id', {
    name: 'board',
    layoutTemplate: 'noLayout',
    subscriptions: function() {
        return subscriptions.subscribe('user', this.params._id);
    },
    waitOn: function() {
        return subscriptions.subscribe('board', this.params._id);
    },
    data: function() {
        return BoardsCollections.findOne(this.params._id);
    }
});

Router.route('/changelog', function() {
    Meteor.call('getChangelog', function(err, data) {
        if (err) {
            console.log(err);
        }
        if (data) {
            Session.set('changelog', data.content);
        }
    });

    this.render('changelog');
});

Router.onBeforeAction(function() {
    Session.set('message', null); // Clear flash message on page change
    this.next();
});
Router.onBeforeAction('dataNotFound', {only: 'board'});
