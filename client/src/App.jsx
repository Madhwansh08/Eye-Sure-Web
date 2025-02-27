import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./routes/Private";
import PublicRoute from "./routes/Public";
import AppInitializer from "./hooks/AppInitializer";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
            <Route path="/" element={<Home />} />
            <Route 
              path="/upload" 
              element={
                <PrivateRoute>
                  <Upload />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analysis" 
              element={
                <PrivateRoute>
                  <Analysis />
                </PrivateRoute>
              } 
            />
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
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;