var RuleEngine = require('../index');
/* Sample Rule to block a transaction if its below 500 */

      /*  var keys = Object.values(resJSON);
        var newObject = {}
        keys.map((val,i)=>newObject[list[i]]=val);
        callback(newObject);*/
        var rule = {
            "condition": function(R) {
                R.when(this.transactionTotal <= 100);
            },
            "consequence": function(R) {
                this.result = false;
                this.reason = "The shipping charge will apply less than 100";
                R.stop();
            }
        };
    
    var R = new RuleEngine();
            R.register(rule);
            /* Fact with less than 500 as transaction, and this should be blocked */
            var fact = {
                "name": "user4",
                "application": "MOB2",
                "transactionTotal": 50,
                "cardType": "Credit Card"
            };

            R.execute(fact, function(data) {    
                console.log(data)
                if (data.result) {
                    res.json({success:'true',message:'Free shipping'})
                } else {
                    res.json({success:'false',message:data.reason})
                }
            });

