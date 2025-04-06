const fs = require("fs");
const path = require("path");

const historyFile = path.join(__dirname, "../data/history.json");

function getHistory(req, res, userId) {
  const all = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
  const userChats = all.filter(h => h.userId === userId);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(userChats));
}

function saveMessage(userId, message, reply) {
  const history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));

  history.push({
    id: Date.now(),
    userId,
    message,
    reply,
    time: new Date().toISOString(),
  });

  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

module.exports = { getHistory, saveMessage };