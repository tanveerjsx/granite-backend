const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userService = require('../services/UserService');
const roleService = require('../services/roleService');
const UserModel = require('../models/user');
const authenticated = require('../middleware/authenticate');
const { generateToken, comparePassword } = require('../helpers/helper');
const { createVendorSchema, createAdminSchema } = require('../validationSchema/userSchema');

router.post('/', async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      return res.status(400).json({
        message: 'Email Already Exists',
      });
    }
    bcrypt.hash(req.body.password.toString(), 10, async (err, hash) => {
      try {
        if (err) {
          return res.status(400).json({
            error: 'Something went wrong',
          });
        }
        const role = await roleService.getRoleByName(req.body.role);
        if (!role)
          return res.status(401).json({
            success: false,
            message: 'invalid role',
          });

        if (role.name === 'vendor') {
          await createVendorSchema.validateAsync(req.body);
        }
        if (role.name === 'admin') {
          await createAdminSchema.validateAsync(req.body);
        }

        const newUser = new UserModel({
          ...req.body,
          password: hash,
          role: role._id,
          activate: false,
        });
        const createdUser = await userService.registerUser(newUser);
        res.status(201).json({
          success: true,
          user: createdUser,
        });
      } catch (error) {
        res.status(402).json({
          success: false,
          message: error.message,
        });
      }
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    if(!user.activate)res.status(404).json({message:"User not activate"})
    if (user) {
      const validUser = await comparePassword(req.body.password, user.password);
      if (!validUser) {
        return res.status(401).json({
          message: 'Invalid username/password',
        });
      }
      const token = await generateToken(user._id);
      if (!token) {
        res.status(500).json({
          message: 'error in generating token',
        });
      }
      const userRole = await roleService.getRoleById(user.role);
      res.status(200).json({
        message: {
          user: {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: userRole.name,
          },
          token,
        },
      });
    } else {
      res.status(400).json({
        message: "Email doesn't not exists",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
router.get('/activate/:id', authenticated, async (req, res) => {
  try {
    const user = await userService.findOneUser(req.params.id);
    if (!user) res.status(404).json({ message: 'user not found' });
    user.activate = !user.activate;
    const changeUpdate = await userService.registerUser(user);
    res.status(200).json({
      message: 'data updated',
      data: changeUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { vendor, user } = req.query;
    const users = await userService.findAll();
    if (vendor) {
      const role = await roleService.getRoleByName('vendor');
      const vendors = await userService.getAllVendors(role._id);
      return res.send(vendors);
    }
    if (user) {
      const role = await roleService.getRoleByName('user');
      const usersResult = await userService.getAllUsers(role._id);
      return res.send(usersResult);
    }
    return res.send(users);
  } catch (error) {
    res.status(500);
  }
});
router.get('/:verdorId', async (req, res) => {
  try {
    const vendorsProducts = await userService.getVendor(req.params.verdorId);
    res.send(vendorsProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:userId', authenticated, async (req, res) => {
  try {
    const user = await userService.getUser(req.params.userId);
    let updatedUser = await UserModel.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          products: user.products,
          rating: user.rating,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          storeName: user.storeName,
          password: user.password,
          role: user.role,
          activate: !user.activate,
          storeAddress: user.storeAddress,
        },
      },
    );
    updatedUser = await userService.getUserUpdate(user._id);
    res.status(200).json({
      message: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ messsage: error.message });
  }
});

module.exports = router;
