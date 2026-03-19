const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const { io } = require("socket.io-client");
const { app } = require("../app");
const { setupSocket } = require("../socket");

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  setupSocket(server);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("health endpoint responds and is stable", async () => {
  const sample = [];
  for (let i = 0; i < 10; i += 1) {
    const start = Date.now();
    const response = await fetch(`${baseUrl}/api/health`);
    const json = await response.json();
    sample.push(Date.now() - start);
    assert.equal(response.status, 200);
    assert.equal(json.status, "ok");
  }
  const avg = sample.reduce((a, b) => a + b, 0) / sample.length;
  assert.ok(avg < 300);
});

test("protected route blocks unauthenticated access", async () => {
  const response = await fetch(`${baseUrl}/api/dashboard`);
  assert.equal(response.status, 401);
});

test("auth flow and dashboard work", async () => {
  const email = `test${Date.now()}@demo.com`;
  const register = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email, password: "strong123" })
  });
  assert.equal(register.status, 201);
  const regJson = await register.json();
  assert.ok(regJson.token);

  const dash = await fetch(`${baseUrl}/api/dashboard`, {
    headers: { Authorization: `Bearer ${regJson.token}` }
  });
  assert.equal(dash.status, 200);
  const dashJson = await dash.json();
  assert.ok(dashJson.user.xp >= 0);
});

test("socket health_check ack", async () => {
  const socket = io(baseUrl, {
    transports: ["websocket"],
    timeout: 5000
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("connect timeout")), 5000);
    socket.on("connect", () => {
      clearTimeout(timer);
      resolve();
    });
    socket.on("connect_error", reject);
  });

  const ack = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("ack timeout")), 5000);
    socket.emit("health_check", (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });

  assert.equal(ack.status, "ok");
  socket.close();
});

