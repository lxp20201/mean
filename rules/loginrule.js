var RuleEngine = require('../index');
var rules = [{
    "condition": function(R) {
        R.when(this.mobile== "7277593672" && this.dob=='05-Aug-1995');
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "Login success";
        R.stop();
    }
},{
    "condition": function(R) {
      
        R.when(this.mobile =="7277593672" );
    },
    "consequence": function(R) {
        
        this.result = true;
        this.reason = "mobile  exit check dob";
        R.stop();//stop if matched. no need to process next rule.
    }
}, {
    "condition": function(R) {
        R.when(this.mobile!= "05-Aug-1995");
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = "mobile does not exit ?";
        R.stop();
    }
},];
module.exports=rules
