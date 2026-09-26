import http from "node:http";
import { fileURLToPath } from "node:url";
import express from "express";
import { bootstrap } from "@mercuryworkshop/proxy-bootstrap";

const { routeRequest, routeUpgrade } = await bootstrap();
const app = express();
const publicDirectory = fileURLToPath(new URL("./public/", import.meta.url));

app.use((req, res, next) => {
  if (routeRequest(req, res)) return;
  next();
});
app.post("/api/reset", (_req, res) => {
  res.set({
    "Cache-Control": "no-store",
    "Clear-Site-Data": '"cache", "cookies", "storage"',
  });
  res.sendStatus(204);
});
app.use(express.static(publicDirectory));

const server = http.createServer(app);
server.on("upgrade", routeUpgrade);

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3030);

server.listen(port, host, () => {
  console.log(`Web Proxy is running at http://${host}:${port}`);
});