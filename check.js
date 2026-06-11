export default async function handler(req, res) {
    const { host, user, pass } = req.query;

    if (!host || !user || !pass) {
        return res.status(400).json({ online: false, erro: "Parametros incompletos" });
    }

    try {
        const url = `${host.replace(/\/$/, "")}/player_api.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}`;
        const start = Date.now();

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, { 
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        clearTimeout(timeout);

        const tempo = Date.now() - start;
        const data = await response.json();

        if (data.user_info) {
            const info = data.user_info;
            return res.status(200).json({
                online: true,
                tempo,
                statusReal: info.status || "Active",
                exp_date: info.exp_date && info.exp_date !== "null" ? parseInt(info.exp_date) : null,
                active_cons: parseInt(info.active_cons || 0),
                max_connections: parseInt(info.max_connections || 1),
                canais: data.categories ? data.categories.filter(c => c.category_type === "live").length : null,
                filmes: data.categories ? data.categories.filter(c => c.category_type === "movie").length : null,
                series: data.categories ? data.categories.filter(c => c.category_type === "series").length : null
            });
        }

        return res.status(200).json({ online: false, tempo, statusReal: "Offline" });

    } catch (e) {
        return res.status(200).json({ online: false, tempo: null, statusReal: "Erro", erro: e.message });
    }
}