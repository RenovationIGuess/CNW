import React from 'react';
import { BsTrash } from 'react-icons/bs';
import axiosClient from '~/axios';
import { userStateContext } from '~/contexts/ContextProvider';
import { toast } from 'react-toastify';
import useModalStore from '~/store/useModalStore';

// data could be comment or reply
const OperationsPopover = ({ note, history, setHistories, setPopoverOpen }) => {
  const { currentUser } = userStateContext();
  // Confirm Modal
  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const handleDeleteHistory = () => {
    const id = toast.success('Sending request...', {
      isLoading: true,
    });
    setConfirmModalLoading(true);
    try {
      axiosClient
        .delete(`/notes/${note.id}/histories/${history.id}`)
        .then(() => {
          setHistories((prev) => prev.filter((item) => item.id !== history.id));

          setConfirmModalLoading(false);
          setTimeout(() => {
            setConfirmModalOpen(false);
          }, 0);
        })
        .catch((err) => console.log(err));

      toast.update(id, {
        render: `Delete history successfully!`,
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">More</div>
      <ul className="action-menu__list">
        {/* <li className="action-menu__item">
          <AiOutlineUserDelete className="action-menu__icon" />
          <span className="action-menu__label">Block User</span>
        </li> */}
        {(currentUser.id === note.user_id ||
          currentUser.id === history?.user_id) && (
          <li
            onClick={() => {
              setConfirmModalOpen(true);
              setConfirmModalInfo({
                title: 'Xác nhận xóa history?',
                message:
                  'History không thể khôi phục sau khi xóa. Bạn có chắc mình muốn xóa?',
                callback: () => handleDeleteHistory(),
              });
              setPopoverOpen(false);
            }}
            className="action-menu__item"
          >
            <BsTrash className="action-menu__icon" />
            <span className="action-menu__label">Delete History</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default OperationsPopover;
