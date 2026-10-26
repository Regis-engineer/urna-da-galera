const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const ADMIN_PIN = process.env.ADMIN_PIN || "2468";

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true }));

let sessionId = crypto.randomBytes(4).toString("hex").toUpperCase();
let votes = { verdadeiro: 0, falso: 0 };
let voterIds = new Set();

function publicState() {
  const total = votes.verdadeiro + votes.falso;
  return {
    sessionId,
    votes: { ...votes },
    total,
    percentages: {
      verdadeiro: total ? Math.round((votes.verdadeiro / total) * 100) : 0,
      falso: total ? Math.round((votes.falso / total) * 100) : 0
    }
  };
}
function broadcastState() { io.emit("state", publicState()); }

io.on("connection", socket => {
  socket.emit("state", publicState());

  socket.on("vote", payload => {
    if (!payload || !["verdadeiro", "falso"].includes(payload.choice)) return;
    const voterId = String(payload.voterId || "");
    if (!/^[a-zA-Z0-9_-]{12,100}$/.test(voterId)) {
      socket.emit("vote-result", { ok: false, message: "Identificador de voto inválido." });
      return;
    }
    if (voterIds.has(voterId)) {
      socket.emit("vote-result", { ok: false, message: "Este aparelho já votou nesta rodada." });
      return;
    }
    voterIds.add(voterId);
    votes[payload.choice] += 1;
    socket.emit("vote-result", { ok: true, message: "Voto registrado! Obrigado por participar." });
    broadcastState();
  });

  socket.on("reset", payload => {
    if (!payload || String(payload.pin || "") !== ADMIN_PIN) {
      socket.emit("reset-result", { ok: false, message: "PIN incorreto. Só o organizador pode reiniciar." });
      return;
    }
    votes = { verdadeiro: 0, falso: 0 };
    voterIds = new Set();
    sessionId = crypto.randomBytes(4).toString("hex").toUpperCase();
    broadcastState();
    socket.emit("reset-result", { ok: true, message: "Nova votação iniciada!" });
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Urna da Galera rodando na porta ${PORT}`));
