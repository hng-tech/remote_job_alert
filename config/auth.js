module.exports = {

    'facebookAuth' : {
        'clientID'      : '490283024845189', // your App ID
        'clientSecret'  : '78b6e7e27f56c3440d0da59920a2592d', // your App Secret
        'callbackURL'   : 'http://localhost:3020/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    }
