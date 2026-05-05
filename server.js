const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

// Serve todos os arquivos estáticos da pasta (logo.png, etc)
app.use(express.static(path.join(__dirname)));

// Qualquer rota → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('CRM Grupo Alianca rodando na porta ' + PORT);
});
