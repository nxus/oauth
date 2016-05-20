# nxus-oauth

## 

[![Build Status](https://travis-ci.org/nxus/oauth.svg?branch=master)](https://travis-ci.org/nxus/oauth)

A module for integrating oauth sessions/accounts into your Nxus app.  By default, the twitter strategy is included.

### Installation

```bash
> npm install nxus-oauth --save
```

### Usage

#### Registering a Passport Strategy

```javascript
app.get('oauth').strategy('strategyName', myPassportStrategy.client, {someOpts});
```

## API

* * *
