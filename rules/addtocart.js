var rulesaddcart = [{
        "name": "check minquantity and maxquantity",
        "priority": 1,
        "on": true,
        "condition": function(R) {
            console.log(this.minquantity.length)
            R.when(this.minquantity.length > "1" && this.maxquantity.length < "10");
        },
        "consequence": function(R) {
            this.result = true;
            this.reason = "Min and Max quantity check is successfull";
            R.stop();
        }
    },{
        "name": "check minquantity length",
        "priority": 2,
        "on": true,
        "condition": function(R) {
            console.log(this.minquantity.length)
            R.when(this.minquantity.length < "1");
        },
        "consequence": function(R) {
            this.result = true;
            this.reason = "Please check Min quantity fails";
            R.stop();
        }
    }];
    module.exports = rulesaddcart;



