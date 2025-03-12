
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

module.exports = {
  register,
  login,
  getProfile
};
