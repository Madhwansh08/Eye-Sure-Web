// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Explainable from "./pages/Explainable";
import Profile from "./components/dashboard/Profile";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";
import ErrorPage from "./pages/Error";
import About from "./pages/About";
import PrivateRoute from "./routes/Private";
import PublicRoute from "./routes/Public";
import AppInitializer from "./hooks/AppInitializer";
import Metrics from "./components/dashboard/Metrics";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="*" element={<ErrorPage />}/>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />}/>
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              }
            />
            {/* Dynamic analysis route with reportId */}
            <Route
              path="/analysis/:reportId"
              element={
                <PrivateRoute>
                  <Analysis />
                </PrivateRoute>
              }
            />

            <Route
              path="/explainable/:reportId"
              element={
                <PrivateRoute>
                  <Explainable />
                </PrivateRoute>
              }
            />

<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<Metrics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
            


            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot"
              element={
                <PublicRoute>
                  <Forgot />
                </PublicRoute>
              }
            />
          </Routes>
        </AppInitializer>
      </Router>
    </Provider>
  );
}

export default App;
