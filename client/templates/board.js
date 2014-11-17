Template.board.rendered = function() {
    /*
       TODO Move this fetch to controller
       Sometime the user is undefined if not in local cached on first load
     */
    var user = Meteor.users.findOne({_id: this.data.userId});
    new Pixelboard(
        this.data._id,
        user ? user._id : null
    ).setup(); // TODO How to clear previous objects created while we navigate to boards ?
};
