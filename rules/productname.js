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
        this.reason = "Product is name is not exist ";
        R.stop();
      }
    }
  ];
  module.exports = rules;
  