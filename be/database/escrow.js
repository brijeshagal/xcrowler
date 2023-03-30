  const mongoose = require("mongoose");
const contractsSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  depositor: {
    type: String,
    required: true,
  },
  arbiter: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  beneficiary: {
    type: String,
    required: true,
  },
  txnHash: {
    type: String,
    required: true,
  },
  isApproved:{
    type: Boolean,
    required: true,
    default: false    
  }
});
module.exports = mongoose.model("contracts", contractsSchema);
