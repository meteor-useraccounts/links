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
UALinkPlugin = function () {
  // Call the parent constructor
  UAPlugin.call(this);

  this._id = 'links';
};


// inherit UAPlugin
UALinkPlugin.prototype = new UAPlugin();

_.extend(UALinkPlugin.prototype, {
  // correct the constructor pointer because it points to UAModule
  constructor: UALinkPlugin,

  _clickCallbacks: [],

  _modules: [],

  configure: function(options) {
    UALog.trace('configure ' + this._id);
    // console.log(options);

    this.text = _.defaults(options.text || {}, this.text);
  },

  init: function() {
    UALog.trace('Creating signInLink module');

    var self = this;

    var signInLink = new UALinkModule(
      'signInLink',
      60,
      'sign-in-link',
      'signIn',
      {
        default: {
          prefix: 'If you already have an account',
          suffix: '',
          text: 'sign in',
        }
      }
    );

    UALog.trace('Creating signUpLink module');
    var signUpLink = new UALinkModule(
      'signUpLink',
      70,
      'signUp',
      'sign-up-link',
      {
        default: {
          prefix: 'Don\'t have an account?',
          suffix: '',
          text: 'Register',
        },
      }
    );

    self._modules.push(signInLink);
    self._modules.push(signUpLink);

    _.each(self._modules, function(module) {
      UserAccounts.registerModule(module);
    });

    if (Meteor.isClient) {
      Template.uaForm.events({
        'click .ua-link a': function(e){
          e.preventDefault();
          self.linkClick(this.instance, this.module);
        }
      });
    }
  },

  linkClick: function(uaTmpl, module) {
    var route = module.targetState;
    var callbacks = _.map(UserAccounts.links._clickCallbacks, function(cb) {
      return cb(uaTmpl, route);
    });
    var callback = _.find(callbacks, function(cb) {return cb;});
    if (callback) {
      callback();
    }
    else {
      uaTmpl.setState(module.targetState);
    }
  },

  onClick: function(callback) {
    check(callback, Function);
    this._clickCallbacks.push(callback);
  },

  uninit: function(){
    UALog.trace('Removing modules');
    _.each(this._modules, function(module) {
      UserAccounts.removeModule(module._id);
    });

    if (Meteor.isCLient) {
      delete Template.uaForm.__eventMaps['click .ua-link a'];
    }
  }
});
