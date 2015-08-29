/* global
    UALinkModule: true,
    UALog: false,
    UAModule: false
*/
'use strict';


// ------------------------------------------
//  Logs the start of execution for this file
// ------------------------------------------
UALog.trace('Loading link_module.js');

// define the UALinkModule class
UALinkModule = function (_id, position, templateClass, targetState, texts) {
  // Call the parent constructor
  UAModule.call(this);

  this._id = _id;
  this.position = position;
  this.template = 'uaLink';
  this.templateClass = templateClass;
  this.targetState = targetState;
  this.texts = texts;
};


// inherit UAModule
UALinkModule.prototype = new UAModule();


_.extend(UALinkModule.prototype, {
  // correct the constructor pointer because it points to UAModule
  constructor: UALinkModule,

  configure: function(options) {
    UALog.trace('configure ' + this._id);
    // console.log(options);

    this.text = _.defaults(options.text || {}, this.text);
  },

  prefix: function() {
    return this.getText('prefix');
  },

  suffix: function() {
    return this.getText('suffix');
  },

  linkUrl: function() {
    return '#';
  },

  linkText: function() {
    return this.getText('text');
  },

  disabled: function() {
    return '';
  },
});
