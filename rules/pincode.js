var rules = [
  {
    condition: function(R) {
      if (this.status == false) {
        R.when(true);
      } else {
        R.when(false);
      }
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "The transaction was blocked as it was in valid pincode";
      R.stop(); //stop if matched. no need to process next rule.
    }
  }
];
module.exports = rules;
