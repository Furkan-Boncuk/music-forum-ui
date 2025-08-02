import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./buss-components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuthStore } from "./stores/authStore";
import { Center, Spinner } from "@chakra-ui/react";
import SearchPage from "./pages/SearchPage";
import SongDetailsPage from "./pages/SongDetails";
import SpotifyCallback from "./buss-components/songDetails/callback";
import WritePage from "./pages/WritePage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const App: React.FC = () => {
  const { isLoggedIn, checkToken } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkToken();
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/auth"
          element={
            !isLoggedIn ? (
              <Layout>
                <AuthPage />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />
        <Route
          path="/songs/:songId"
          element={
            <Layout>
              <SongDetailsPage />
            </Layout>
          }
        />
        <Route
          path="/write"
          element={
            <Layout>
              <WritePage />
            </Layout>
          }
        />
        <Route
          path="/posts/:postId"
          element={
            <Layout>
              <PostPage />
            </Layout>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <SettingsPage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
