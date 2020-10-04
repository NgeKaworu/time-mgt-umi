import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Button, Input, Form, Spin, Empty } from "antd";

import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import TagMgt, { CusTag } from "@/components/TagMgt";

import type { RecordSchema } from "@/models/record";
import type { TagSchema } from "@/models/tag";
import type { ObjectId } from "@/utils/type";

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
  .cus-spin,
  .ant-spin-container
   {
    height: 100%;
  }

  .ant-spin{
    max-height: unset !important;
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
  :hover{
    border-bottom: 3px solid ${theme["primary-color"]};
  };

  .active,
  :active{
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

  console.log(list, tags);

  return (
    <BottomFixPanel>
      <CusFillScrollPart>
        <Spin spinning={loading} wrapperClassName="cus-spin">
          {list.length
            ? list.map((record: RecordSchema) => {
              return <RecordItem key={record._id.$oid}>
                <h3 style={{ color: "#333" }}>
                  {moment(record.createAt).format("YYYY-MM-DD HH:mm:ss")}
                </h3>
                <div className="content">
                  <div className="main">
                    {record.event}
                  </div>
                  <div className="extra">
                    {record.deration}
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
        </Spin>
      </CusFillScrollPart>
      <Form onFinish={console.log} form={form}>
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
              <Input placeholder="请记录做了什么"></Input>
            </Form.Item>
            <Button onClick={() => form.resetFields()}>取消</Button>
            <Button type="primary" htmlType="submit">记录</Button>
          </InputBar>
        </BottomFixPanel>
      </Form>
    </BottomFixPanel>
  );
};
