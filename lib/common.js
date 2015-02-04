UserConnections = new Meteor.Collection("user_status_sessions");

// Accounts
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');

AccountsTemplates.configure({
    showForgotPasswordLink: true,
    overrideLoginErrors: false,
    enablePasswordChange: true,
    negativeFeedback: true
});
