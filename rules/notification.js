//var RuleEngine = require('../index');

var rules = [
    {
      condition: function (R) {
  
  
        if (this.status.length == 0) {
  
          R.when(true);
        } else {
          R.when(false);
        }
      },
      consequence: function (R) {
        this.result = false;
        this.reason = "Notification Meassage not found ";
        R.stop();
      }
    }
  ];
  module.exports = rules;
  





