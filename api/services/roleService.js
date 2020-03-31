const Role = require('../models/roles');
const createRole = role => {
  return role.save();
};
const getRoleByName = roleName => {
  return Role.findOne({ name: roleName }).exec();
};
const getRoleById = _id => {
  return Role.findOne({ _id });
};
const getAllRoles = () => {
  return Role.find({});
};
const roleService = {
  createRole,
  getRoleByName,
  getRoleById,
  getAllRoles,
};
module.exports = roleService;
