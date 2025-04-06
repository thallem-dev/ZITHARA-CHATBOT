document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("send-btn");
    const input = document.getElementById("user-input");
  
    sendButton.addEventListener("click", sendMessage);
  
    async function sendMessage() {
      const message = input.value.trim();
  
      if (!message) return;
  
      addMessage(message, "user");
      input.value = "Thinking...";
  
      appendTyping();
  
      try {
        const response = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        });
  
        const data = await response.json();
        removeTyping();
        addMessage(data.reply || "Sorry, I didn't get that.", "bot");
      } catch (error) {
        removeTyping();
        addMessage("Error: Could not connect to AI backend.", "bot");
        console.error(error);
      }
  
      input.value = "";
    }
  
    function addMessage(text, sender) {
      const chatContainer = document.getElementById("chat-container");
      const msg = document.createElement("div");
      msg.classList.add("message", sender);
      msg.innerText = text;
      chatContainer.appendChild(msg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  
    function appendTyping() {
      const chatContainer = document.getElementById("chat-container");
      const typing = document.createElement("div");
      typing.id = "typing";
      typing.classList.add("message", "bot");
      typing.innerText = "Typing...";
      chatContainer.appendChild(typing);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  
    function removeTyping() {
      const typing = document.getElementById("typing");
      if (typing) typing.remove();
    }
  
    window.toggleTheme = function () {
      document.body.classList.toggle("dark-mode");
    };
  });