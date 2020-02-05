var rules = [
    {
        "condition": function(R) {
            R.when(this.customer_id == '');
        },
        "consequence": function(R) {
            this.result = false;
            this.reason = "customer_id is not present";
            R.stop();
        }
    },
    {
    "condition": function(R) {
        R.when(this.totalEarnings == '');
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = "earnings doesn't Exist";
        R.stop();
    }
},{
    "condition": function(R) {
        R.when(this.order_id == '');
    },
    "consequence": function(R) {
        this.result = false;
        this.reason = "order Id Doesn't Exist";
        R.stop();
    }
},
];

module.exports = rules;

