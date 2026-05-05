const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos
app.use(express.static(__dirname));

// Rota principal — procura index.html ou qualquer .html na pasta
app.get('*', (req, res) => {
  // Tenta index.html primeiro
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // Procura qualquer arquivo .html
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
  if (files.length > 0) {
    return res.sendFile(path.join(__dirname, files[0]));
  }
  res.send('CRM não encontrado. Verifique se o arquivo HTML está na pasta.');
});

app.listen(PORT, () => {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
  console.log(`CRM Grupo Alianca rodando na porta ${PORT}`);
  console.log(`Arquivo HTML: ${files[0] || 'não encontrado'}`);
});
