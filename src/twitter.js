/*
* @Author: mike
* @Date:   2016-04-17 08:38:16
* @Last Modified 2016-05-20
* @Last Modified time: 2016-05-20 08:16:33
*/

'use strict';

import TwitterStrategy from 'passport-twitter'

export default class Twitter {
  constructor(app) {
    this.app = app

    var _defaultConfig = {
      consumerKey: "",
      consumerSecret: ""
    }
    if(this.app.config.oauth && !this.app.config.oauth.twitter)
      this.app.writeDefaultConfig('oauth', Object.assign(this.app.config.oauth, {twitter: _defaultConfig}))

    this.opts = Object.assign(this.app.config.oauth.twitter, {
      callbackURL: "/auth/twitter/callback",
      passReqToCallback: true,
    })

    this.client = new TwitterStrategy(this.opts,
      (req, token, tokenSecret, profile, done) => {
        this.app.get('oauth').emit('success', 'twitter', {token: token, tokenSecret: tokenSecret, profile: profile}, req)
        done(null, {})
      }
    )

    this.app.get('oauth').strategy("twitter", this.client, this.opts)
  }
}