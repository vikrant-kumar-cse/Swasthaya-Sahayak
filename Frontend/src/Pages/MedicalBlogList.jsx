import React, { useEffect, useState } from "react";
import axios from "axios";

const MedicalBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "http://localhost:8080"; // backend base URL

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/medical/all`);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 mt-[10vh]">
      <h2 className="text-2xl font-bold text-center text-[#00796b] mb-6">
        Medical Blogs
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading */}
        {loading && (
          <p className="text-center col-span-3 text-gray-500">Loading blogs...</p>
        )}

        {/* Error */}
        {error && <p className="text-center col-span-3 text-red-500">{error}</p>}

        {/* No blogs */}
        {!loading && !error && blogs.length === 0 && (
          <p className="text-center col-span-3 text-gray-500">No blogs found.</p>
        )}

        {/* Display blogs */}
        {!loading &&
          !error &&
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200"
            >
              {/* Blog Image */}
              <img
                src={`${BASE_URL}/uploads/medicalBlogs/${blog.featuredImage}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-sm text-gray-500 my-1">
                  {blog.mainCategory}
                  {blog.subCategory && ` > ${blog.subCategory}`}
                </p>
                <p className="text-gray-700 mt-2">{blog.shortDescription}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MedicalBlogList;
