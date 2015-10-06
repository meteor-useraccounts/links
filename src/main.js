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
UserAccounts.registerPlugin(new UALinkPlugin());
