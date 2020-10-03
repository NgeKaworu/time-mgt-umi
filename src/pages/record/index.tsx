import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Button, Input, Tag, Form, Alert } from "antd";

import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import TagMgt from "@/components/TagMgt";

const InputBar = styled.div`
  display: flex;
  width: 100%;
`;

interface rootState {
  loading: {
    models: { tag: boolean };
  };
}

export default () => {
  const [form] = Form.useForm();

  return (
    <BottomFixPanel>
      <FillScrollPart>Page index</FillScrollPart>
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
