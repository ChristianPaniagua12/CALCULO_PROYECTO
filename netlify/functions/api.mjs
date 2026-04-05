import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const store = getStore("maze-paint-data");
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

    function normalizeName(n) {
        return (n || "").trim().toLowerCase();
    }

    switch (action) {

        case "check_name": {
            var nameParam = url.searchParams.get("name") || "";
            var nameNorm = normalizeName(nameParam);
            var scores = await loadScores();
            var found = false;
            var playerData = null;
            for (var i = 0; i < scores.length; i++) {
                if (normalizeName(scores[i].name) === nameNorm) {
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
            var nameNorm = normalizeName(input.name);
            for (var i = 0; i < scores.length; i++) {
                if (normalizeName(scores[i].name) === nameNorm) {
                    return new Response(JSON.stringify({ error: "Ya jugaste", success: false }), { headers: headers });
                }
            }
            scores.push({
                name: input.name.trim().substring(0, 20),
                score: parseInt(input.score) || 0,
                time: parseInt(input.time) || 0,
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

        case "delete_name": {
            var nameParam = url.searchParams.get("name") || "";
            var nameNorm = normalizeName(nameParam);
            var scores = await loadScores();
            var filtered = scores.filter(function (e) { return normalizeName(e.name) !== nameNorm; });
            await saveScores(filtered);
            return new Response(JSON.stringify({ success: true }), { headers: headers });
        }

        default:
            return new Response(JSON.stringify({ error: "Accion invalida" }), { status: 400, headers: headers });
    }
};
