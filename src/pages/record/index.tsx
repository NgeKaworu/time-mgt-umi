import React, { useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient, useQuery } from 'react-query';

import styled from 'styled-components';

import { Button, Empty, Form, Input, Spin } from 'antd';

import { BottomFixPanel, FillScrollPart } from '@/layouts/';
import TagMgt, { CusTag } from '@/components/TagMgt';

import type { RecordSchema } from '@/pages/record/models';
import type { TagSchema } from '@/components/TagMgt/models';

import { nsFormat } from '@/utils/goTime';

import theme from '@/theme';
import moment from 'moment';

import { restful as RESTful } from '@/js-sdk/utils/http';
import useTagList from '@/components/TagMgt/hooks/useTagList';
import { add, update } from './services';

const InputBar = styled.div`
  display: flex;
  width: 100%;
`;

const CusFillScrollPart = styled(FillScrollPart)`
  background: #eee;
  position: relative;
  .cus-spin,
  .ant-spin-container {
    height: 100%;
  }

  .ant-spin {
    position: absolute;
    top: 50%;
    width: 100%;
  }
`;

const CusEmpty = styled(Empty)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecordItem = styled.div`
  margin: 8px 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 1px 1px 20px 1px rgba(233, 233, 233, 0.85);
  cursor: pointer;

  &.active,
  :hover {
    border-bottom: 3px solid ${theme['primary-color']};
  }

  :active {
    background: #fff;
    opacity: 0.85;
  }

  .content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .main {
    font-weight: bold;
    font-size: 20px;
  }

  .extra {
    font-weight: 100;
    font-size: 16px;
  }
`;

export default () => {
  const [form] = Form.useForm();
  const { data: tags, isFetching: loading } = useTagList();

  const [curId, setCurId] = useState('');

  const last = useRef(0);
  const timer = useRef(0);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    'records',
    ({ pageParam = 0 }) => {
      return RESTful.get('time-mgt/v1/record/list', {
        notify: 'fail',
        params: {
          skip: pageParam * 10,
          limit: 10,
        },
      });
    },
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage?.data?.length === 10 ? pages?.length : undefined;
      },
    },
  );

  async function submit(values: any) {
    try {
      if (curId) {
        await add(values);
        setCurId('');
      } else {
        await update({ ...values, id: curId });
      }

      queryClient.invalidateQueries('records');
      form.resetFields();
    } catch (e) {
      console.error('create err: ', e);
    }
  }

  async function checked(record: RecordSchema) {
    form.setFieldsValue(record);
    setCurId(record.id);
  }

  function cancel() {
    form.resetFields();
    setCurId('');
  }

  return (
    <BottomFixPanel>
      {data?.pages?.length ? (
        data?.pages?.map((group) =>
          group?.data?.map((record: RecordSchema) => {
            return (
              <RecordItem
                key={record.id}
                onClick={() => checked(record)}
                className={`${record.id === curId ? 'active' : ''}`}
              >
                <h3 style={{ color: '#333' }}>
                  {moment(record.createAt).format('YYYY-MM-DD HH:mm:ss')}
                </h3>
                <div className="content">
                  <div className="main">{record.event}</div>
                  <div className="extra">{nsFormat(record.deration)}</div>
                </div>
                <div>
                  {record?.tid?.map((oid: string) => {
                    const findTag = tags.find((t: TagSchema) => t.id === oid);

                    return (
                      <CusTag key={oid} color={findTag?.color}>
                        {findTag?.name}
                      </CusTag>
                    );
                  })}
                </div>
              </RecordItem>
            );
          }),
        )
      ) : (
        <CusEmpty />
      )}
      <Spin spinning={isFetching} wrapperClassName="cus-spin"></Spin>

      <Form onFinish={submit} form={form}>
        <BottomFixPanel
          style={{
            height: '25vh',
            borderTop: '1px solid rgba(233,233,233, 05)',
            boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
          }}
        >
          <FillScrollPart
            style={{
              padding: '0 0 6px 6px',
            }}
          >
            <Form.Item
              style={{ marginBottom: 0 }}
              name="tid"
              rules={[
                { required: true, message: '请选一个标签' },
                { type: 'array', min: 0, message: '请选一个标签' },
              ]}
            >
              <TagMgt />
            </Form.Item>
          </FillScrollPart>

          <InputBar>
            <Form.Item
              style={{
                marginBottom: 0,
                flex: 1,
              }}
              name="event"
            >
              <Input placeholder="请记录做了什么" allowClear autoComplete="off"></Input>
            </Form.Item>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {curId ? '修改' : '记录'}
            </Button>
          </InputBar>
        </BottomFixPanel>
      </Form>
    </BottomFixPanel>
  );
};
