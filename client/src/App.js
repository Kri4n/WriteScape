// Dependencies
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogPage from "./pages/BlogPage";
import Logout from "./pages/Logout";
import SinglePostPage from "./pages/SinglePostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    username: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({ id: null, isAdmin: false, username: "Guest" });
      return;
    }

    axios
      .get("https://writescape.onrender.com/users/details", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.user) {
          setUser({
            id: response.data.user._id,
            isAdmin: response.data.user.isAdmin,
            username: response.data.user.username,
          });
        } else {
          setUser({ id: null, isAdmin: null, username: "Guest" });
        }
      });
  }, []);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/blogs/:postId" element={<SinglePostPage />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
          <Footer />
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
