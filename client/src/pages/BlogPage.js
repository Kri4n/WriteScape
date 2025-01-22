import React, { useContext } from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import UserContext from "../context/UserContext";
import axios from "axios";
import { useState, useEffect } from "react";

const BlogPage = () => {
  const { user } = useContext(UserContext);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://writescape.onrender.com/posts/getAllPosts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts", error);
      });
  }, []);

  return user.isAdmin ? (
    <AdminView posts={posts} />
  ) : (
    <UserView posts={posts} />
  );
};

export default BlogPage;
