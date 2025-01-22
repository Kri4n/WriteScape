import React from "react";
import { useState } from "react";
import { Notyf } from "notyf";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true); // New state for password confirmation

  const notyf = new Notyf();

  const registerUser = (e) => {
    e.preventDefault();

    // Reset validation states
    setIsEmailValid(true);
    setIsPasswordValid(true);
    setIsPasswordMatch(true);

    let isValid = true;

    if (!email.includes("@")) {
      setIsEmailValid(false);
      isValid = false;
    }

    if (password.length < 8) {
      setIsPasswordValid(false);
      isValid = false;
    }

    if (password !== confirmPassword) {
      setIsPasswordMatch(false); // Check if password and confirm password match
      isValid = false;
    }

    if (isValid) {
      axios
        .post(
          "https://writescape.onrender.com/users/register",
          {
            email: email,
            username: username,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((data) => {
          console.log("Registered Successfully", data);
          notyf.success("Registered Successfully");
          setEmail("");
          setUsername("");
          setPassword("");
          setConfirmPassword(""); // Reset confirm password
        })
        .catch((error) => {
          console.error(error);
          notyf.error("Something went wrong");
        });
    }
  };

  return (
    <>
      <div className="my-20">
        <h1 className="text-xl pb-10 font-bold text-center">Register</h1>
        <form class="max-w-sm mx-auto" onSubmit={registerUser}>
          <div class="mb-5">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-800"
            >
              Your email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
              required
            />
          </div>
          <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-800">
              Your Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
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
              value={password}
              type="password"
              id="password"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
              required
            />
          </div>
          <div class="mb-5">
            <label
              for="repeat-password"
              class="block mb-2 text-sm font-medium text-gray-800"
            >
              Repeat password
            </label>
            <input
              onChange={(e) => setConfirmPassword(e.target.value)} // Bind to confirmPassword state
              value={confirmPassword}
              type="password"
              id="repeat-password"
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
              required
            />
            {!isPasswordMatch && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <div class="flex items-start mb-5">
            <div class="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300"
                required
              />
            </div>
            <label for="terms" class="ms-2 text-sm font-medium text-gray-800">
              I agree with the{" "}
              <a href="#" class="text-teal-600 hover:underline">
                terms and conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            class="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Register new account
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
