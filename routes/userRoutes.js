const express = require('express');
const { register, login, getAllUsers } = require('../controllers/userController');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/all', getAllUsers);

module.exports = router;