import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
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
      <Route path="/" element={<Home/>} />
      <Route path="/upload" element={<Upload/>} /> 
      <Route path="/analysis" element={<Analysis/>} />
    </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;