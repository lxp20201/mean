var rules = [
  {
    condition: function(R) {
      console.log(this);
      if (this.status == false) {
        R.when(true);
      } else {
        R.when(false);
      }
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "Item is not thr in his cart";
      R.stop(); //stop if matched. no need to process next rule.
    }
  }
];
module.exports = rules;
