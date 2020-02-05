
 var rules = [

    {
        "name": "check category_id",
        "priority": 1,
        "on": true,
        "condition": function(R) {
            R.when(this.category_id == '');
        },
        "consequence": function(R) {
            this.result = false;
            this.reason = "category id is not present";
            R.stop();
        }
    },
    {
        "name": "check product_id",
        "priority": 1,
        "on": true,
        "condition": function(R) {
            R.when(this.product_id == '');
        },
        "consequence": function(R) {
            this.result = false;
            this.reason = "product id is not present";
            R.stop();
        }

    }  
]
module.exports = rules;