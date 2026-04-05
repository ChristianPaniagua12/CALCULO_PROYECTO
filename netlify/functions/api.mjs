import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const store = getStore("maze-paint-data");
    const ip = context.ip || req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const headers = { "Content-Type": "application/json; charset=utf-8" };

    async function loadScores() {
        try {
            var data = await store.get("scores", { type: "json" });
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    async function saveScores(scores) {
        await store.setJSON("scores", scores);
    }

    switch (action) {

        case "check_ip": {
            var scores = await loadScores();
            var found = false;
            var playerData = null;
            for (var i = 0; i < scores.length; i++) {
                if (scores[i].ip === ip) {
                    found = true;
                    playerData = {
                        name: scores[i].name,
                        score: scores[i].score,
                        time: scores[i].time || null
                    };
                    break;
                }
            }
            return new Response(JSON.stringify({ played: found, data: playerData }), { headers: headers });
        }

        case "save_score": {
            var input;
            try {
                input = await req.json();
            } catch (e) {
                return new Response(JSON.stringify({ error: "Datos invalidos" }), { status: 400, headers: headers });
            }
            if (!input || !input.name || input.score === undefined) {
                return new Response(JSON.stringify({ error: "Datos faltantes" }), { status: 400, headers: headers });
            }
            var scores = await loadScores();
            for (var i = 0; i < scores.length; i++) {
                if (scores[i].ip === ip) {
                    return new Response(JSON.stringify({ error: "Ya jugaste", success: false }), { headers: headers });
                }
            }
            scores.push({
                name: input.name.trim().substring(0, 20),
                score: parseInt(input.score) || 0,
                time: parseInt(input.time) || 0,
                ip: ip,
                timestamp: Math.floor(Date.now() / 1000)
            });
            await saveScores(scores);
            return new Response(JSON.stringify({ success: true }), { headers: headers });
        }

        case "get_podium": {
            var scores = await loadScores();
            scores.sort(function (a, b) {
                if (b.score !== a.score) return b.score - a.score;
                return (a.time || Infinity) - (b.time || Infinity);
            });
            var podium = scores.slice(0, 3).map(function (e) {
                return { name: e.name, score: e.score, time: e.time || null };
            });
            return new Response(JSON.stringify({ podium: podium, total: scores.length }), { headers: headers });
        }

        case "delete_ip": {
            var scores = await loadScores();
            var filtered = scores.filter(function (e) { return e.ip !== ip; });
            await saveScores(filtered);
            return new Response(JSON.stringify({ success: true }), { headers: headers });
        }

        default:
            return new Response(JSON.stringify({ error: "Accion invalida" }), { status: 400, headers: headers });
    }
};
