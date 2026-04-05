export default async function handler(req, res) {
    const { host, user, pass } = req.query;

    if (!host || !user || !pass) {
        return res.status(400).json({ online: false });
    }

    try {
        const url = `${host}/player_api.php?username=${user}&password=${pass}`;

        const start = Date.now();

        const response = await fetch(url);
        const tempo = Date.now() - start;

        const data = await response.json();

        let statusReal = data?.user_info?.status || "Desconhecido";

        return res.status(200).json({
            online: response.ok,
            tempo,
            statusReal
        });

    } catch (e) {
        return res.status(200).json({
            online: false,
            tempo: null,
            statusReal: "Erro"
        });
    }
}
