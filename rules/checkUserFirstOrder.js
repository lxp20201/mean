var rules = [
    {
      condition: function(R) {
        if (this.check == true) {
          R.when(false);
        } else {
          R.when(true);
        }
      },
      consequence: function(R) {
        this.result = false;
        this.reason = "User Not present";
        R.stop(); //stop if matched. no need to process next rule.
      }
    }
  ];
  module.exports = rules;
  