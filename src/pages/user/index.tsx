import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { UserSchema } from "./model";
import { Form, Input, Button, Space } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

interface RootState {
  user: UserSchema;
}

const Wrap = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    name,
    email,
  } = useSelector((state: RootState) => state.user);

  const [flag, setFlag] = useState("login");

  const curStatus: string = useMemo(() => {
    if (email) {
      return "logined";
    } else {
      return flag;
    }
  }, [flag, email]);

  const onFinish = async (values: UserSchema) => {
    try {
      await dispatch({ type: `user/${curStatus}`, payload: values });
      await dispatch({ type: "user/profile" });
      history.push("/record");
    } catch (e) {
      console.error(e);
    }
  };

  const stateMap: Record<string, any> = {
    login: "登录",
    register: "注册",
    logined: "欢迎",
  };

  return (
    <Wrap>
      <h1>{stateMap[curStatus]}</h1>
      {curStatus === "logined"
        ? <Space direction="vertical" style={{ width: "61.8%" }}>
          <div>昵称：{name}</div>
          <div>邮箱：{email}</div>
          <Button
            block
            danger
            ghost
            onClick={() => {
              dispatch({ type: "user/logout" });
            }}
          >
            退出登录
          </Button>
        </Space>
        : <Form
          name="normal_login"
          onFinish={onFinish}
          style={{ width: "61.8%" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱地址" },
              { type: "email", message: "请输入正确的邮箱地址" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="E-Mail"
              allowClear
            />
          </Form.Item>
          {curStatus === "register" && <Form.Item
            name="name"
            rules={[
              { required: true, message: "请填写昵称" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="nickname"
              allowClear
            />
          </Form.Item>}
          <Form.Item
            name="pwd"
            rules={[
              { required: true, message: "密码不能为空" },
              { min: 8, message: "密码最短应为8位" },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              {stateMap[curStatus]}
            </Button> 或 <a
              onClick={() => {
                setFlag((f) => f === "login" ? "register" : "login");
              }}
            >
              {flag === "login" ? "去注册" : "返回登录"}
            </a>
          </Form.Item>
        </Form>}
    </Wrap>
  );
};
