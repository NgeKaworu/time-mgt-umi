import { ModalSchma } from '@/models/global';

import { restful as RESTful } from '@/http';
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
      return yield RESTful.post('time-mgt/v1/record/create', payload);
    },
    *delete({ payload }) {
      return yield RESTful.delete(`time-mgt/record/${payload}`);
    },
    *update({ payload }) {
      return yield RESTful.put('time-mgt/v1/record/update', payload);
    },
    *statistic({ payload }, { put }) {
      const { data } = yield RESTful.post('time-mgt/v1/record/statistic', payload, {

        notify: 'fail'
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
