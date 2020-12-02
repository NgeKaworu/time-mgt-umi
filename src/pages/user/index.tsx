import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UserSchema } from '@/models/user';
import { Form, Input, Button, Space, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface RootState {
  user: UserSchema;
  loading: {
    models: {
      user?: boolean;
    };
  };
}

const Wrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  vertical-align: middle;
  position: absolute;
  bottom: 16.8%;
`;

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    user: { name, email },
    isLoading,
  } = useSelector((state: RootState) => ({
    user: state.user,
    isLoading: state?.loading?.models?.user,
  }));

  const [flag, setFlag] = useState('login');

  const curStatus: string = useMemo(() => {
    if (email) {
      return 'logined';
    } else {
      return flag;
    }
  }, [flag, email]);

  const onFinish = async (values: UserSchema) => {
    try {
      await dispatch({ type: `user/${curStatus}`, payload: values });
      await dispatch({ type: 'user/profile' });
      history.push('/record');
    } catch (e) {
      console.error(e);
    }
  };

  const stateMap: Record<string, any> = {
    login: '登录',
    register: '注册',
    logined: '欢迎回来',
  };

  return (
    <Wrap>
      <h1>{stateMap[curStatus]}</h1>
      {curStatus === 'logined' ? (
        <Space direction="vertical" style={{ width: '61.8%' }}>
          <div>昵称：{name}</div>
          <div>邮箱：{email}</div>
          <Button
            block
            danger
            ghost
            onClick={() => {
              dispatch({ type: 'user/logout' });
            }}
          >
            退出登录
          </Button>
        </Space>
      ) : (
        <Form
          name="normal_login"
          onFinish={onFinish}
          style={{ width: '61.8%' }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="E-Mail" allowClear />
          </Form.Item>
          {curStatus === 'register' && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请填写昵称' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="nickname"
                allowClear
              />
            </Form.Item>
          )}
          <Form.Item
            name="pwd"
            rules={[
              { required: true, message: '密码不能为空' },
              { min: 8, message: '密码最短应为8位' },
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
            <Button loading={isLoading} type="primary" htmlType="submit">
              {stateMap[curStatus]}
            </Button>{' '}
            或{' '}
            <a
              onClick={() => {
                setFlag(f => (f === 'login' ? 'register' : 'login'));
              }}
            >
              {flag === 'login' ? '去注册' : '返回登录'}
            </a>
          </Form.Item>
        </Form>
      )}
      <Footer>
        <Space direction="vertical">
          东隅已逝，桑榆未晚。
          <div>
            <a href="https://www.douban.com/note/226926167/" target="_blank">
              柳比歇夫工作法
            </a>
            <Divider type="vertical" />
            <a
              href="https://furan.xyz/search/?s=柳比歇夫时间管理"
              target="_blank"
            >
              同步博客
            </a>
            <Divider type="vertical" />
            <a
              href="https://github.com/NgeKaworu/time-mgt-umi3"
              target="_blank"
            >
              源码
            </a>
          </div>
        </Space>
      </Footer>
    </Wrap>
  );
};
