import React, { useState } from "react";

import { Form, Modal, Button, Input, ConfigProvider } from "antd";
import { getDvaApp } from "umi";
import { Provider } from "react-redux";
import { useSelector } from "dva";

import Execter from "@/js-sdk/web/react/components/Executer";
import type { PropsWithChildren } from "react";

import zhCN from "antd/es/locale/zh_CN";

interface rootState {
  loading: {
    global: boolean;
  };
}

interface inject extends PropsWithChildren<any> {
  executerInstance?: Execter;
}

export interface TagProp {
  onOk?: (
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
    formValues?: any,
    executerInstance?: Execter,
  ) => any;
  onCancel?: (
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
    executerInstance?: Execter,
  ) => any;
  modalProps?: Record<string, any>;
  formProps?: Record<string, any>;
}

function TagExu(options: inject & TagProp) {
  const {
    onOk = () => {},
    onCancel = () => {},
    executerInstance,
    modalProps,
    formProps,
  } = options || {};
  const { loading: { global } } = useSelector((s: rootState) => ({
    loading: s.loading,
  }));

  const [form] = Form.useForm();
  const { validateFields } = form;

  async function submitHandler(
    e?: React.MouseEvent<HTMLElement, MouseEvent>,
    formValues?: any,
  ) {
    try {
      const value = formValues || await validateFields();
      await onOk(value, e, executerInstance);
      executerInstance?.Update({ modalProps: { visble: false } }).Show();
    } catch (e) {
      console.error(e);
    }
  }

  return <Modal
    confirmLoading={global}
    onCancel={async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      try {
        await onCancel(e, executerInstance);
        executerInstance?.Update({ modalProps: { visble: false } }).Show();
      } catch (e) {
        console.error(e);
      }
    }}
    onOk={submitHandler}
    {...modalProps}
  >
    <Form
      form={form}
      onFinish={(formValues) => submitHandler(undefined, formValues)}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      {...formProps}
    >
      <Form.Item
        name="name"
        rules={[
          { required: true, message: "标签名不能为空" },
        ]}
      >
        <Input
          placeholder="标签名"
          allowClear
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" style={{ display: "none" }}>
          提交
        </Button>,
      </Form.Item>
    </Form>
  </Modal>;
}

const Execiztion = (options?: TagProp) => {
  const { _store: store } = getDvaApp();
  return new Execter((execterProp: inject) => {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <TagExu {...execterProp} {...options} />
        </Provider>
      </ConfigProvider>
    );
  });
};

export default Execiztion;
