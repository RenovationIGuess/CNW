import React from 'react';
import { IoClose } from 'react-icons/io5';
import { cn } from '~/utils';

const AddTablePopover = ({ table, setTable, handleAddTable, handleCancel }) => {
  return (
    <div className="tiptap-popover" style={{ width: 300 }}>
      <header className="dialog-header dialog-header__left">
        <p className="dialog-title">Add Table</p>
        <div className="dialog-closed">
          <button className="dialog-closed__button" onClick={handleCancel}>
            <IoClose className="icon-dialog__closed" />
          </button>
        </div>
      </header>

      <div className="dialog-body">
        {/* <p className="text-sm font-medium">Rows</p> */}
        <input
          className={cn(
            'input-container',
            (isNaN(Number(table.rows)) || table.rows === '') &&
              'error-border-color'
          )}
          type="text"
          value={table.rows}
          onChange={(e) => setTable({ ...table, rows: e.target.value })}
          placeholder="Enter number of rows"
        />
        <p className="error-text font-normal text-sm">
          {table.rows === '' && 'Number of rows cannot be null.'}
          {isNaN(Number(table.rows)) && 'This has to be a number.'}
        </p>

        {/* <p className="text-sm font-medium">Columns</p> */}
        <input
          className={cn(
            'input-container',
            (isNaN(Number(table.cols)) || table.cols === '') &&
              'error-border-color'
          )}
          type="text"
          value={table.cols}
          onChange={(e) => setTable({ ...table, cols: e.target.value })}
          placeholder="Enter number of columns"
        />
        <p className="error-text font-normal text-sm">
          {table.cols === '' && 'Number of columns cannot be null.'}
          {isNaN(Number(table.cols)) && 'This has to be a number.'}
        </p>
      </div>

      <footer className="dialog-footer">
        <div className="cancel-button" onClick={handleCancel}>
          <span>Cancel</span>
        </div>
        <div
          className="accept-button"
          onClick={() => {
            if (
              table.cols === '' ||
              isNaN(Number(table.cols)) ||
              table.rows === '' ||
              isNaN(Number(table.rows))
            ) {
              return;
            }
            handleAddTable();
            handleCancel();
          }}
        >
          <span>Confirm</span>
        </div>
      </footer>
    </div>
  );
};

export default AddTablePopover;
