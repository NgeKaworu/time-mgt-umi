import { ModalSchma } from "@/models/global";

import { RESTful } from "@/http";
export interface UserSchema {
  id?: string;
  name?: string;
  email?: string;
  createAt?: Date;
  pwd?: string;
}

const UserModal: ModalSchma = {
  state: {
    id: undefined,
    name: undefined,
    email: undefined,
    createAt: undefined,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *profile(_, { put }) {
      const { data } = yield RESTful.get(
        "/main/profile",
        { silence: "success" },
      );
      yield put({ type: "save", payload: data });
    },
    *login({ payload }) {
      const { data } = yield RESTful.post("/main/login", { data: payload });
      localStorage.setItem("token", data);
    },
    *register({ payload }) {
      const { data } = yield RESTful.post("/main/register", { data: payload });
      localStorage.setItem("token", data);
    },
    *logout(_, { put }) {
      yield put({
        type: "save",
        payload: {
          id: undefined,
          name: undefined,
          email: undefined,
          createAt: undefined,
        },
      });
      localStorage.clear();
      location.replace(`${window.routerBase}user`);
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      if (
        history.location.pathname.includes("/user") &&
        !localStorage.getItem("token")
      ) {
        return;
      }
      dispatch({ type: "profile" });
    },
  },
};

export default UserModal;
