import React from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { useContext } from "react";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav class="bg-white border-b border-gray-300">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-teal-600">
            WriteScape
          </h1>
        </Link>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!user.id && (
            <button
              type="button"
              class="text-white bg-teal-600 hover:bg-teal-700 font-medium rounded-lg text-sm px-4 py-2 text-center"
            >
              <Link to="/register"> Get started</Link>
            </button>
          )}

          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-800 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white ">
            <li>
              <Link
                to="/"
                class="block py-2 px-3 md:p-0 text-gray-800 rounded md:bg-transparent hover:text-teal-600"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            {user.id !== null ? (
              user.isAdmin ? (
                <>
                  <li>
                    <Link
                      to="/blogs"
                      class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/blogs"
                      class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/account"
                      class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              )
            ) : (
              <>
                <li>
                  <Link
                    to="/blogs"
                    href="#"
                    class="block py-2 px-3 md:p-0 text-gray-800 hover:text-teal-600 rounded"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    href="#"
                    class="block py-2 px-3 md:p-0 text-gray-800
                00 rounded hover:text-teal-600"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" class="hover:text-teal-600">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
