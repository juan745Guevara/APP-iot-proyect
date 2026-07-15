import { io, Socket } from "socket.io-client";
import { API_URL } from "./config";
import { getToken } from "./api/client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }
  return socket;
}

export async function connectSocket() {
  const token = await getToken();
  if (!token) return;
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
}
