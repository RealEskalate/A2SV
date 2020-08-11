const AccessControl = require('accesscontrol');

const ac = new AccessControl();    

module.exports = (function() {

    ac.grant('basic')
        .readOwn('profile')
        .updateOwn('profile')
      .grant('ephi_user')      
        .create('local_policy')
        .updateAny('local_policy')
        .deleteAny('local_policy')
      .grant("sysadmin")
        .readAny("comment")
      .grant("ephi_user")
        .create("invite_user")
        
    return ac;

})();