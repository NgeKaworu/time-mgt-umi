import React, { useLayoutEffect, useRef } from 'react';

import styled from 'styled-components';

import { Checkbox, Modal, Spin, Tag } from 'antd';
import { CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';

import { page, remove } from './services';

import theme from '@/theme';
import useModalForm from '@/js-sdk/components/ModalForm/useModalForm';
import { useQuery } from 'react-query';
import { TagSchema } from '@/components/TagMgt/models';
import { TagModForm } from './components/TagExec';
import useTagList from './hooks/useTagList';
interface TagMgtProps {
  value?: string[];
  onChange?: Function;
}

export const CusTag = styled(Tag)`
  margin-top: 6px !important;
`;

export default function TagMgt(props?: TagMgtProps) {
  const { data, isFetching: loading, refetch } = useTagList(),
    list = data?.data,
    { value = [], onChange = () => {} } = props || {},
    editor = useModalForm(),
    holdHandler = useRef(0);

  function holdStart(callback: Function, critical = 3000) {
    holdHandler.current = setTimeout(callback, critical);
  }

  function holdEnd() {
    clearTimeout(holdHandler.current);
  }

  function removeHandler(id: string) {
    return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault();
      Modal.confirm({
        title: '操作不可撤销',
        onOk: async () => {
          await remove(id);
          await onSuccess();
        },
      });
    };
  }

  // 打开新建弹窗
  function addHandler() {
    editor.setModalProps((pre) => ({ ...pre, visible: true }));
  }

  // 打开编辑弹窗
  function editHandler(t: TagSchema) {
    return () => {
      editor.form.setFieldsValue(t);
      editor.setModalProps((pre) => ({ ...pre, visible: true }));
    };
  }

  function onSuccess() {
    refetch();
  }

  return (
    <>
      <TagModForm {...editor} onSuccess={onSuccess} />

      <Spin spinning={loading}>
        <div style={{ borderBottom: '1px solid #e9e9e9' }}>
          <Checkbox
            checked={list?.length === value.length}
            indeterminate={value?.length > 0 && value?.length < list?.length}
            onChange={() => {
              if (list?.length === value?.length) {
                onChange([]);
              } else {
                onChange(list?.map?.((l) => l.id));
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
        <CusTag style={{ borderStyle: 'dashed', background: '#fff' }} onClick={addHandler}>
          <PlusOutlined /> 新增标签
        </CusTag>

        {list?.map?.((tag: TagSchema) => (
          <CusTag
            onClick={() => {
              const id = tag.id;
              const temp = value.includes(id)
                ? value.filter((v: string) => v !== id)
                : value.concat(id);
              onChange(temp);
            }}
            closable
            onClose={removeHandler(tag.id)}
            key={tag.id}
            color={tag.color}
            onTouchStart={() => {
              holdStart(editHandler(tag), 500);
            }}
            onTouchEnd={holdEnd}
            onMouseDown={() => {
              holdStart(editHandler(tag), 500);
            }}
            onMouseUp={holdEnd}
          >
            {value.includes(tag.id) && <CheckCircleTwoTone twoToneColor={theme['primary-color']} />}{' '}
            {tag.name}
          </CusTag>
        ))}
      </Spin>
    </>
  );
}
