import React, { useState } from 'react';
import { FaTable } from 'react-icons/fa';
import { Tooltip } from 'antd';
import { IoClose } from 'react-icons/io5';
import useComponentVisible from '~/hooks/useComponentVisible';
import { cn } from '~/utils';

const defaultErrors = {
  state: false,
  rows: '',
  cols: '',
};

const defaultTable = { rows: '3', cols: '3' };

const AddTableButton = ({ editor }) => {
  const [toolbarTableRef, isToolbarTableVisible, setToolbarTableVisible] =
    useComponentVisible(false, 'toolbar-table');

  const [table, setTable] = useState(defaultTable);

  const handleAddTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: table.rows, cols: table.cols, withHeaderRow: true })
      .run();
  };

  const [errors, setErrors] = useState(defaultErrors);

  const handleCancel = () => {
    setTable(defaultTable);
    setToolbarTableVisible(false);
    setErrors(defaultErrors);
  };

  return (
    <div className="toolbar-item toolbar-table">
      <Tooltip placement="top" title={'Insert table'} arrow={false}>
        <button
          className={'tool-button'}
          ref={toolbarTableRef}
          onClick={() => {
            if (!isToolbarTableVisible) setToolbarTableVisible(true);
            else handleCancel();
          }}
        >
          <FaTable className="editor-icon" />
        </button>
      </Tooltip>
      {isToolbarTableVisible && (
        <div className="toolbar-list editor-tool-popup" style={{ width: 300 }}>
          <header className="dialog-header dialog-header__left">
            <p className="dialog-title">Add Table</p>
            <div className="dialog-closed">
              <button className="dialog-closed__button" onClick={handleCancel}>
                <IoClose className="icon-dialog__closed" />
              </button>
            </div>
          </header>
          <div className="dialog-body">
            <input
              className={cn(
                'input-container',
                errors.state && 'error-border-color'
              )}
              type="text"
              value={table.rows}
              onChange={(e) =>
                setTable({ ...table, rows: Number(e.target.value) })
              }
              placeholder="Enter number of rows"
            />
            <p className="error-text font-normal text-sm">
              {errors.state && 'Row has to be a number.'}
            </p>
            <input
              className={cn(
                'input-container',
                errors.state && 'error-border-color'
              )}
              type="text"
              value={table.cols}
              onChange={(e) => setTable({ ...table, cols: e.target.value })}
              placeholder="Enter number of columns"
            />
            <p className="error-text font-normal text-sm">
              {errors.state && 'Row has to be a number.'}
            </p>
          </div>
          <footer className="dialog-footer">
            <div className="cancel-button" onClick={handleCancel}>
              <span>Cancel</span>
            </div>
            <div
              className="accept-button"
              onClick={() => {
                handleAddTable();
                handleCancel();
                // if (errors.state === false) {
                // } else setErrors(defaultErrors);
              }}
            >
              <span>Confirm</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default AddTableButton;
