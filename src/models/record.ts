import { ModalSchma } from "@/models/global";
import { ObjectId } from "@/utils/type";
import { RESTful } from "@/http";

export interface RecordSchema {
  _id: ObjectId;
  uid: ObjectId;
  tid?: ObjectId[];
  event: string;
  createAt: Date;
  updateAt: Date;
  deration: number;
}

export interface StatisticSchema {
  _id: ObjectId;
  deration: number;
}

const TagModal: ModalSchma = {
  state: {
    list: [],
    statistic: [],
    limit: 10,
    page: 1,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *add({ payload }) {
      return yield RESTful.post("/main/v1/record/create", { data: payload });
    },
    *delete({ payload }) {
      return yield RESTful.delete(`/main/v1/record/${payload}`);
    },
    *update({ payload }) {
      return yield RESTful.put("/main/v1/record/update", { data: payload });
    },
    *list(_, { put }) {
      const { data } = yield RESTful.get(
        "/main/v1/record/list",
        { silence: "success" },
      );
      return yield put({ type: "save", payload: { list: data } });
    },
    *statistic({ payload }, { put }) {
      const { data } = yield RESTful.post(
        "/main/v1/record/statistic",
        { data: payload, silence: "success" },
      );
      return yield put({ type: "save", payload: { statistic: data } });
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      history.listen(async ({ pathname }) => {
        try {
          if (pathname.includes("/record")) {
            await dispatch({ type: "list" });
          }
        } catch (e) {
          console.error("init list error", e);
        }
      });
      history.listen(async ({ pathname }) => {
        try {
          if (pathname.includes("/statistic")) {
            await dispatch({ type: "statistic" });
          }
        } catch (e) {
          console.error("init statistic error", e);
        }
      });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
    },
  },
};

export default TagModal;
