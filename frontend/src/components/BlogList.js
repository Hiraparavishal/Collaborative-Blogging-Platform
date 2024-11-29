import React from "react";

const BlogList = ({ blogs, onEdit }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            margin: "10px",
            position: "relative",
          }}
        >
          <h2>{blog.title}</h2>
          <p>{blog.content.slice(0, 100)}...</p>

          {/* Edit Icon/Button */}
          <button
            onClick={() => onEdit(blog._id)} // Trigger the onEdit function
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
            }}
          >
            ✏️ Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
