const https = require("https");
require("dotenv").config();
const { saveMessage } = require("./historyController");

function askChatGPT(message, callback) {
  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }]
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ${process.env.OPENAI_API_KEY}'
    }
  };

  const req = https.request(options, (res) => {
    let responseBody = "";

    res.on("data", (chunk) => {
      responseBody += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(responseBody);
        const reply = result.choices?.[0]?.message?.content || "No reply.";
        callback(reply);
      } catch (err) {
        console.error("Error parsing OpenAI response:", err);
        callback("Error parsing AI response.");
      }
    });
  });

  req.on("error", (err) => {
    console.error("OpenAI API error:", err);
    callback("Error contacting AI assistant.");
  });

  req.write(data);
  req.end();
}

function chatHandler(req, res, body) {
  try {
    const { userId, message } = JSON.parse(body);

    askChatGPT(message, (reply) => {
      saveMessage(userId, message, reply);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ reply }));
    });
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid request body" }));
  }
}

module.exports = { chatHandler };