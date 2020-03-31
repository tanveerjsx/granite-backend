const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Role = require('../models/roles');
const authenticated = require('../middleware/authenticate');
const roleService = require('../services/roleService');

router.post('/', authenticated, async (req, res) => {
  const role = new Role({
    name: req.body.name,
  });
  try {
    const SavedRole = await roleService.createRole(role);
    res.status(201).json({
      message: SavedRole,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.get('/', authenticated, async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.send(roles);
    // res.status(304).json({
    //     message: roles
    // });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

module.exports = router;
