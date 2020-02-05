var rules = [
  {
    condition: function(R) {
      R.when(this._id == "" || this._id == undefined);
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "customer_id is not present";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.name == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "name doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.mobile == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "mobile doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.pincode == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "pincode doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.address == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "address Id Doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.state == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "state Id Doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.district == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "district Id Doesn't Exist";
      R.stop();
    }
  },
  {
    condition: function(R) {
      R.when(this.village == "");
    },
    consequence: function(R) {
      this.result = false;
      this.reason = "village Id Doesn't Exist";
      R.stop();
    }
  }
];

module.exports = rules;
