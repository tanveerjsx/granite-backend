const BillingModel = require('../models/billingDetail');
const saveBill = bill => {
  const newBill = new BillingModel(bill);
  return newBill.save();
};
const BillingService = {
  saveBill,
};
module.exports = BillingService;
