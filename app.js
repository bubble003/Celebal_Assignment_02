const http = require("http");
const fs = require("fs");
const path = require("path");


const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filePath = path.join(__dirname, url.pathname);


    if (req.method == "GET") {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        fs.writeFile(filePath, body, "utf8", (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error creating file");
          } else {
            res.writeHead(201, { "Content-Type": "text/plain" });
            res.end("File created");
          }
        });
      });
    } else if (req.method == "DELETE") {
      fs.unlink(filePath, (err) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("File not found");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("File deleted");
        }
      });
    } else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method not allowed");
    }
});

server.listen(3000, () => { console.log("Server is running on port 3000") });