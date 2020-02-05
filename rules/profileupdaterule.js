var RuleEngine = require('../index');
/* Set of Rules to be applied
First blocks a transaction if less than 500
Second blocks a debit card transaction.*/
/*Note that here we are not specifying which rule to apply first.
Rules will be applied as per their index in the array.
If you need to enforce priority manually, then see examples with prioritized rules */
var rules = [{
    "condition": function(R) {
        
        R.when(this.firstname.length=="0");
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = "First Name required ";
        R.stop();
    }
},{
    "condition": function(R) {
       
        R.when(this.lastname.length=="0");
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = "Last Name required";
        R.stop();
    }
},];


module.exports=rules
