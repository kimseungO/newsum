import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import https from "https";
import selfsigned from "selfsigned";

import newsRouter from "./routes/news.js";
import subscribeRouter from "./routes/subscribe.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 실행 환경 감지
const isKubernetes = process.env.KUBERNETES_SERVICE_HOST !== undefined;

let httpsOptions;

if (isKubernetes) {
  // ✅ K8s나 Docker 환경 (실제 인증서 mount)
  httpsOptions = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
  };
} else {
  // ✅ 로컬 개발 환경 (self-signed 인증서 자동 생성)
  const attrs = [{ name: "commonName", value: "localhost" }];
  const pems = selfsigned.generate(attrs, { days: 365 });
  httpsOptions = {
    key: pems.private,
    cert: pems.cert,
  };
}

// ✅ 기본 설정
app.use(cors());
app.use(express.json());
app.use("/api/news", newsRouter);
app.use("/api/subscribe", subscribeRouter);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ HTTPS 서버 실행
https.createServer(httpsOptions, app).listen(443, () => {
  const url = isKubernetes ? "https://newsum.click" : "https://localhost";
  console.log(`✅ HTTPS Server running on ${url}:443`);
});
