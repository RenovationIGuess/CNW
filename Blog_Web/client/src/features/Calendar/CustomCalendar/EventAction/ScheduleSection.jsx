import { Flex, Select, Tag, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import axiosClient from '~/axios';
import useCalendarStore from '~/store/useCalendarStore';
import { cn } from '~/utils';

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const ScheduleSection = ({ event, setEvent, errors }) => {
  const { pathname } = useLocation();

  const [isEmpty, setIsEmpty] = useState(true);

  const [schedules, setSchedules] = useCalendarStore((state) => [
    state.schedules,
    state.setSchedules,
  ]);

  const [fetching, setFetching] = useState(false);

  const onChange = (option) => {
    // console.log(`selected ${value}`);
    // console.log(typeof value);
    const value = option.map((item) => parseInt(item.split('|')[0]));

    if (value.length === 0) setIsEmpty(true);
    else setIsEmpty(false);

    setEvent({
      ...event,
      schedule_ids: value,
    });
    // console.log(option);
  };

  const onSearch = (value) => {
    // console.log('search:', value);
  };

  useEffect(() => {
    const regex = /^\/schedule\/\d+$/;
    if (regex.test(pathname)) {
      setFetching(true);
      axiosClient
        .get(`/schedules`)
        .then(({ data }) => {
          setSchedules(data.data.schedules);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const options = useMemo(() => {
    return schedules.map((schedule) => ({
      id: schedule.id,
      label: schedule.title,
      value: schedule.id + '|' + schedule.icon,
    }));
  }, [schedules]);

  const defaultValue = useMemo(() => {
    return event.schedule_ids
      ? options?.filter((opt) => event.schedule_ids.includes(opt.id))
      : [];
  }, [options, event.schedule_ids]);

  return (
    <div className="edit-tag__item">
      <div className="flex items-center">
        <p className="edit-tag__title">Schedule</p>
        <div className="copyright-settings-title">
          <Tooltip
            title={
              'Select the schedule the event should belongs to, you can select more than one schedule'
            }
            placement="top"
          >
            <AiOutlineInfoCircle className="icon" />
          </Tooltip>
        </div>
      </div>
      <Select
        loading={fetching}
        mode="multiple"
        allowClear
        showSearch
        disabled={fetching}
        placeholder={fetching ? 'Loading...' : 'Select schedules'}
        value={defaultValue}
        options={options}
        size="large"
        className={cn(
          'custom-antd-select',
          errors?.state &&
            errors['schedule'] &&
            isEmpty &&
            'custom-antd-select--error'
        )}
        onChange={onChange}
        filterOption={filterOption}
        onSearch={onSearch}
        optionLabelProp="label"
        optionRender={optionRender}
        tagRender={tagRender}
        // status={errors?.state && errors['schedule'] && isEmpty && 'error'}
        // notFoundContent={fetching && <span className="my-loader"></span>}
      />
      {errors?.state &&
        errors['schedule'] &&
        isEmpty &&
        errors['schedule']?.map((error, index) => (
          <p key={index} className="error-text font-normal">
            {error}
          </p>
        ))}
    </div>
  );
};

const optionRender = (option) => {
  const { value, label } = option.data;

  const { id, icon } = useMemo(() => {
    const splitValue = value.split('|');

    return {
      id: splitValue[0],
      icon: splitValue[1],
    };
  }, [value]);

  return (
    <Flex align="center" gap={'small'}>
      {icon.includes('/') ? (
        <img className="w-5 h-5" src={icon} alt="schedule-icon" />
      ) : (
        <p style={{ fontSize: 18, lineHeight: 1, width: 20 }}>{icon}</p>
      )}
      {label}
    </Flex>
  );
};

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const { id, icon } = useMemo(() => {
    const splitValue = value.split('|');

    return {
      id: splitValue[0],
      icon: splitValue[1],
    };
  }, [value]);

  return (
    <Tag
      // onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      bordered={false}
      // style={{
      //   marginRight: 3,
      // }}
      className="custom-antd-tag"
    >
      {icon.includes('/') ? (
        <img className="w-5 h-5 mr-1" src={icon} alt="schedule-icon" />
      ) : (
        <p style={{ fontSize: 18, width: 20, marginRight: 2 }}>{icon}</p>
      )}
      {label}
    </Tag>
  );
};

export default ScheduleSection;
