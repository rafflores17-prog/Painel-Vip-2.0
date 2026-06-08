const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS liberado para todas as origens (necessário para o frontend)
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================
// PROXY IPTV - Verificação REAL da conta
// ============================================
app.get('/api/check', async (req, res) => {
    const { host, user, pass } = req.query;

    if (!host || !user || !pass) {
        return res.status(400).json({
            success: false,
            error: 'Parâmetros obrigatórios: host, user, pass'
        });
    }

    const url = `${host}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;

    try {
        const start = Date.now();
        const response = await axios.get(url, {
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            validateStatus: () => true // Não lançar erro em status != 200
        });
        const tempo = Date.now() - start;

        const data = response.data;

        // Verificar se a API retornou dados válidos
        if (data && data.user_info) {
            const info = data.user_info;
            const server_info = data.server_info || {};

            // Converter exp_date (timestamp) para data legível
            let expDate = 'Ilimitado';
            let expTimestamp = null;
            if (info.exp_date && info.exp_date !== 'null' && info.exp_date !== 'Unlimited') {
                expTimestamp = parseInt(info.exp_date) * 1000;
                const d = new Date(expTimestamp);
                expDate = d.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }

            // Status real
            const statusReal = info.status === 'Active' ? 'ATIVO' : 'INATIVO';
            const isOnline = info.status === 'Active';

            // Calcular dias restantes
            let diasRestantes = 'Ilimitado';
            if (expTimestamp) {
                const hoje = new Date();
                const diff = expTimestamp - hoje.getTime();
                const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
                diasRestantes = dias > 0 ? `${dias} dias` : 'EXPIRADO';
            }

            res.json({
                success: true,
                online: isOnline,
                status: statusReal,
                tempo_ms: tempo,
                user: info.username || user,
                password: pass,
                host: host,
                exp_date: expDate,
                exp_timestamp: info.exp_date,
                dias_restantes: diasRestantes,
                max_connections: info.max_connections || 1,
                active_connections: info.active_cons || 0,
                created_at: info.created_at ? new Date(parseInt(info.created_at) * 1000).toLocaleDateString('pt-BR') : 'N/A',
                trial: info.is_trial === '1' ? 'SIM' : 'NÃO',
                server: {
                    url: server_info.url || host,
                    port: server_info.port || '80',
                    https_port: server_info.https_port || 'N/A',
                    server_protocol: server_info.server_protocol || 'http',
                    rtmp_port: server_info.rtmp_port || 'N/A',
                    timezone: server_info.timezone || 'N/A'
                },
                raw: data // Dados brutos para debug
            });
        } else {
            // Servidor respondeu mas não retornou user_info válido
            res.json({
                success: false,
                online: false,
                status: 'INVÁLIDO',
                error: 'Conta não encontrada ou credenciais inválidas',
                tempo_ms: tempo,
                host,
                user
            });
        }

    } catch (error) {
        console.error('Erro no proxy:', error.message);
        res.json({
            success: false,
            online: false,
            status: 'ERRO',
            error: error.message.includes('timeout') ? 'Timeout - Servidor lento' : error.message,
            host,
            user
        });
    }
});

// ============================================
// PROXY M3U - Buscar lista de canais
// ============================================
app.get('/api/m3u', async (req, res) => {
    const { host, user, pass } = req.query;

    if (!host || !user || !pass) {
        return res.status(400).json({ success: false, error: 'Parâmetros faltando' });
    }

    const url = `${host}/get.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&type=m3u_plus&output=ts`;

    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18'
            },
            validateStatus: () => true
        });

        if (response.status === 200 && response.data) {
            // Contar canais na lista M3U
            const lines = response.data.split('\n');
            const canais = lines.filter(l => l.startsWith('#EXTINF')).length;
            const filmes = lines.filter(l => l.toLowerCase().includes('movie')).length;
            const series = lines.filter(l => l.toLowerCase().includes('series')).length;

            res.json({
                success: true,
                url: url,
                canais: canais,
                filmes: filmes,
                series: series,
                total: canais + filmes + series,
                size_kb: Math.round(response.data.length / 1024)
            });
        } else {
            res.json({
                success: false,
                error: `Status ${response.status} - Lista não disponível`
            });
        }
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// ROTA PADRÃO - Servir o frontend
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 PAINEL VIP PRO v3.0`);
    console.log(`📡 Proxy IPTV rodando em http://localhost:${PORT}`);
    console.log(`🔒 CORS: Liberado para todas as origens`);
    console.log(`⚡ Timeout: 8s para verificação`);
    console.log(`\n📋 Endpoints:`);
    console.log(`   GET /api/check?host=URL&user=USER&pass=PASS`);
    console.log(`   GET /api/m3u?host=URL&user=USER&pass=PASS`);
    console.log(`   GET /api/health`);
    console.log(`\n✅ Pronto para receber requisições!\n`);
});
