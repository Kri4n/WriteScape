import React from "react";
import BlogWebsite from "../images/blog-website.jpg";
import { useEffect, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Notyf } from "notyf";

const SinglePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { user } = useContext(UserContext);
  const { postId } = useParams();
  const notyf = new Notyf();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = () => {
    axios
      .get(`https://writescape.onrender.com/posts/getPost/${postId}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setUsername(response.data.username);
        setCreationDate(response.data.creationDate);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Failed to load post");
      });
  };

  const formatWordDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const wordDate = formatWordDate(creationDate);

  const addNewComment = (e) => {
    e.preventDefault();

    // Check if user is logged in by checking user.id instead of user.token
    if (!user || !user.id) {
      notyf.error("Please log in to comment");
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      notyf.error("Please log in again");
      return;
    }

    // Validate comment
    if (!newComment.trim()) {
      notyf.error("Please write a comment");
      return;
    }

    axios
      .patch(
        `https://writescape.onrender.com/posts/addComment/${postId}`,
        {
          userId: user.id,
          username: user.username,
          comment: newComment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from localStorage
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        notyf.success("Comment posted successfully");
        setNewComment(""); // Clear the comment input
        fetchPost(); // Refresh the comments
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        notyf.error("Failed to post comment. Please try again.");
      });
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="max-w-4xl bg-gray-50 border shadow-sm">
          <img className="p-10" src={BlogWebsite} alt="Blog Image" />

          <div className="px-10">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-800">
              {title}
            </h5>
            <p className="italic">
              {wordDate} / Posted By: {username}
            </p>
            <p className="pb-10 pt-5 text-gray-800">{content}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-col text-center my-20">
        <h5 className="text-2xl font-bold text-gray-800 pb-14">Comments</h5>

        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div className="my-1" key={comment._id}>
              <div className="bg-white shadow-md border rounded-lg p-4 mx-auto max-w-2xl flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={
                      comment.profilePic ||
                      "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-600nw-1745180411.jpg"
                    }
                    alt={`${comment.username}'s profile`}
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-800">{comment.username}</p>
                  <p className="text-gray-600">{comment.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 text-md">No comments available</div>
        )}
      </div>

      <div className="my-20">
        <h1 className="text-2xl font-bold text-center pb-5">Leave a comment</h1>
        <form className="flex justify-center" onSubmit={addNewComment}>
          <div className="w-1/2 mb-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="px-4 py-2 bg-white rounded-t-lg">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                id="comment"
                rows="10"
                className="w-full text-sm bg-white placeholder-gray-500"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-300">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-teal-600 rounded-lg focus:ring-4 focus:ring-teal-300 hover:bg-teal-700"
              >
                Post comment
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SinglePostPage;
