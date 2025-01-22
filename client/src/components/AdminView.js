import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Notyf } from "notyf";

const AdminView = ({ posts }) => {
  const notyf = new Notyf();

  const { postId } = useParams();

  if (!Array.isArray(posts)) {
    return (
      <div className="text-red-500">Error: Posts data is not available.</div>
    );
  }

  const deletePost = (postId) => {
    let token = localStorage.getItem("token");

    axios
      .delete(`https://writescape.onrender.com/posts/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        notyf.success(response.data);
      })
      .catch((error) => {
        notyf.error("Error deleting post");
      });
  };

  return (
    <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-teal-600 text-white">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Content</th>
            <th className="py-3 px-6 text-left">Comments</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-3">
                No posts available
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200">
                <td className="py-3 px-6 text-left text-gray-800">
                  {post.title}
                </td>
                <td className="py-3 px-6 text-left text-gray-600">
                  {post.content}
                </td>
                <td className="py-3 px-6 text-left text-gray-600">
                  {post.comments.map((comment) => (
                    <ul key={comment._id} className="list-disc pl-5">
                      <li className="mb-2">
                        <strong>{comment.username}: </strong>
                        {comment.comment}
                        <br />
                        <span className="text-gray-400 text-sm">
                          {comment.date}
                        </span>
                      </li>
                    </ul>
                  ))}
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => deletePost(post._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
