import { Outlet, createBrowserRouter, redirect } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import Layout from "./Layout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import IsLoggedIn from "./loaders/IsLoggedIn";
import { CurrentUserProvider } from "../lib/contexts/CurrentUserContext";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProfilePageEdit from "../pages/ProfilePage/ProfileEdit";
import CreateTaskPage from "../pages/CreateTaskPage/CreateTaskPage";
import TaskPage from "../pages/TaskPage/TaskPage";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <CurrentUserProvider>
        <Outlet />
      </CurrentUserProvider>
    ),
    children: [
      {
        path: "/auth",
        element: <Outlet />,
        children: [
          {
            path: "sign-in",
            element: <LoginPage />,
          },
          {
            path: "sign-up",
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "profile/:username",
            element: <ProfilePage />,
          },
          {
            path: "profile/create-task",
            element: <CreateTaskPage />,
          },
          {
            path: "profile/tasks",
            element: <TaskPage />,
          },
        ],
      },

      {
        //protected routes
        path: "/",
        loader: IsLoggedIn,
        element: <Outlet />,
        children: [
          {
            path: "profile",
            loader: () => {
              return redirect("/");
            },
          },

          {
            path: "profile/:username/edit",
            element: <ProfilePageEdit />,
          },
        ],
      },
    ],
  },
]);

export default router;
