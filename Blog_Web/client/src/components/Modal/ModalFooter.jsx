import React from 'react';
import { cn } from '~/utils';

const ModalFooter = ({
  loading,
  handleCancel,
  handleConfirm,
  disableConfirm = false,
}) => {
  return (
    <footer className="flex items-center justify-center pt-1 pb-2">
      <button
        onClick={handleCancel}
        className="account-edit-btn account-edit-cancel-btn"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        className={cn(
          'account-edit-btn account-edit-confirm-btn',
          disableConfirm && 'btn-disabled'
        )}
      >
        {!loading ? (
          <>Confirm</>
        ) : (
          <>
            <span className="my-loader account-bg-loader"></span>
            Loading...
          </>
        )}
      </button>
    </footer>
  );
};

export default ModalFooter;
