import { createStore } from "zustand/vanilla";

export type User = {
  kode_pegawai: string;
  name: string;
  email: string;
  img_profile: string;
};

export type UserActions = {
  setUser: (user: User) => void;
  clearUser: () => void;
};

export type UserStore = User & UserActions;

export const defaultUser: User = {
  kode_pegawai: "",
  name: "",
  email: "",
  img_profile: "",
};

export const createUserStore = createStore<UserStore>((set) => ({
  ...defaultUser,
  setUser: (user: User) => set(() => ({ ...user })),
  clearUser: () => set(() => ({ ...defaultUser })),
}));
