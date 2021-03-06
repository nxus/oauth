/*
* @Author: mike
* @Date:   2016-04-17 08:07:35
* @Last Modified 2016-08-08
* @Last Modified time: 2016-08-08 16:58:53
*/
/**
 * [![Build Status](https://travis-ci.org/nxus/oauth.svg?branch=master)](https://travis-ci.org/nxus/oauth)
 * 
 * A module for integrating oauth sessions/accounts into your Nxus app.  By default, the twitter strategy is included.
 * 
 * ## Installation
 * 
 * ```bash
 * > npm install nxus-oauth --save
 * ```
 * 
 * ## Usage
 * 
 * ### Registering a Passport Strategy
 * 
 * ```javascript
 * app.get('oauth').strategy('strategyName', myPassportStrategy.client, {someOpts});
 * ```
 * 
 * # API
 * ------
 */
'use strict';

import passport from 'passport'
import TwitterStrategy from './twitter'
import URL from 'url'

export default class OAuth {

  constructor(app) {
    this.app = app

    this.app.writeDefaultConfig('oauth', {})

    new TwitterStrategy(app)

    this._strategies = [];

    this.router = this.app.get('router')

    this.app.get('oauth').use(this).gather('strategy')

    this.app.on('startup', this._setupStrategies.bind(this))
  }

  strategy(name, client, opts) {
    this._strategies.push({name, client, opts})
  }

  _setupStrategies() {
    this._strategies.forEach((strategy) => {
      passport.use(strategy.client);
      this.router.route('/auth/'+strategy.name, (req, res, next) => {
        strategy.opts.state = req.get('host')
        var host = URL.parse(strategy.opts.callbackURL).host
        if(!host)
          strategy.opts.callbackURL = "http://"+req.get('host')+strategy.opts.callbackURL
        req.session.oauthSuccessRedirect = req.param('redirect')
        this.app.log.debug('req.get(\'host\')', req.get('host'))
        this.app.log.debug('stragety.opts', strategy.opts)
        passport.authorize(strategy.name, strategy.opts)(req, res, next) 
      })

      this.router.getExpressApp().then((express) => {
        express.get('/auth/'+strategy.name+'/callback', 
          passport.authorize(strategy.name, strategy.opts),
          (req, res) => {
            // Successful authentication, redirect home.
            res.redirect(req.session.oauthSuccessRedirect || "/profile");
            req.session.oauthSucessRedirect = null
          }
        )
      })

      this.router.route('/deauth/'+strategy.name, (req, res) => {
        var user;
        user = req.user;
        var service = strategy.name
        return this.app.get('storage').getModel('user').then((User) => {
          user.metadata[service] = null
          return User.update(user, user)
        }).then((usr) => {
          req.login(usr, () => {
            res.redirect(strategy.opts.successPath)
          })
        })
      })
    })
  }
}