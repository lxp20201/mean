var rules = [
  {
    name: "Check the age that grater then 18",
    priority: 1,
    on: true,
    condition: function(R) {
      R.when(this.age > 18);
    },
    consequence: function(R) {
      this.result = true;
      this.reason = "Valid Age they can login!";
      R.stop();
    }
  }
];

module.exports = rules;
