import { ModalSchma } from '@/models/global';

import { restful as RESTful } from '@/http';
export interface TagSchema {
  id: string;
  name: string;
  color: string;
  createAt: Date;
  updateAt: Date;
}

const TagModal: ModalSchma = {
  state: {
    list: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *add({ payload }) {
      return yield RESTful.post('time-mgt/tag/create', payload);
    },
    *delete({ payload }) {
      return yield RESTful.delete(`time-mgt/tag/${payload}`);
    },
    *update({ payload }) {
      return yield RESTful.put('time-mgt/tag/update', payload);
    },
    *list(_, { put }) {
      const { data } = yield RESTful.get('time-mgt/tag/list', {
        notify: 'fail'
      });
      return yield put({ type: 'save', payload: { list: data } });
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      history.listen(async ({ pathname }) => {
        try {
          if (['/record', '/statistic'].some(path => pathname.includes(path))) {
            await dispatch({ type: 'list' });
          }
        } catch (e) {
          console.error(e);
        }
      });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
    },
  },
};

export default TagModal;
