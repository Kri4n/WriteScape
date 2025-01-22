import React from "react";
import Logo from "../images/logo.png";

const Homepage = () => {
  return (
    <div className="relative bg-gradient-to-r py-20 lg:py-44 flex items-center justify-center from-teal-500 via-teal-400 to-teal-600">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <div className="text-center text-white">
          <img className="w-32 h-32 mx-auto" src={Logo} />
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to Writescape
          </h1>

          <p className="text-lg md:text-2xl mb-8">
            Discover, share, and explore amazing blog posts from passionate
            writers.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/blogs"
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-lg rounded-md transition duration-300"
            >
              Explore Blogs
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-teal-700 text-white font-semibold text-lg rounded-md transition duration-300"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
