import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import TagExec from "./TagExec";

const CusTag = styled(Tag)`
    margin-top: 6px;
`;

export default function TagMgt() {
  // const {} = useSelector(() => {});
  const tagExec = TagExec();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    return () => {
      tagExec.Destroy();
    };
  });

  // 新建标签
  async function create(formValues?: any) {
    try {
      const { color: { hex }, ...restValues } = formValues;
      tagExec?.Update({
        modalProps: {
          confirmLoading: true,
        },
      }).Execute();
      await dispatch({
        type: "tag/add",
        payload: {
          color: hex,
          ...restValues,
        },
      });
      await dispatch({ type: "tag/list" });
      tagExec?.Update({
        modalProps: {
          visible: false,
        },
      }).Execute();
    } catch (e) {
      console.error(e);
    } finally {
      tagExec?.Update({
        modalProps: {
          confirmLoading: false,
        },
      }).Execute();
    }
  }

  // 打开新建弹窗
  function openCreateExec() {
    tagExec.Update({
      modalProps: {
        visible: true,
        title: "新建标签",
      },
      onOk: create,
      onCancel: closeExec,
    }).Execute();
  }

  // 关闭弹窗
  function closeExec() {
    tagExec.Update({
      modalProps: {
        visible: false,
      },
    }).Execute();
  }

  return <div>
    <CusTag
      style={{ borderStyle: "dashed", background: "#fff" }}
      onClick={openCreateExec}
    >
      <PlusOutlined /> 新增标签
    </CusTag>
    <CusTag color="purple">purple</CusTag>
  </div>;
}
