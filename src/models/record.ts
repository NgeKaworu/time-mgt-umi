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
