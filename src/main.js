/* global
    UserAccounts: false,
    UALog: false,
    UALinkPlugin: false
*/
'use strict';


// ------------------------------------------
//  Logs the start of execution for this file
// ------------------------------------------
UALog.trace('Loading main.js');


UALog.trace('Adding links plugin');
var links = new UALinkPlugin();
UserAccounts.registerPlugin(links);
