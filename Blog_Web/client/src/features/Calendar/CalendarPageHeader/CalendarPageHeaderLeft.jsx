import { Tooltip } from 'antd';
import React, { useMemo } from 'react';
import useCalendarStore from '~/store/useCalendarStore';

const CalendarPageHeaderLeft = () => {
  const [curSchedule] = useCalendarStore((state) => [state.curSchedule]);

  const dataPath = useMemo(() => {
    return curSchedule?.path?.map((item) => item.title);
  }, [curSchedule.id]);

  return (
    <div className="header__left">
      <div className="header-tab-wrapper">
        <Tooltip title={dataPath.join('/')} placement="bottom">
          <div className="flex items-center">
            {dataPath.length > 3 ? (
              <>
                <div className="header-tab">
                  <p className="header-tab-name">{dataPath[0]}</p>
                  <div className="header-tab__underline"></div>
                </div>
                <span className="header-tab-name">&nbsp;/&nbsp;</span>
                <div className="header-tab">
                  <p className="header-tab-name">...</p>
                  {/* <div className="header-tab__underline"></div> */}
                </div>
                <span className="header-tab-name">&nbsp;/&nbsp;</span>
                <div className="header-tab">
                  <div className="flex items-center flex-row">
                    {/* <FaBookOpen className="mr-[6px]" /> */}
                    <p className="header-tab-name">
                      {dataPath[dataPath.length - 1]}
                    </p>
                  </div>
                  <div className="header-tab__underline"></div>
                </div>
              </>
            ) : (
              dataPath.map((item, ind) => (
                <div key={ind} className="flex items-center">
                  <div className="header-tab">
                    <p className="header-tab-name">{item}</p>
                    <div className="header-tab__underline"></div>
                  </div>
                  {ind !== dataPath.length - 1 && (
                    <span className="header-tab-name">&nbsp;/&nbsp;</span>
                  )}
                </div>
              ))
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default CalendarPageHeaderLeft;
