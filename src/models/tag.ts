import { ModalSchma } from "@/models/global";
import { ObjectId } from "@/utils/type";
import { RESTful } from "@/http";
export interface TagSchema {
  _id: ObjectId;
  name: string;
  color: string;
  createAt: Date;
  updateAt: Date;
}

const TagModal: ModalSchma = {
  state: {
    tags: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *add({ payload }) {
      return yield RESTful.post("/main/v1/tag/create", { data: payload });
    },
    *delete({ payload }) {
      return yield RESTful.delete(`/main/v1/tag/${payload}`);
    },
    *update({ payload }) {
      return yield RESTful.put("/main/v1/tag/update", { data: payload });
    },
    *list(_, { put }) {
      const { data } = yield RESTful.get(
        "/main/v1/tag/list",
        { silence: "success" },
      );
      return yield put({ type: "save", payload: { tags: data } });
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      history.listen(({ pathname }) => {
        if (["/record", "/statistic"].some((path) => pathname.includes(path))) {
          dispatch({ type: "list" });
        }
      });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
    },
  },
};

export default TagModal;
