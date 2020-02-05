var RuleEngine = require('../index');

var rules = [
    {
    "condition": function(R) {
      //  console.log(this.productId);
      //  console.log(this.userId);
        R.when(this.productId == "10" && this.userId == "xx1");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "productid and userid matched successfull";
        R.stop();
    }
},
{
    "condition": function(R) {
      //  console.log(this.productId);
      //  console.log(this.userId);
        R.when(this.productId != "10" && this.userId != "xx1");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "productid and userid not matched";
        R.stop();
    }
}


];
/* Creating Rule Engine instance and registering rule */
var R = new RuleEngine();
R.register(rules);

var fact = {
    "productId":"10",
    "userId":"xx1"
    };

R.execute(fact, function(data) {
  //  console.log(data)
    if (data.result) {
        console.log("Product share successfully");
    } else {
        console.log("Blocked Reason:" + data.reason);
    }
});

