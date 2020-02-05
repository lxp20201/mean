
var rulesviewcart = [
    
    {
     "name": "Check View the product in the cart",
     "priority": 1,
     "on": true,
    "condition": function(R) {
       R.when(this.orderId == "001" && this.productId == "10");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "View Cart sucessfully";
        R.stop();
    }
},
{
    "name": "Check ProductId and orderId is matched",
     "priority": 2,
     "on": true,
    "condition": function(R) {
        R.when(this.orderId != "001" && this.productId != "10");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "orderId and productId not matched";
        R.stop();
    }
},
{
    "name": "Check Product commission is present or not",
     "priority": 3,
     "on": true,
    "condition": function(R) {
        R.when(this.productId == "001" && this.productcommission != "10");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "productId Exists but provide product commission price";
        R.stop();
    }
},
{
    "name": "Check Shipping charge calculation",
    "priority": 4,
    "on": true,
    "condition": function(R) {
       R.when(this.price <= "250");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "Shipping charge is 50rs";
        R.stop();
    }
},
{ 
    "name": "Check Shipping charge calculation",
    "priority": 5,
    "on": true,
    "condition": function(R) {
        R.when(this.price > "250");
     },
     "consequence": function(R) {
         this.result = true;
         this.reason = "There is no shipping charges";
         R.stop();
     }
}];

module.exports = rulesviewcart;
