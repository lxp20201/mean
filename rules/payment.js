var rules = [
    {
    "name": "check payment status",
    "priority": 1,
    "on": true,
    "condition": (R) => {
        
        R.when(this.transactionTotal < 500 );
    },
    "consequence": (R) => {
        this.result = false;
        this.reason = "The transaction was blocked as it was less than 500";
        R.stop();
    }
}
]

 
module.exports = rules;