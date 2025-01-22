import React from "react";
import { Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { Notyf } from "notyf";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const notyf = new Notyf();

  const loginUser = (e) => {
    e.preventDefault();

    axios
      .post("https://writescape.onrender.com/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data && response.data.access) {
          // Check for access token
          localStorage.setItem("token", response.data.access);
          retrieveUserId(response.data.access);
        } else {
          notyf.error("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error(error);
        notyf.error("User does not exist");
      });
  };

  const retrieveUserId = (token) => {
    axios
      .get("https://writescape.onrender.com/users/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser({
          id: response.data.user._id,
          isAdmin: response.data.user.isAdmin,
        });
        setIsLoggedIn(true);
        console.log("Welcome User");
        if (response.data.user.isAdmin) {
          notyf.success("Welcome Admin");
        } else {
          notyf.success(`Welcome ${response.data.user.username}`);
        }
      })
      .catch((error) => {
        console.error("Error retrieving user details:", error);
        notyf.error("Failed to get user details");
      });
  };

  if (isLoggedIn || user.id !== null) {
    return <Navigate to="/blogs" />;
  }

  return (
    <div className="my-20">
      <h1 className="text-xl pb-10 font-bold text-center">Login</h1>
      <form class="max-w-sm mx-auto" onSubmit={loginUser}>
        <div class="mb-5">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-800"
          >
            Your email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-800"
          >
            Your password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
