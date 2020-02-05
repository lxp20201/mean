var rules = [
    {
      condition: function(R) {
        console.log(this);
        if (this.status == 0) {
          R.when(true);
        } else {
          R.when(false);
        }
      },
      consequence: function(R) {
        this.result = false;
        this.reason = "No file found";
        R.stop(); 
      }
    }
  ];
  module.exports = rules;
