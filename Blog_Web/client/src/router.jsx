import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './components/Layout/Dashboard/DashboardLayout.jsx';
import GuestLayout from './components/Layout/Guest/GuestLayout.jsx';
import Home from './views/Home.jsx';
import SignIn from './views/SignIn.jsx';
import PrivateProfile from './views/PrivateProfile.jsx';
import PublicProfile from './views/PublicProfile.jsx';
import NotFound404 from './views/NotFound404.jsx';
import Posts from './views/Posts.jsx';
import Post from './views/Post.jsx';
import NewPost from './views/NewPost.jsx';
import GoogleAuth from './views/redirect/GoogleAuth.jsx';
import GithubAuth from './views/redirect/GithubAuth.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'blogs',
        element: <Posts />,
      },
      {
        path: 'blogs/:id',
        element: <Post />,
      },
      {
        path: 'newPost',
        element: <NewPost />,
      },
      {
        path: 'profile/private',
        element: <PrivateProfile />,
      },
      {
        path: 'profile/:id/public',
        element: <PublicProfile />,
      },
      {
        path: '*',
        element: <NotFound404 />,
      },
    ],
  },
  {
    path: 'nfc/signin',
    element: <GuestLayout />,
    children: [
      {
        path: '',
        element: <SignIn />,
      },
    ],
  },
  {
    path: 'auth/google',
    element: <GoogleAuth />,
  },
  {
    path: 'auth/github',
    element: <GithubAuth />,
  },
]);

export default router;
