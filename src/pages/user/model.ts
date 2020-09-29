import { ModalSchma } from "@/models/global";
import { ObjectId } from "@/utils/type";

export interface UserSchema {
  _id?: ObjectId;
  name?: string;
  email?: string;
  createAt?: Date;
  pwd?: string;
}

const UserModal: ModalSchma = {
  namespace: "user",
  state: {
    _id: undefined,
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
    *profile({ payload }, { put }) {
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      dispatch({ type: "profile" });
    },
  },
};

export default UserModal;
