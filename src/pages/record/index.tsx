import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInfiniteQuery, useQueryClient } from "react-query";

import styled from "styled-components";

import { Button, Empty, Form, Input, message, Spin } from "antd";

import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import TagMgt, { CusTag } from "@/components/TagMgt";

import type { RecordSchema } from "@/models/record";
import type { TagSchema } from "@/models/tag";

import OnReachBottom from "@/js-sdk/native/onReachBottom";

import { nsFormat } from "@/utils/goTime";

import theme from "@/theme";
import moment from "moment";

import { RESTful } from "@/http/";

interface rootState {
  tag: {
    list: TagSchema[];
  };
  loading: {
    models: { record: boolean };
  };
}

const InputBar = styled.div`
  display: flex;
  width: 100%;
`;

const CusFillScrollPart = styled(FillScrollPart)`
  background: #eee;
  position: relative;
  .cus-spin,
  .ant-spin-container
   {
    height: 100%;
  }

  .ant-spin{
    position: absolute;
    width: 100%;
    top: 50%;
  }
`;

const CusEmpty = styled(Empty)`
  height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
`;

const RecordItem = styled.div`
  margin: 8px 12px;
  padding: 10px 16px;
  background: rgba(255,255,255, 0.85);
  box-shadow: 1px 1px 20px 1px rgba(233,233,233,0.85);
  cursor: pointer;

  &.active,
  :hover {
    border-bottom: 3px solid ${theme["primary-color"]};
  };

  :active {
    background: #fff;
    opacity: 0.85;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .main {
    font-size: 20px;
    font-weight: bold;
  }

  .extra {
    font-size: 16px;
    font-weight: 100;
  }
`;

export default () => {
  const [form] = Form.useForm();
  const { loading, tags } = useSelector((s: rootState) => ({
    loading: s.loading.models.record,
    tags: s.tag.list,
  }));
  const dispatch = useDispatch();

  const [curId, setCurId] = useState("");

  const last = useRef(0);
  const timer = useRef(0);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery("records", ({ pageParam = 0 }) => {
    return RESTful.get("/main/v1/record/list", {
      silence: "success",
      params: {
        skip: pageParam * 10,
        limit: 10,
      },
    });
  }, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data?.length === 10 ? pages?.length : undefined;
    },
  });

  async function submit(values: any) {
    try {
      if (curId) {
        await dispatch(
          { type: "record/update", payload: { ...values, id: curId } },
        );
        setCurId("");
      } else {
        await dispatch(
          { type: "record/add", payload: values },
        );
      }

      queryClient.invalidateQueries("records");
      form.resetFields();
    } catch (e) {
      console.error("create err: ", e);
    }
  }

  async function checked(record: RecordSchema) {
    form.setFieldsValue(record);
    setCurId(record.id);
  }

  function cancel() {
    form.resetFields();
    setCurId("");
  }

  return (
    <BottomFixPanel>
      <CusFillScrollPart
        onScroll={(e: React.UIEvent<HTMLElement, UIEvent>) => {
          // Note:
          // If you want to access the event properties in an asynchronous way,
          // you should call event.persist() on the event.
          e.persist();
          // 触底
          const fn = OnReachBottom(
            () => {
              if (hasNextPage) {
                fetchNextPage();
              } else {
                message.warn({ content: "没有更多了" });
              }
            },
            30,
          );
          const now = Date.now();
          // 节流
          if (last.current && now < last.current + 300) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
              last.current = now;
              fn(e);
            });
          } else {
            last.current = now;
            fn(e);
          }
        }}
      >
        {data?.pages?.length
          ? data?.pages?.map((gorup) =>
            gorup?.data?.map((record: RecordSchema) => {
              return <RecordItem
                key={record.id}
                onClick={() => checked(record)}
                className={`${record.id === curId ? "active" : ""}`}
              >
                <h3 style={{ color: "#333" }}>
                  {moment(record.createAt).format("YYYY-MM-DD HH:mm:ss")}
                </h3>
                <div className="content">
                  <div className="main">
                    {record.event}
                  </div>
                  <div className="extra">
                    {nsFormat(record.deration)}
                  </div>
                </div>
                <div>
                  {record?.tid?.map((oid: string) => {
                    const findTag = tags.find((t: TagSchema) => t.id === oid);

                    return <CusTag
                      key={oid}
                      color={findTag?.color}
                    >
                      {findTag?.name}
                    </CusTag>;
                  })}
                </div>
              </RecordItem>;
            })
          )
          : <CusEmpty />}
        <Spin spinning={isFetching} wrapperClassName="cus-spin"></Spin>
      </CusFillScrollPart>
      <Form onFinish={submit} form={form}>
        <BottomFixPanel
          style={{
            height: "25vh",
            borderTop: "1px solid rgba(233,233,233, 05)",
            boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.1)",
          }}
        >
          <FillScrollPart
            style={{
              padding: "0 0 6px 6px",
            }}
          >
            <Form.Item
              style={{ marginBottom: 0 }}
              name="tid"
              rules={[
                { required: true, message: "请选一个标签" },
                { type: "array", min: 0, message: "请选一个标签" },
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
              rules={[
                { required: true, message: "请记录做了什么" },
              ]}
            >
              <Input placeholder="请记录做了什么" allowClear autoComplete="off">
              </Input>
            </Form.Item>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {curId ? "修改" : "记录"}
            </Button>
          </InputBar>
        </BottomFixPanel>
      </Form>
    </BottomFixPanel>
  );
};
