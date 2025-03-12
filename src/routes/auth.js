
const express = require('express');
const { register, login, getProfile } = require('../controllers/auth');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Registrar usuário
router.post('/register', register);

// Login de usuário
router.post('/login', login);

// Obter perfil do usuário autenticado
router.get('/profile', auth, getProfile);

module.exports = router;
