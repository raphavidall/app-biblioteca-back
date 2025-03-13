
const express = require('express');
const { register, login, getProfile, forgotPassword, resetPassword } = require('../controllers/auth');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Registrar usuário
router.post('/register', register);

// Login de usuário
router.post('/login', login);

// Obter perfil do usuário autenticado
router.get('/profile', auth, getProfile);

// Rota para solicitar recuperação de senha
router.post('/forgot-password', forgotPassword);

// Rota para redefinir senha com token
router.post('/reset-password', resetPassword);

module.exports = router;
