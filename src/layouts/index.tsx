import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { ConfigProvider } from "antd";

import theme from "@/theme/";
import {
  FormOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router";

import zhCN from "antd/es/locale/zh_CN";

const queyClient = new QueryClient();
export const BottomFixPanel = styled.div`
    height:100%;
    display: flex;
    flex-direction: column;
`;

export const FillScrollPart = styled.section`
    height: 100%;
    flex: 1;
    overflow-y: scroll;
`;

const BottomMenu = styled.footer`
    height: 60px;
    border-top: 1px solid rgba(233,233,233, 05);
    display: flex;
    justify-content: space-around;
    
`;

interface MenuItemProps {
  active: boolean;
}

const MenuItem = styled.div<MenuItemProps>`
    .anticon {
        font-size: 28px;
    }
    font-size: 12px;
    flex:1;
    text-align:center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    opacity: ${(props: Record<string, any>) => props.active ? 1 : 0.9};
    color:${(props: Record<string, any>) =>
  props.active ? theme["primary-color"] : "#000"};
  cursor: pointer;
  :hover {
    color: ${theme["primary-color"]};
    opacity: 1;
  }
  :active {
      opacity: 0.5;
  }

`;

const menu = [
  { title: "记录", path: "/record/", icon: <FormOutlined /> },
  { title: "统计", path: "/statistic/", icon: <PieChartOutlined /> },
];

export default (props: PropsWithChildren<any>) => {
  const { pathname } = useLocation();
  const history = useHistory();
  return <QueryClientProvider client={queyClient}>
    <ConfigProvider locale={zhCN}>
      <BottomFixPanel>
        <FillScrollPart>
          {props.children}
        </FillScrollPart>
        <BottomMenu>
          {menu.map((i) =>
            <MenuItem
              key={i.path}
              active={i.path.includes(pathname)}
              onClick={() => history.push(i.path)}
            >
              {i.icon}
              {i.title}
            </MenuItem>
          )}
        </BottomMenu>
      </BottomFixPanel>
    </ConfigProvider>
  </QueryClientProvider>;
};
