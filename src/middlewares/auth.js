
const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const auth = (req, res, next) => {
  // Obter token do header
  const token = req.header('x-auth-token');

  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({ msg: "Acesso negado. Token não fornecido." });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar usuário ao objeto de requisição
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token inválido" });
  }
};

// Middleware para verificar permissões baseadas em cargo
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Não autenticado" });
    }

    const { cargo } = req.user;
    
    if (!roles.includes(cargo)) {
      return res.status(403).json({ 
        msg: "Acesso negado. Você não tem permissão para acessar este recurso." 
      });
    }
    
    next();
  };
};

module.exports = {
  auth,
  checkRole
};
