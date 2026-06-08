# ⚡ PAINEL VIP PRO v3.0

> **Verificação REAL de contas IPTV com Proxy Node.js**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 🚀 O que mudou na v3.0?

| Recurso | v2.0 (Antiga) | v3.0 (Nova) |
|---------|---------------|-------------|
| **Verificação** | Só lia bloco de notas | ✅ Verificação REAL via API |
| **CORS** | Usava AllOrigins (falhava) | ✅ Proxy próprio Node.js |
| **Data Exp** | Data do bloco de notas (desatualizada) | ✅ Data REAL do servidor |
| **Status** | Sempre "ONLINE" | ✅ Status real (Ativo/Inativo) |
| **Ping** | Não tinha | ✅ Latência real em ms |
| **Conexões** | 0/1 fixo | ✅ Conexões ativas/máximas reais |
| **Layout** | Básico | ✅ Design premium com animações |
| **Terminal** | Simples | ✅ Terminal hacker estilo logs |

---

## 📁 Estrutura do Projeto

```
painel-vip-pro/
├── server.js              # Proxy Node.js (CORS bypass)
├── package.json           # Dependências
├── config.json            # Configurações
├── .env.example           # Variáveis de ambiente
├── .gitignore
├── README.md
└── public/
    └── index.html         # Frontend premium
```

---

## ⚡ Instalação Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/rafflores17-prog/Painel-Vip-2.0.git
cd Painel-Vip-2.0
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor
```bash
npm start
```

### 4. Acesse no navegador
```
http://localhost:3000
```

---

## 🔧 Deploy (Render/Railway/Vercel)

### Render.com (Recomendado - GRÁTIS)
1. Crie conta em [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Selecione seu repositório
4. Configurações:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Deploy!

### Railway.app
1. Crie conta em [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Adicione variável `PORT=3000`
4. Deploy automático!

---

## 📡 Como funciona o Proxy?

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │────▶│  Proxy Node  │────▶│ Servidor    │
│  (Browser)  │◄────│  (Seu VPS)   │◄────│ IPTV        │
└─────────────┘     └──────────────┘     └─────────────┘
      │                    │
      │  ❌ CORS bloqueia  │  ✅ Sem CORS!
      │  diretamente       │  Proxy faz a
      │                    │  requisição
```

**O proxy Node.js faz a requisição HTTP ao servidor IPTV e retorna os dados para o frontend sem problemas de CORS.**

---

## 🔌 Endpoints da API

### Verificar conta
```
GET /api/check?host=URL&user=USERNAME&pass=PASSWORD
```

**Resposta:**
```json
{
  "success": true,
  "online": true,
  "status": "ATIVO",
  "tempo_ms": 245,
  "user": "usuario123",
  "exp_date": "15/12/2026",
  "dias_restantes": "190 dias",
  "max_connections": 1,
  "active_connections": 0,
  "created_at": "01/01/2024",
  "server": {
    "url": "http://exemplo.com",
    "port": "80"
  }
}
```

### Verificar lista M3U
```
GET /api/m3u?host=URL&user=USERNAME&pass=PASSWORD
```

### Health Check
```
GET /api/health
```

---

## 🎨 Recursos do Frontend

- ✅ **Design Cyberpunk** com neon glow
- ✅ **Terminal hacker** com logs em tempo real
- ✅ **Animações de partículas** de fundo
- ✅ **Scanner animation** ao gerar conta
- ✅ **Status real-time** com indicador de ping
- ✅ **Fallback automático** se proxy falhar
- ✅ **100% responsivo** para mobile
- ✅ **Sem alerts** - feedback visual suave

---

## 🔐 Segurança

- Chave de acesso verificada via `config.json`
- Em produção, use backend para validação
- Nunca exponha credenciais no frontend
- O proxy não armazena dados de contas

---

## 📝 Changelog

### v3.0.0 (2026-06-07)
- Proxy Node.js completo com CORS bypass
- Verificação REAL de contas via API IPTV
- Layout premium renovado
- Terminal com logs detalhados
- Sistema de fallback automático
- Suporte a múltiplos formatos de lista

### v2.0.0
- Sistema base com parser de listas
- Interface inicial

---

## 👤 Autor

**ApkBugado** 
- Telegram: [@ApkBugado](https://t.me/ApkBugado)
- GitHub: [@rafflores17-prog](https://github.com/rafflores17-prog)

---

## 📄 Licença

MIT License - Livre para uso e modificação.

> ⚠️ **Aviso:** Este projeto é para fins educacionais. O uso de contas IPTV sem autorização pode violar termos de serviço.
