import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Button, DatePicker, Empty, Form, Spin } from "antd";

import { BottomFixPanel, FillScrollPart } from "@/layouts/";
import TagMgt from "@/components/TagMgt";

import type { StatisticSchema } from "@/models/record";
import type { TagSchema } from "@/models/tag";

import { nsFormat } from "@/utils/goTime";

import moment from "moment";

interface rootState {
  record: {
    statistic: StatisticSchema[];
  };
  tag: {
    list: TagSchema[];
  };
  loading: {
    models: { record: boolean };
  };
}

interface StatisticItemProps {
  color?: string;
  ratio: string;
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

const RecordItem = styled.div<StatisticItemProps>`
margin: 8px 12px;
padding: 10px 16px;
background: rgba(255, 255, 255, 0.85);
box-shadow: 1px 1px 20px 1px rgba(233, 233, 233, 0.85);
cursor: pointer;
position: relative;
& *{
  position: relative;
  color: white;
  mix-blend-mode: difference;
};

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

:before {
  content: ' ';
  position: absolute;
  width: ${(props) => props.ratio}%;
  background: ${(props) => props.color};
  height: 100%;
  top: 0;
  left: 0;
} 
`;

export default () => {
  const [form] = Form.useForm();
  const { statistic, loading, tags } = useSelector((s: rootState) => ({
    statistic: s.record.statistic,
    loading: s.loading.models.record,
    tags: s.tag.list,
  }));
  const dispatch = useDispatch();

  const total = statistic?.reduce((acc, cur) => acc += cur.deration, 0);
  async function submit(values: any) {
    try {
      await dispatch({ type: "record/statistic", payload: values });
    } catch (e) {
      console.error("create err: ", e);
    }
  }

  function cancel() {
    form.resetFields();
  }

  return (
    <BottomFixPanel>
      <CusFillScrollPart>
        <Spin spinning={loading} wrapperClassName="cus-spin">
          {statistic.length
            ? statistic.map((record: StatisticSchema) => {
              const tag = tags.find((t: TagSchema) => t.id === record.id);
              const ratio = (record.deration / total * 100).toFixed(2);
              return <RecordItem
                key={record.id}
                ratio={ratio}
                color={tag?.color}
              >
                <h3>{tag?.name}</h3>
                <div className="content">
                  <div className="main">
                    {ratio}%
                  </div>
                  <div className="extra">
                    {nsFormat(record.deration)}
                  </div>
                </div>
              </RecordItem>;
            })
            : <CusEmpty />}
        </Spin>
      </CusFillScrollPart>
      <Form
        onFinish={submit}
        form={form}
        initialValues={{
          dateRange: [moment().startOf("day"), moment().endOf("day")],
        }}
      >
        <BottomFixPanel
          style={{
            height: "25vh",
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
              name="tids"
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
              name="dateRange"
            >
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                allowClear
                showTime={{ format: "HH:mm" }}
                ranges={{
                  "今天": [moment().startOf("day"), moment().endOf("day")],
                  "昨天": [
                    moment().add(-1, "day").startOf("day"),
                    moment().add(-1, "day").endOf("day"),
                  ],
                  "本周": [moment().startOf("week"), moment().endOf("week")],
                  "上周": [
                    moment().add(-1, "week").startOf("week"),
                    moment().add(-1, "week").endOf("week"),
                  ],
                  "本月": [moment().startOf("month"), moment().endOf("month")],
                  "今年": [moment().startOf("year"), moment().endOf("year")],
                }}
              />
            </Form.Item>
            <Button onClick={cancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
          </InputBar>
        </BottomFixPanel>
      </Form>
    </BottomFixPanel>
  );
};
