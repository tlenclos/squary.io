Meteor.users.attachSchema(new SimpleSchema({
    profile: {
        type:  new SimpleSchema({
            name: {
                type: String,
                label: "Name"
            }
        })
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    }
}));
