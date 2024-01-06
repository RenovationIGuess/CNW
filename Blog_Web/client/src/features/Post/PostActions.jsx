import React from 'react';
import { AiOutlineEdit, AiOutlineUserDelete } from 'react-icons/ai';
import { BsFlag, BsHeartbreak, BsTrash } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosClient from '~/axios';
import useModalStore from '~/store/useModalStore';
import usePostsStore from '~/store/usePostsStore';

const PostActions = ({ post, setPopoverOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [setConfirmModalLoading, setConfirmModalInfo, setConfirmModalOpen] =
    useModalStore((state) => [
      state.setConfirmModalLoading,
      state.setConfirmModalInfo,
      state.setConfirmModalOpen,
    ]);

  const [setActionToast] = useModalStore((state) => [state.setActionToast]);

  const [posts, setPosts] = usePostsStore((state) => [
    state.posts,
    state.setPosts,
  ]);

  const handleDeletePost = () => {
    setConfirmModalLoading(true);
    axiosClient
      .delete(`/posts/${post.id}`)
      .then(({}) => {
        if (pathname === '/blogs') {
          setPosts(posts.filter((p) => p.id !== post.id));
        }

        setActionToast({
          status: true,
          message: 'Deleted',
        });

        if (pathname === `/blogs/${post.id}`) {
          navigate('/blogs');
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) {
          toast.error('You are not allowed to delete this post', {
            position: 'top-right',
            duration: 3000,
          });
        }
        console.log(err);
      })
      .finally(() => {
        setConfirmModalLoading(false);
        setTimeout(() => {
          setConfirmModalOpen(false);
        }, 0);
      });
  };

  return (
    <div className="action-menu">
      <div className="action-menu__title">More</div>
      <ul className="action-menu__list">
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
            navigate(`/blogs/${post.id}/edit`);
          }}
        >
          <AiOutlineEdit className="action-menu__icon" />
          <span className="action-menu__label">Edit Blog</span>
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <BsFlag className="action-menu__icon" />
          <span className="action-menu__label">Report User</span>
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <AiOutlineUserDelete className="action-menu__icon" />
          <span className="action-menu__label">Block User</span>
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
          }}
        >
          <BsHeartbreak className="action-menu__icon" />
          <span className="action-menu__label">Not Interested</span>
        </li>
        <li
          className="action-menu__item"
          onClick={() => {
            setPopoverOpen(false);
            setConfirmModalOpen(true);
            setConfirmModalInfo({
              title: `Xác nhận xóa post?`,
              message: `Post không thể khôi phục sau khi xóa. Bạn có chắc mình muốn xóa?`,
              confirmCallback: () => handleDeletePost(),
              cancelCallback: () => {},
            });
          }}
        >
          <BsTrash className="action-menu__icon" />
          <span className="action-menu__label">Delete Blog</span>
        </li>
      </ul>
    </div>
  );
};

export default PostActions;
