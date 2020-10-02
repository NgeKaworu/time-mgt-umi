import React, { useLayoutEffect } from "react";
import { Button, Input, message, Tag } from "antd";
import styled from "styled-components";
import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import { PlusOutlined } from "@ant-design/icons";
import TagExu from "./components/TagExc";

const CusTag = styled(Tag)`
  margin-top: 6px;
`;

const InputBar = styled.div`
  display: flex;
  width: 100%;
`;

export default () => {
  const tagExu = TagExu();

  useLayoutEffect(() => {
    return () => {
      tagExu.Destroy();
    };
  }, []);
  return (
    <BottomFixPanel>
      <FillScrollPart>Page index</FillScrollPart>
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
          <CusTag
            style={{ borderStyle: "dashed", background: "#fff" }}
            onClick={() => {
              tagExu.Update({
                modalProps: { visible: true, title: "新建标签" },
              }).Show();
            }}
          >
            <PlusOutlined /> 新增标签
          </CusTag>
          <CusTag color="#ddd">magenta</CusTag>
          <CusTag color="red">red</CusTag>
          <CusTag color="volcano">volcano</CusTag>
          <CusTag color="orange">orange</CusTag>
          <CusTag color="gold">gold</CusTag>
          <CusTag color="lime">lime</CusTag>
          <CusTag color="green">green</CusTag>
          <CusTag color="cyan">cyan</CusTag>
          <CusTag color="blue">blue</CusTag>
          <CusTag color="geekblue">geekblue</CusTag>
          <CusTag color="purple">purple</CusTag>
          <CusTag color="magenta">magenta</CusTag>
          <CusTag color="red">red</CusTag>
          <CusTag color="volcano">volcano</CusTag>
          <CusTag color="orange">orange</CusTag>
          <CusTag color="gold">gold</CusTag>
          <CusTag color="lime">lime</CusTag>
          <CusTag color="green">green</CusTag>
          <CusTag color="cyan">cyan</CusTag>
          <CusTag color="blue">blue</CusTag>
          <CusTag color="geekblue">geekblue</CusTag>
          <CusTag color="purple">purple</CusTag>
        </FillScrollPart>
        <InputBar>
          <Input placeholder="内容"></Input>
          <Button>取消</Button>
          <Button type="primary">记录</Button>
        </InputBar>
      </BottomFixPanel>
    </BottomFixPanel>
  );
};
