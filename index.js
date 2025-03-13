require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rotas = require("./src/routes/index");
const app = express();

app.use(cors());
app.use(express.json());

rotas(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
