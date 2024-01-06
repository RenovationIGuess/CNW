import React, { useState } from 'react';
import { FaTable } from 'react-icons/fa';
import { Popover, Tooltip } from 'antd';
import AddTablePopover from '../../Popovers/AddTablePopover';

const defaultTable = { rows: '3', cols: '3' };

const AddTableButton = ({ editor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [table, setTable] = useState(defaultTable);

  const handleAddTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: table.rows, cols: table.cols, withHeaderRow: true })
      .run();
  };

  const handleCancel = () => {
    setTable(defaultTable);
    setPopoverOpen(false);
  };

  return (
    <div className="toolbar-item toolbar-table">
      <Popover
        rootClassName="custom-popover"
        placement="bottomLeft"
        arrow={false}
        trigger="click"
        open={popoverOpen}
        onOpenChange={() => setPopoverOpen(!popoverOpen)}
        content={
          <AddTablePopover
            table={table}
            setTable={setTable}
            handleAddTable={handleAddTable}
            handleCancel={handleCancel}
          />
        }
      >
        <Tooltip placement="top" title={'Insert table'} arrow={false}>
          <button className={'tool-button'}>
            <FaTable className="editor-icon" />
          </button>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default AddTableButton;
