var RuleEngine = require("../lib/node-rules");
/* Set of Rules to be applied
First blocks a transaction if less than 500
Second blocks a debit card transaction.*/
/*Note that here we are not specifying which rule to apply first.
Rules will be applied as per their index in the array.
If you need to enforce priority manually, then see examples with prioritized rules */
var rules = [
  {
    condition: function(R) {
      console.log(this.otp.length);
      R.when(this.otp.length != "4");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "otp fail to send ";
      R.stop();
    }
  },
  {
    condition: function(R) {
      console.log(this.otp.length);
      R.when(this.mobile.length != "10");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "mobile number wrong";
      R.stop();
    }
  }
];
module.exports = rules;
/* Creating Rule Engine instance and registering rule */
/*var R = new RuleEngine();
R.register(rules);
const otp = Math.floor(1000 + Math.random() * 9000);
var fact = {
    "mobile": "7277593672",
    "otp": otp
};

R.execute(fact, function(data) {
    console.log(data)
    if (data.result) {
        console.log("otp send success");
    } else {
        console.log("Blocked Reason:" + data.reason);
    }
});

*/
