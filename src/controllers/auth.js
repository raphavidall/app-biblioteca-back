
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Registrar novo usuário
const register = async (req, res) => {
  const { nome, username, password, cargo } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await Users.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    // Verificar se o cargo é válido
    const cargosValidos = ['aluno', 'professor', 'visitante', 'admin'];
    if (cargo && !cargosValidos.includes(cargo)) {
      return res.status(400).json({ msg: "Cargo inválido" });
    }

    // Criar novo usuário
    const user = await Users.create({
      nome,
      username,
      password,
      cargo: cargo || 'visitante'
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, cargo: user.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      msg: "Usuário registrado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        cargo: user.cargo
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ msg: "Erro ao registrar usuário", error: error.message });
  }
};

// Login de usuário
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, cargo: user.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      msg: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        cargo: user.cargo
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ msg: "Erro ao fazer login", error: error.message });
  }
};

// Obter perfil do usuário autenticado
const getProfile = async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ msg: "Erro ao buscar perfil", error: error.message });
  }
};

// Solicitar recuperação de senha
const forgotPassword = async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ msg: "Nome de usuário é obrigatório" });
  }

  try {
    // Verificar se o usuário existe
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Gerar token único de recuperação
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Armazenar o token e a data de expiração no banco de dados
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: Date.now() + 3600000 // 1 hora em milissegundos
    });

    // Em um sistema real, aqui enviaria um email com o link para redefinição
    // Para este exemplo, apenas retornamos o token na resposta
    res.json({ 
      msg: "Token de recuperação de senha gerado com sucesso", 
      resetToken,
      resetLink: `/reset-password?token=${resetToken}`
    });
  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    res.status(500).json({ msg: "Erro ao processar recuperação de senha", error: error.message });
  }
};

// Redefinir senha com token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ msg: "Token e nova senha são obrigatórios" });
  }

  try {
    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário pelo ID no token
    const user = await Users.findOne({ 
      where: { 
        id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Verificar se o token não expirou
      } 
    });

    if (!user) {
      return res.status(400).json({ msg: "Token inválido ou expirado" });
    }

    // Atualizar a senha e limpar os campos de recuperação
    await user.update({
      password: newPassword, // O hook beforeUpdate já vai criptografar
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    res.json({ msg: "Senha redefinida com sucesso" });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ msg: "Token inválido" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: "Token expirado" });
    }
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ msg: "Erro ao redefinir senha", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword
};
