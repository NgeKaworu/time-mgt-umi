import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Button, Input, Form, Spin, Empty } from "antd";

import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import TagMgt, { CusTag } from "@/components/TagMgt";

import type { RecordSchema } from "@/models/record";
import type { TagSchema } from "@/models/tag";
import type { ObjectId } from "@/utils/type";

import Throttle from "@/js-sdk/native/throttle";
import OnReachBottom from "@/js-sdk/native/onReachBottom";

import theme from "@/theme";
import moment from "moment";

interface rootState {
  record: {
    list: RecordSchema[];
  };
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
  const { list, loading, tags } = useSelector((s: rootState) => ({
    list: s.record.list,
    loading: s.loading.models.record,
    tags: s.tag.list,
  }));
  const dispatch = useDispatch();

  const [curId, setCurId] = useState("");

  async function submit(values: any) {
    try {
      if (curId) {
        await dispatch(
          { type: "record/update", payload: { ...values, _id: curId } },
        );
        setCurId("");
      } else {
        await dispatch(
          { type: "record/add", payload: values },
        );
      }
      await dispatch({ type: "record/list" });
      form.resetFields();
    } catch (e) {
      console.error("create err: ", e);
    }
  }

  async function checked(record: RecordSchema) {
    form.setFieldsValue(
      { ...record, tid: record.tid?.map((t: ObjectId) => t.$oid) },
    );
    setCurId(record._id.$oid);
  }

  function cancel() {
    form.resetFields();
    setCurId("");
  }

  function msFormat(ms?: number): string | undefined {
    if (!ms) return;

    const HH = ~~(ms / (1000 * 60 * 60));
    const mm = ((ms % (1000 * 60 * 60)) / (1000 * 60)).toFixed(2);

    let str = "";

    if (HH) {
      str += `${HH}小时`;
    }

    if (mm) {
      str += `${mm}分钟`;
    }

    return str;
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
          OnReachBottom(
            // 节流
            Throttle(async () => {
              try {
                await dispatch({ type: "record/nextPage" });
              } catch (e) {
                console.error(e);
              }
            }, 2000),
          )(e, 200);
        }}
      >
        {list.length
          ? list.map((record: RecordSchema) => {
            return <RecordItem
              key={record._id.$oid}
              onClick={() => checked(record)}
              className={`${record._id.$oid === curId ? "active" : ""}`}
            >
              <h3 style={{ color: "#333" }}>
                {moment(record.createAt).format("YYYY-MM-DD HH:mm:ss")}
              </h3>
              <div className="content">
                <div className="main">
                  {record.event}
                </div>
                <div className="extra">
                  {msFormat(record.deration)}
                </div>
              </div>
              <div>
                {record?.tid?.map((tag: ObjectId) => {
                  const oid = tag.$oid;
                  const findTag = tags.find((t: TagSchema) =>
                    t._id.$oid === oid
                  );

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
          : <CusEmpty />}
        <Spin spinning={loading} wrapperClassName="cus-spin"></Spin>
      </CusFillScrollPart>
      <Form onFinish={submit} form={form}>
        <BottomFixPanel
          style={{
            height: "120px",
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
            <Button type="primary" htmlType="submit">
              {curId ? "修改" : "记录"}
            </Button>
          </InputBar>
        </BottomFixPanel>
      </Form>
    </BottomFixPanel>
  );
};
