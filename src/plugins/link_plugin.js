/* global
    UALinkModule: false,
    UALinkPlugin: true,
    UALog: false,
    UAPlugin: false,
    UserAccounts: false
*/
'use strict';


// ------------------------------------------
//  Logs the start of execution for this file
// ------------------------------------------
UALog.trace('Loading link_plugin.js');


// define the UALinkPlugin class
UALinkPlugin = function _UALinkPlugin() {
  var self = this;

  UAPlugin.call(self);

  self._id = 'links';
};


// inherit UAPlugin
UALinkPlugin.prototype = new UAPlugin();

_.extend(UALinkPlugin.prototype, {
  // correct the constructor pointer because it points to UAModule
  constructor: UALinkPlugin,

  _clickCallbacks: [],

  _modules: [],

  configure: function configure(options) {
    UALog.trace('configure ' + this._id);
    // console.log(options);

    this.text = _.defaults(options.text || {}, this.text);
  },

  init: function init() {
    var self = this;
    var signInLink;
    var signUpLink;

    UALog.trace('Creating signInLink module');

    signInLink = new UALinkModule(
      'signInLink',
      60,
      'sign-in-link',
      'signIn',
      {
        'default': {
          prefix: 'If you already have an account',
          suffix: '',
          text: 'sign in',
        },
      }
    );

    UALog.trace('Creating signUpLink module');
    signUpLink = new UALinkModule(
      'signUpLink',
      70,
      'sign-up-link',
      'signUp',
      {
        'default': {
          prefix: 'Don\'t have an account?',
          suffix: '',
          text: 'Register',
        },
      }
    );

    self._modules.push(signInLink);
    self._modules.push(signUpLink);

    UALog.trace('Registering modules');
    _.each(self._modules, function regModule(module) {
      UserAccounts.registerModule(module);
    });

    if (Meteor.isClient) {
      Template.uaForm.events({
        'click .ua-link a': function clickUALink(e) {
          e.preventDefault();
          self.linkClick(this.instance, this.module);
        },
      });
    }
  },

  linkClick: function linkClick(uaTmpl, module) {
    var callback;
    var callbacks;
    var route = module.targetState;

    callbacks = _.map(UserAccounts.links._clickCallbacks, function lcb(cb) {
      return cb(uaTmpl, route);
    });
    callback = _.find(callbacks, function fcb(cb) {return cb; });
    if (callback) {
      callback();
    } else {
      uaTmpl.setState(module.targetState);
    }
  },

  onClick: function onClick(callback) {
    check(callback, Function);
    this._clickCallbacks.push(callback);
  },

  uninit: function uninit() {
    UALog.trace('Removing modules');
    _.each(this._modules, function remMod(module) {
      UserAccounts.removeModule(module._id);
    });

    if (Meteor.isCLient) {
      delete Template.uaForm.__eventMaps['click .ua-link a'];
    }
  },
});
