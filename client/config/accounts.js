AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'login',
    layoutTemplate: 'blankLayout',
    redirect: '/',
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/register',
    template: 'register',
    layoutTemplate: 'blankLayout'
});

var email = AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: "Name",
    required: true,
    errStr: 'Please enter your name',
    onTop: true
});

AccountsTemplates.addField(email);
AccountsTemplates.addField(pwd);
