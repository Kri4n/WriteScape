import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../images/image.jpg";
import NoProfile from "../images/no-profile.png";

const ProfilePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [postId, setPostId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [myPosts, setMyPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const openEditModal = (post) => {
    setNewTitle(post.title); // Prefill the title
    setNewContent(post.content); // Prefill the content
    setPostId(post._id);
    setIsEditModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createNewPost = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    axios
      .post(
        "https://writescape.onrender.com/posts/addPost",
        {
          title: title,
          content: content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setIsModalOpen(false);
        fetchMyPosts();
        notyf.success("Created New Post");
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Error cannot post");
      });
  };

  const updatePost = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    axios
      .patch(
        `https://writescape.onrender.com/posts/updatePost/${postId}`,
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setIsEditModalOpen(false);
        fetchMyPosts();
        notyf.success("Updated");
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Error cannot update");
      });
  };

  const fetchMyPosts = () => {
    let token = localStorage.getItem("token");

    axios
      .get("https://writescape.onrender.com/posts/getMyPost", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMyPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  return (
    <>
      <div className="my-10 lg:mx-20 mx-3 lg:ps-16 grid grid-cols-5">
        <div className="flex flex-col text-left gap-4">
          <h1 className="text-2xl font-bold text-teal-600">User Details</h1>
          <hr />
          <div className="text-left text-gray-800">
            <img className="size-14 mb-4" src={NoProfile} alt="avatar" />
            <p className="font-medium">{user.username}</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:mx-20 my-5 lg:my-0 lg:col-span-4 col-span-5">
          <button
            type="button"
            className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center me-2 flex justify-center w-60 mb-4"
            onClick={toggleModal} // Toggle the modal when button is clicked
          >
            <svg
              className="w-3.5 h-3.5 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-.707.293H6a1 1 0 0 1-1-1V9a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-7 7H9a1 1 0 0 1-.707-.293l-4-4a1 1 0 0 1 0-1.414l7-7z" />
            </svg>
            Create New Post
          </button>
          {[...myPosts].reverse().map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={Image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {post.title}
                </h2>

                <p className="text-gray-700 mt-2">
                  {post.content.length > 100
                    ? `${post.content.substring(0, 100)}...`
                    : post.content}
                </p>
                <p className="text-gray-500 mt-2">
                  {new Date(post.creationDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>

                <button
                  className="mt-4 px-6 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-800 transition"
                  onClick={() => openEditModal(post)}
                >
                  Edit
                </button>

                <button className="mt-4 px-6 py-2 mx-2 border-2 border-teal-600 text-teal-600 font-medium rounded-lg  hover:bg-teal-600 hover:text-white transition">
                  <Link to={`/blogs/${post._id}`}>View Post</Link>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edi Post Modal */}
        {isEditModalOpen && (
          <div
            id="edit-modal"
            tabIndex="-1"
            aria-hidden={!isEditModalOpen}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="relative w-full max-w-4xl">
              <div className="relative bg-teal-50 rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-teal-600">
                  <h3 className="text-lg font-semibold text-teal-900">
                    Edit Post
                  </h3>
                  <button
                    type="button"
                    onClick={toggleEditModal}
                    className="text-teal-400 bg-transparent hover:bg-teal-200 hover:text-teal-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={updatePost}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Title
                      </label>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter title"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="content"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Content
                      </label>
                      <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows="4"
                        className="block p-2.5 w-full text-sm text-teal-900 bg-teal-50 rounded-lg border border-teal-300 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Write content"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Create New Post Modal */}
        {isModalOpen && (
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden={!isModalOpen}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="relative w-full max-w-4xl">
              <div className="relative bg-teal-50 rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-teal-600">
                  <h3 className="text-lg font-semibold text-teal-900">
                    Create New Post
                  </h3>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="text-teal-400 bg-transparent hover:bg-teal-200 hover:text-teal-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={createNewPost}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Title
                      </label>
                      <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter title"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="Content"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Content
                      </label>
                      <textarea
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        className="block p-2.5 w-full text-sm text-teal-900 bg-teal-50 rounded-lg border border-teal-300 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Write content"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Add Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
