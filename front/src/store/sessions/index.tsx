import type { Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ISession } from "../../types/ISession";

type ISessionStore = {
  sessions: ISession[];
  playerName: string;
  socket?: Socket;
  currentSession?: ISession;
} & {
  updateSessions: (sessions: ISession[]) => void;
  setCurrentSession: (currentSession: ISession) => void;
  setPlayerName: (playerName: string) => void;
  createSession: (name: string) => void;
  joinSession: (sessionId: string, name: string) => void;
  exitSession: (sessionId: string, name: string) => void;
  deleteSession: (sessionId: string) => void;
  addEntry: (sessionId: string, entryName: string) => void;
  deleteEntry: (sessionId: string, id: string) => void;
  wheelASession: (sessionId: string) => void;
  setSocket: (socket: Socket) => void;
};

const useSessionStore = create<ISessionStore, [["zustand/persist", { playerName: string }]]>(
  persist(
    (set, get) => ({
      playerName: "",
      sessions: [] as ISession[],
      socket: undefined,

      updateSessions: (sessions: ISession[]) => set((oldStore) => ({ ...oldStore, sessions })),

      setSocket: (socket: Socket) => set((oldStore) => ({ ...oldStore, socket: socket })),

      setPlayerName: (playerName: string) => set((oldStore) => ({ ...oldStore, playerName })),

      setCurrentSession: (currentSession: ISession) => set((oldStore) => ({ ...oldStore, currentSession })),

      createSession: (name: string) => {
        const socket = get().socket;
        if (socket) {
          socket.emit("CreateSession", name);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      deleteSession: (sessionId: string) => {
        const socket = get().socket;
        if (socket) {
          socket.emit("DeleteSession", sessionId);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      joinSession: (sessionId: string, name: string): void => {
        const socket = get().socket;
        if (socket) {
          socket.emit("JoinSession", sessionId, name);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      exitSession: (sessionId: string, name: string): void => {
        const socket = get().socket;
        if (socket) {
          socket.emit("ExitSession", sessionId, name);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      addEntry: (sessionId: string, entryName: string): void => {
        const socket = get().socket;
        if (socket) {
          socket.emit("AddEntry", sessionId, entryName);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      deleteEntry: (sessionId: string, entryId: string): void => {
        const socket = get().socket;
        if (socket) {
          socket.emit("DeleteEntry", sessionId, entryId);
        } else {
          console.error("Socket is not initialized!");
        }
      },

      wheelASession: (sessionId: string): void => {
        const socket = get().socket;
        if (socket) {
          socket.emit("WheelASession", sessionId);
        } else {
          console.error("Socket is not initialized!");
        }
      },
    }),
    {
      name: "playerName-storage", // name of the item in the storage (must be unique)
      partialize: (sessionStore: ISessionStore) => ({
        playerName: sessionStore.playerName,
      }),
    },
  ),
);

export default useSessionStore;
