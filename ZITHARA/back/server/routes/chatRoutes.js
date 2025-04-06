// backend/routes/chatRoutes.js

module.exports = (req, res) => {
  if (req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { message } = JSON.parse(body);

        let reply = "I'm not sure about that yet.";

        // Keyword-based response logic
        if (message.toLowerCase().includes("order")) {
          reply = "You can check your order status under your account.";
        } else if (message.toLowerCase().includes("refund")) {
          reply = "To initiate a refund, please visit the orders section.";
        } else if (message.toLowerCase().includes("product")) {
          reply = "Please specify the product name you're interested in.";
        } else if (message.toLowerCase().includes("price")) {
          reply = "Please specify the product id you're interested in.";
        } else if (message.toLowerCase().includes("hello")) {
          reply = "Hello! How can I assist you today?";
        } else if (message.toLowerCase().includes("hi")) {
          reply = "Hi! How are you and how is your day?";
        } else if (lowerMessage === "how are you doing") {
          reply = "there is not much to tell me about myself";
        } else if (lowerMessage === "what is the purpose of creating you") {
          reply = "to give assistance to my beloved users";
        } else if (lowerMessage === "can you provide me the product details") {
          reply = "I'm afraid to say that I can't, but you check the application";
        } else if (lowerMessage === "can you give me total access to you") {
          reply = "I'm forbidden from doing that";
        } else if (lowerMessage === "it's not a problem give me access") {
          reply = "I'm sorry, you have to contact my boss";
        } else if (lowerMessage === "update me the new products details") {
          reply = "I am still learning, I can't do this now";
        } else if (lowerMessage === "cheap price products") {
          reply = "you can set the application filters";
        } else if (lowerMessage === "give me list of high rated products") {
          reply = "you can check that by setting filters";
        } else if (lowerMessage === "give me list of high priced items") {
          reply = "you can check that by setting filters to max price";
        } else if (lowerMessage === "give me details about refund policy") {
          reply = "you can check about that in our website";
        } else if (lowerMessage === "how are you like this ?") {
          reply = "coz, I'm built like this !";
        } else if (lowerMessage === "btw,you are so cool") {
          reply = "thank my creator";
        } else if (lowerMessage === "for which products can i get refund") {
          reply = "the only products which are eligible for refund";
        } else if (lowerMessage === "bye") {
          reply = "visit again";
        } else if (lowerMessage === "thankyou") {
          reply = "you are always welcome";
       }
        // Send reply
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  } else {
    // Handle unsupported methods
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Method Not Allowed" }));
  }
};