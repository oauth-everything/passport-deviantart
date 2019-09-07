@oauth-everything/passport-deviantart
=====================================

A [Passport](http://passportjs.org/) strategy for authenticating with
[Deviantart](https://www.deviantart.com/) using OAuth 2.0 and the Deviantart API.

This module lets you authenticate using Deviantart in your Node.js applications.
By plugging into Passport, Deviantart authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](https://www.senchalabs.org/connect/)-style middleware, including
[Express](https://expressjs.com/).

## Install

```bash
$ npm install @oauth-everything/passport-deviantart
```
#### Configure Strategy

The Deviantart authentication strategy authenticates users using a Deviantart
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Deviantart profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```ts
passport.use(new Strategy(
    {
        clientID: DEVIANTART_APP_ID,
        clientSecret: DEVIANTART_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/deviantart/callback"
    },
    (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<User>) => {

        User.findOrCreate({ deviantartId: profile.id }, (err: Error, user: User) => {
            return cb(err, user);
        });

    }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'deviantart'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](https://expressjs.com/)
application:

```javascript
app.get('/auth/deviantart',
  passport.authenticate('deviantart'));

app.get('/auth/deviantart/callback',
  passport.authenticate('deviantart', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## License

[The MPL v2 License](https://opensource.org/licenses/MPL-2.0)
