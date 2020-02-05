var rulestrainingvideo = [{
    "name": "check training video present or not",
    "on": true,
    "condition": function(R) {
        console.log(this.videourl)
        R.when(this.videourl == "https://www.youtube.com/");
    },
    "consequence": function(R) {
        this.result = true;
        this.reason = "Traning video is Available";
        R.stop();
    }
}];
module.exports = rulestrainingvideo;



