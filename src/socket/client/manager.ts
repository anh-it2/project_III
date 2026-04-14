import { Manager, Socket } from "socket.io-client";

let manager: Manager | null = null;
//nsp and socket coresponse
let sockets = new Map<string, Socket>();

function getManager() {
  if (manager) return manager;

  manager = new Manager("http://localhost:3002", {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ["websocket", "polling"],
  });

  return manager;
}

export function getNamespaceSocket<S extends Socket>(
  nsp: string,
  auth: Record<string, unknown>,
): S {
  const existing = sockets.get(nsp);
  if (existing) return sockets.get(nsp) as S;

  const socket = getManager().socket(nsp, { auth });
  sockets.set(nsp, socket);

  return socket as S;
}

export function disposeAll() {
  sockets.forEach((socket) => socket.close());
  sockets.clear();
  manager = null;
}

export function connectManager() {
  const m = getManager();
  console.log("[manager] connectManager called, engine readyState =", m.engine?.readyState);
  m.on("open",  () => console.log("[manager] engine OPEN"));
  m.on("close", (reason) => console.log("[manager] engine CLOSE:", reason));
  m.on("error", (err) => console.log("[manager] engine ERROR:", err));
  m.on("reconnect_attempt", (n) => console.log("[manager] reconnect attempt", n));
  m.connect();
}
