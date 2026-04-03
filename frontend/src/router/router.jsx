import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PermissionsPage } from "../pages/PermissionsPage";
import { UsersPage } from "../pages/UsersPage";
import { ProtectedRoute } from "./RouteGuards";

export const appRouter = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: "users",
          element: (
            <ProtectedRoute roles={["Admin"]}>
              <UsersPage />
            </ProtectedRoute>
          )
        },
        {
          path: "permissions",
          element: (
            <ProtectedRoute roles={["Admin", "DOD", "DOS", "Teacher", "Security"]}>
              <PermissionsPage />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: "*",
      element: <NotFoundPage />
    }
  ],
  {
    future: {
      v7_startTransition: true
    }
  }
);
