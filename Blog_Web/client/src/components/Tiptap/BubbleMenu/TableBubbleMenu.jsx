import React from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaTable, FaToggleOn } from 'react-icons/fa';
import {
  MdAutoFixHigh,
  MdCallMerge,
  MdCallSplit,
  MdOutlineNavigateBefore,
  MdOutlineNavigateNext,
} from 'react-icons/md';
import { RiInsertColumnLeft, RiInsertColumnRight } from 'react-icons/ri';
import { cn } from '~/utils';

const TableBubbleMenu = ({ editor }) => {
  return (
    <div className="table-menu__container">
      <div className="flex flex-col">
        <h3 className="table-menu__title">Insert</h3>
        <div className="flex flex-col">
          <button
            className={cn('table-menu__button')}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <FaTable className="menu-item__icon" />
            <span className="menu-item__label">Insert Table</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.can().addColumnBefore()}
          >
            <RiInsertColumnLeft className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Insert Column Before</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
          >
            <RiInsertColumnRight className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Insert Column After</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.can().addRowBefore()}
          >
            <RiInsertColumnRight className="menu-item__icon rotate-90 menu-item__icon--lg" />
            <span className="menu-item__label">Insert Row Before</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
          >
            <RiInsertColumnLeft className="menu-item__icon rotate-90 menu-item__icon--lg" />
            <span className="menu-item__label">Insert Row After</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="table-menu__title">Delete</h3>
        <div className="flex flex-col">
          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
          >
            <BsTrash className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Delete Column</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
          >
            <BsTrash className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Delete Row</span>
          </button>

          <button
            className={cn('table-menu__button')}
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
          >
            <BsTrash className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Delete Table</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="table-menu__title">Merge & Split</h3>
        <div className="flex flex-col">
          <button
            className={cn(
              'table-menu__button',
              !editor.can().mergeCells() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().mergeCells().run()}
            disabled={!editor.can().mergeCells()}
          >
            <MdCallMerge className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Merge Cells</span>
          </button>
          <button
            className={cn(
              'table-menu__button',
              !editor.can().splitCell() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().splitCell().run()}
            disabled={!editor.can().splitCell()}
          >
            <MdCallSplit className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Split Cells</span>
          </button>

          {/* <button
            className={cn("table-menu__button")}
            onClick={() => editor.chain().focus().mergeOrSplit().run()}
            disabled={!editor.can().mergeOrSplit()}
          >
            <CgArrowsMergeAltH className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Merge Or Split</span>
          </button> */}
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="table-menu__title">Togglers</h3>
        <div className="flex flex-col">
          <button
            className={cn(
              'table-menu__button',
              !editor.can().toggleHeaderColumn() &&
                'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            disabled={!editor.can().toggleHeaderColumn()}
          >
            <FaToggleOn className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Toggle Header Column</span>
          </button>

          <button
            className={cn(
              'table-menu__button',
              !editor.can().toggleHeaderRow() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            disabled={!editor.can().toggleHeaderRow()}
          >
            <FaToggleOn className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Toggle Header Row</span>
          </button>

          <button
            className={cn(
              'table-menu__button',
              !editor.can().toggleHeaderCell() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            disabled={!editor.can().toggleHeaderCell()}
          >
            <FaToggleOn className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Toggle Header Cell</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="table-menu__title">Setters</h3>
        <div className="flex flex-col">
          {/* <button
            onClick={() =>
              editor
                .chain()
                .focus()
                .setCellAttribute('backgroundColor', '#FAF594')
                .run()
            }
            disabled={
              !editor.can().setCellAttribute('backgroundColor', '#FAF594')
            }
          >
            setCellAttribute
          </button> */}

          <button
            className={cn(
              'table-menu__button',
              !editor.can().fixTables() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().fixTables().run()}
            disabled={!editor.can().fixTables()}
          >
            <MdAutoFixHigh className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">Fix Table</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col mt-3">
        <h3 className="table-menu__title">Navigators</h3>
        <div className="flex flex-col">
          <button
            className={cn(
              'table-menu__button',
              !editor.can().goToNextCell() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().goToNextCell().run()}
            disabled={!editor.can().goToNextCell()}
          >
            <MdOutlineNavigateNext className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">To Next Cell</span>
          </button>

          <button
            className={cn(
              'table-menu__button',
              !editor.can().goToPreviousCell() && 'table-menu__button--disabled'
            )}
            onClick={() => editor.chain().focus().goToPreviousCell().run()}
            disabled={!editor.can().goToPreviousCell()}
          >
            <MdOutlineNavigateBefore className="menu-item__icon menu-item__icon--lg" />
            <span className="menu-item__label">To Previous Cell</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableBubbleMenu;
