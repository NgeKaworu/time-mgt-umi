import { ModalSchma } from '@/models/global';

import { RESTful } from '@/http';
import { message } from 'antd';
import moment from 'moment';

export interface RecordSchema {
  id: string;
  uid: string;
  tid?: string[];
  event: string;
  createAt: Date;
  updateAt: Date;
  deration: number;
}

export interface StatisticSchema {
  id: string;
  deration: number;
}

interface rootState {
  record: {
    list: RecordSchema[];
    limit: number;
    page: number;
  };
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
      return yield RESTful.post('/main/v1/record/create', { data: payload });
    },
    *delete({ payload }) {
      return yield RESTful.delete(`/main/v1/record/${payload}`);
    },
    *update({ payload }) {
      return yield RESTful.put('/main/v1/record/update', { data: payload });
    },
    *list({ params }, { put }) {
      const { data } = yield RESTful.get('/main/v1/record/list', {
        silence: 'success',
        params,
      });
      return yield put({ type: 'save', payload: { list: data } });
    },
    *nextPage(_, { select, put }) {
      const { list, limit, page } = yield select((store: rootState) => ({
        list: store.record.list,
        limit: store.record.limit,
        page: store.record.page,
      }));
      const { data } = yield RESTful.get('/main/v1/record/list', {
        params: {
          skip: page * limit,
          limit,
        },
        silence: 'success',
      });
      if (!data.length) {
        return message.warn({ content: '没有更多了' });
      }

      return yield put({
        type: 'save',
        payload: { list: list.concat(data), page: page + 1 },
      });
    },

    *statistic({ payload }, { put }) {
      const { data } = yield RESTful.post('/main/v1/record/statistic', {
        data: payload,
        silence: 'success',
      });
      return yield put({ type: 'save', payload: { statistic: data } });
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      history.listen(async ({ pathname }) => {
        try {
          if (pathname.includes('/record')) {
            await dispatch({
              type: 'list',
              params: {
                skip: 0,
                limit: 10,
              },
            });
          }
        } catch (e) {
          console.error('init list error', e);
        }
      });
      history.listen(async ({ pathname }) => {
        try {
          if (pathname.includes('/statistic')) {
            await dispatch({
              type: 'statistic',
              payload: {
                dateRange: [moment().startOf('day'), moment().endOf('day')],
              },
            });
          }
        } catch (e) {
          console.error('init statistic error', e);
        }
      });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
    },
  },
};

export default TagModal;
