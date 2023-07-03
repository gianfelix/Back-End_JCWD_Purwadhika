const http = require("http");
const PORT = 8000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/api" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write("This is vanilla Node JS API");
    res.end();
  }
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Routes Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
