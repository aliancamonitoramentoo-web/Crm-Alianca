const express = require('express');
const path    = require('path');
const https   = require('https');
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(express.json({limit:'10mb'}));
app.use(express.static(path.join(__dirname)));

// ── Banco de dados em memória para leads do Estrategista IA ──
const leadsEstrategista = [];

// ── Rota para receber leads do Estrategista IA ──────────────
app.post('/api/leads-estrategista', (req, res) => {
  const { name, email, createdAt } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nome e email obrigatórios.' });

  const lead = {
    id: 'lead_' + Date.now(),
    name,
    email,
    origem: 'Estrategista IA',
    createdAt: createdAt || new Date().toISOString(),
    receivedAt: new Date().toISOString()
  };

  leadsEstrategista.unshift(lead);
  console.log('Novo lead recebido do Estrategista IA:', name, email);
  res.json({ ok: true, lead });
});

// ── Rota para listar leads do Estrategista IA ───────────────
app.get('/api/leads-estrategista', (req, res) => {
  res.json(leadsEstrategista);
});

// ── Proxy JSONBin — evita CORS ──────────────────
app.get('/jb/:bin', (req,res)=>{
  const key = req.headers['x-jb-key'];
  const bin = req.params.bin;
  if(!key||!bin) return res.status(400).json({error:'missing key or bin'});
  const options={
    hostname:'api.jsonbin.io',
    path:`/v3/b/${bin}/latest`,
    method:'GET',
    headers:{'X-Master-Key':key,'Content-Type':'application/json'}
  };
  const r=https.request(options,resp=>{
    let data='';
    resp.on('data',c=>data+=c);
    resp.on('end',()=>{ try{ res.status(resp.statusCode).json(JSON.parse(data)); }catch(e){ res.status(500).json({error:e.message}); } });
  });
  r.on('error',e=>res.status(500).json({error:e.message}));
  r.end();
});

app.put('/jb/:bin', (req,res)=>{
  const key = req.headers['x-jb-key'];
  const bin = req.params.bin;
  if(!key||!bin) return res.status(400).json({error:'missing key or bin'});
  const body = JSON.stringify(req.body);
  const options={
    hostname:'api.jsonbin.io',
    path:`/v3/b/${bin}`,
    method:'PUT',
    headers:{'X-Master-Key':key,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}
  };
  const r=https.request(options,resp=>{
    let data='';
    resp.on('data',c=>data+=c);
    resp.on('end',()=>{ try{ res.status(resp.statusCode).json(JSON.parse(data)); }catch(e){ res.status(500).json({error:e.message}); } });
  });
  r.on('error',e=>res.status(500).json({error:e.message}));
  r.write(body);
  r.end();
});

// Rota principal
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT,()=>console.log('CRM Grupo Alianca porta '+PORT));
