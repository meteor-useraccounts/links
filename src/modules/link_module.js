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
UALinkModule = function _UALinkModule(
  _id,
  position,
  templateClass,
  targetState,
  texts
) {
  var self = this;

  UAModule.call(self);

  self._id = _id;
  self.position = position;
  self.template = 'uaLink';
  self.templateClass = templateClass;
  self.targetState = targetState;
  self.texts = texts;
  self.skins = {};
  self.visible = true;
};


// inherit UAModule
UALinkModule.prototype = new UAModule();


_.extend(UALinkModule.prototype, {
  // correct the constructor pointer because it points to UAModule
  constructor: UALinkModule,

  configure: function configure(options) {
    UALog.trace('configure ' + this._id);
    // console.log(options);

    this.text = _.defaults(options.text || {}, this.text);
  },

  prefix: function prefix() {
    return this.getText('prefix');
  },

  suffix: function suffix() {
    return this.getText('suffix');
  },

  linkUrl: function linkUrl() {
    return '#';
  },

  linkText: function linkText() {
    return this.getText('text');
  },

  disabled: function disabled() {
    return '';
  },
});
