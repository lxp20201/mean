var rule = [{
    "name": "validate user details",
    "on": true,
    "condition": function(R) {
        console.log(this.videourl)
        R.when( this.firstName == undefined);
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "Name is not valid";
        R.stop();
    }
}];
module.exports = rule;



