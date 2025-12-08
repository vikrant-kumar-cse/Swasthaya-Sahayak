import React from "react";

function BlogCard({ blog }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px"
    }}>
      <h2>{blog.title}</h2>
      <p style={{ color: "gray" }}>Author: {blog.author}</p>
      <p>{blog.content}</p>
    </div>
  );
}

export default BlogCard;
