import React from 'react';

const TopbarLayout = ({ children }) => {
  return (
    <div className="default-layout-topbar">
      <div className="topbar--wrap" style={{ height: 'auto' }} data-top="356">
        <div className={`topbar topbar-hidden`}>
          <div className={`topbar__container topbar-hidden`}>
            <div className="account-center-topbar__container">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopbarLayout;
