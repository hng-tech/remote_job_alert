module.exports = {

    'facebookAuth' : {
        'clientID'      : '490283024845189', // your App ID
        'clientSecret'  : '78b6e7e27f56c3440d0da59920a2592d', // your App Secret
        'callbackURL'   : 'http://localhost:3020/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
    'googleAuth' : {
        'clientID'      : '470798273027-o4tff9ertang77i8rpammg6quoouapia.apps.googleusercontent.com',
        'clientSecret'  : 'fkyK2lsyDWXxhunGSlYRU1ph',
        'callbackURL'   : 'http://localhost:3020/auth/google/callback',
        'profileFields' : ['id', 'email', 'name']
    }

};

// 'https://devalert.me/auth/google/callback'
// 'https://devalert.me/auth/facebook/callback'
