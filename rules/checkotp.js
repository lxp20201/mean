var rules = [
    {
      name: "Check the OTP not empty",
      priority: 1,
      on: true,
      condition: function(R) {
        R.when(this.otp == '');
      },
      consequence: function(R) {
        this.result = false;
        this.reason = "OTP Required";
        R.stop();
      }
    },
    {
      name: "Check the OTP with db",
      priority: 2,
      on: true,
      condition: function(R) {
        R.when(this.otp != this.otp_from_db);
      },
      consequence: function(R) {
        this.result = false;
        this.reason = "Invalid OTP";
        R.stop();
      }
    }
  ];
  
  module.exports = rules;
  