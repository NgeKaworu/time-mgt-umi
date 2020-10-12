import React, { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Checkbox, Modal, Spin, Tag } from "antd";
import { CheckCircleTwoTone, PlusOutlined } from "@ant-design/icons";

import TagExec from "./TagExec";
import type { TagSchema } from "@/models/tag";

import theme from "@/theme";

interface rootState {
  loading: {
    models: {
      tag: boolean;
    };
  };
  tag: {
    list: TagSchema[];
  };
}

interface TagMgtProps {
  value?: string[];
  onChange?: Function;
}

export const CusTag = styled(Tag)`
    margin-top: 6px !important;
`;

export default function TagMgt(props?: TagMgtProps) {
  const {
    value = [],
    onChange = () => {},
  } = props || {};

  const [checkAll, setCheckAll] = useState({
    checked: false,
    indeterminate: false,
  });

  const { list, loading } = useSelector((s: rootState) => ({
    list: s.tag.list,
    loading: s.loading.models.tag,
  }));

  const tagExec = TagExec();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    return () => {
      tagExec.Destroy();
    };
  });

  const holdHandler = useRef(0);

  function holdStart(callback: Function, critical = 3000) {
    holdHandler.current = setTimeout(callback, critical);
  }

  function holdEnd() {
    clearTimeout(holdHandler.current);
  }

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

  // 编辑标签
  async function edit(id: string, formValues?: any) {
    try {
      const { color: { hex }, ...restValues } = formValues;
      tagExec?.Update({
        modalProps: {
          confirmLoading: true,
        },
      }).Execute();
      await dispatch({
        type: "tag/update",
        payload: {
          id,
          color: hex || formValues?.color,
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

  // 删除标签
  async function remove(
    id: string,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) {
    e.preventDefault();
    Modal.confirm({
      title: "操作不可撤销",
      onOk: async () => {
        await dispatch({ type: "tag/delete", payload: id });
        await dispatch({ type: "tag/list" });
      },
    });
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

  // 打开编辑弹窗
  function openEditExec(tag: TagSchema) {
    tagExec.Update({
      modalProps: {
        visible: true,
        title: "编辑标签",
      },
      initVal: tag,
      onOk: (v) => edit(tag.id, v),
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

  return <Spin spinning={loading}>
    <div style={{ borderBottom: "1px solid #e9e9e9" }}>
      <Checkbox
        checked={checkAll.checked}
        indeterminate={checkAll.indeterminate}
        onChange={() => {
          if (list.length === value.length) {
            onChange([]);
            setCheckAll({
              checked: false,
              indeterminate: false,
            });
          } else {
            onChange(list.map((l) => l.id));
            setCheckAll({
              checked: true,
              indeterminate: false,
            });
          }
        }}
      >
        全选
      </Checkbox>
      <a
        onClick={() => {
          const inverse = list.reduce((acc: string[], cur: TagSchema) => {
            if (!value.includes(cur.id)) {
              return [...acc, cur.id];
            }
            return acc;
          }, []);
          onChange(inverse);
        }}
      >
        反选
      </a>
    </div>
    <CusTag
      style={{ borderStyle: "dashed", background: "#fff" }}
      onClick={openCreateExec}
    >
      <PlusOutlined /> 新增标签
    </CusTag>
    {list.map((tag: TagSchema) =>
      <CusTag
        onClick={() => {
          const id = tag.id;
          const temp = value.includes(id)
            ? value.filter((v: string) => v !== id)
            : value.concat(id);
          onChange(temp);
          if (temp.length > 0 && temp.length < list.length) {
            setCheckAll({
              checked: false,
              indeterminate: true,
            });
          }

          if (temp.length === list.length) {
            setCheckAll({
              checked: true,
              indeterminate: false,
            });
          }

          if (temp.length === 0) {
            setCheckAll({
              checked: false,
              indeterminate: false,
            });
          }
        }}
        closable
        onClose={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
          remove(tag.id, e)}
        key={tag.id}
        color={tag.color}
        onTouchStart={() => {
          holdStart(() => openEditExec(tag), 500);
        }}
        onTouchEnd={holdEnd}
        onMouseDown={() => {
          holdStart(() => openEditExec(tag), 500);
        }}
        onMouseUp={holdEnd}
      >
        {value.includes(tag.id) &&
          <CheckCircleTwoTone twoToneColor={theme["primary-color"]} />}
        {" "}
        {tag.name}
      </CusTag>
    )}
  </Spin>;
}
