import { Subscription, Effect, Reducer } from 'umi';

export interface ModalSchma {
    namespace?: string;
    state: Record<string, any>;
    effects: Record<string, Effect>;
    reducers: Record<string, Reducer>;
    subscriptions: Record<string, Subscription>;
  }


const Global: ModalSchma={
    state: {},
    effects: {},
    reducers: {},
    subscriptions: {
      setup({ history   }): void {
        // Subscribe history(url) change, trigger `load` action if pathname is `/`
        history.listen(({ pathname, search }): void => {
          console.log({ pathname });
          // if (typeof window.ga !== 'undefined') {
          //   // window.ga('send', 'pageview', pathname + search);
          // }
        });
      },
    },
  };

  export default  Global