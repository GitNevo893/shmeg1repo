// Simple WebRTC signaling server
// Used to exchange signaling messages between Raspberry Pi and Operator

const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

// Store connected clients
let clients = [];

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.push(ws);

  // Receive message from one client
  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Forward the message to all other clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });

  // Handle errors (important for stability)
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log(`Signaling server running on port ${PORT}`);
