import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MedicalBlogManager = () => {
  const BASE_URL = "http://localhost:8080/api/medical";

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    mainCategory: "",
    subCategory: "",
    featuredImage: null,
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      if (res.data.success) setBlogs(res.data.blogs);
    } catch (err) {
      toast.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, featuredImage: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      mainCategory: "",
      subCategory: "",
      featuredImage: null,
    });
    setEditBlogId(null);
    const fileInput = document.getElementById("blogImageInput");
    if (fileInput) fileInput.value = "";
  };

  // Add or edit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.featuredImage && !editBlogId) return toast.error("Featured Image is required!");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("mainCategory", formData.mainCategory);
    data.append("subCategory", formData.subCategory);
    if (formData.featuredImage) data.append("featuredImage", formData.featuredImage);

    try {
      if (editBlogId) {
        await axios.put(`${BASE_URL}/edit/${editBlogId}`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        toast.success("Blog updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/add-blog`, data, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        toast.success("Blog added successfully!");
      }

      resetForm();
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save blog!");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog!");
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      shortDescription: blog.shortDescription,
      mainCategory: blog.mainCategory,
      subCategory: blog.subCategory,
      featuredImage: null,
    });
    setEditBlogId(blog._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-[#e0f7fa] mt-[1vh]">
      <h2 className="text-2xl font-bold text-center text-[#00796b] mb-6">Medical Blogs</h2>

      {/* Toggle form */}
      <div
        className="max-w-sm mx-auto bg-white shadow-lg rounded-xl p-6 mb-6 border-2 border-dashed border-[#00796b] cursor-pointer hover:bg-[#e0f7fa] transition-all text-center"
        onClick={() => {
          if (showForm) { setShowForm(false); resetForm(); }
          else { resetForm(); setShowForm(true); }
        }}
      >
        <p className="text-[#00796b] font-semibold text-lg">
          {showForm ? "Close Form" : editBlogId ? "Edit Blog" : "+ Add New Blog"}
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 border-t-4 border-[#00796b] mb-6">
          <h3 className="text-xl font-bold text-[#00796b] mb-4">{editBlogId ? "Edit Blog" : "Add New Blog"}</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]" />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Short Description *</label>
              <textarea name="shortDescription" rows={3} value={formData.shortDescription} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]" />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Main Category *</label>
              <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]">
                <option value="">Select category</option>
                <option>General Health</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Dermatology</option>
                <option>Pediatrics</option>
                <option>Respiratory</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Sub Category</label>
              <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} placeholder="Eg: Heart Attack / Migraine" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00acc1]" />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Featured Image {editBlogId ? "(Optional)" : "*"}</label>
              <input type="file" id="blogImageInput" accept="image/*" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-2 focus:ring-[#00acc1]" />
            </div>

            <div className="md:col-span-2 flex justify-center mt-2">
              <button type="submit" className="bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white px-10 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-md">
                {editBlogId ? "Update Blog" : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-center col-span-3 text-gray-500">Loading blogs...</p>}
        {!loading && blogs.length === 0 && <p className="text-center col-span-3 text-gray-500">No blogs found.</p>}
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <img src={`http://localhost:8080/uploads/medicalBlogs/${blog.featuredImage}`} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
              <p className="text-sm text-gray-500 my-1">{blog.mainCategory} {blog.subCategory && `> ${blog.subCategory}`}</p>
              <p className="text-gray-700 mt-2">{blog.shortDescription}</p>
              <div className="flex justify-end mt-3 gap-2">
                <button onClick={() => handleEdit(blog)} className="px-3 py-1 bg-yellow-400 rounded-lg text-white hover:opacity-90">Edit</button>
                <button onClick={() => handleDelete(blog._id)} className="px-3 py-1 bg-red-500 rounded-lg text-white hover:opacity-90">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalBlogManager;
