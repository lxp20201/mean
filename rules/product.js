var rules = [
  {
    condition: function(R) {
      
     
      
      if (true == this.check ) {
       
        R.when(false);
      } else {
        R.when(true);
      }
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "Store id  and category id is not valid ";
      R.stop();
    }
  }
];
module.exports = rules;
