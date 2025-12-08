import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const stateDistrictMap = {
    bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
    up: ["Lucknow", "Kanpur", "Varanasi"],
    maharashtra: ["Mumbai", "Pune", "Nagpur"],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProfile(res.data.data);
          setForm(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      for (let key in form) {
        if (form[key] !== undefined) formData.append(key, form[key]);
      }

      const res = await axios.put("http://localhost:8080/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setProfile(res.data.data);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
      } else {
        setError(res.data.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );

  return (
    <>

      <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

          {success && (
            <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>
          )}

          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unique User ID */}
              <div>
                <label className="block font-medium text-gray-700">Unique ID</label>
                <p className="text-gray-800">{profile.uniqueUserId}</p>
              </div>

              {/* Name */}
              <div>
                <label className="block font-medium text-gray-700">Name</label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-medium text-gray-700">Phone Number</label>
                {editMode ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700">Email</label>
                <p className="text-gray-800">{profile.email}</p>
              </div>

              {/* Role */}
              <div>
                <label className="block font-medium text-gray-700">Role</label>
                <p className="text-gray-800">{profile.role}</p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700">Address</label>
                {editMode ? (
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.address}</p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block font-medium text-gray-700">Blood Group</label>
                {editMode ? (
                  <input
                    type="text"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.bloodGroup}</p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <label className="block font-medium text-gray-700">Allergies</label>
                {editMode ? (
                  <input
                    type="text"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.allergies}</p>
                )}
              </div>

              {/* Chronic Diseases */}
              <div>
                <label className="block font-medium text-gray-700">Chronic Diseases</label>
                {editMode ? (
                  <input
                    type="text"
                    name="chronicDiseases"
                    value={form.chronicDiseases}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.chronicDiseases}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block font-medium text-gray-700">State</label>
                {editMode ? (
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    {Object.keys(stateDistrictMap).map((st) => (
                      <option key={st} value={st}>
                        {st.toUpperCase()}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800">{profile.state}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block font-medium text-gray-700">District</label>
                {editMode ? (
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    {(stateDistrictMap[form.state] || []).map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-800">{profile.district}</p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block font-medium text-gray-700">Pincode</label>
                {editMode ? (
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.pincode}</p>
                )}
              </div>

              {/* Language */}
              <div>
                <label className="block font-medium text-gray-700">Language</label>
                {editMode ? (
                  <input
                    type="text"
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.language}</p>
                )}
              </div>

              {/* Notification Preference */}
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700">Notification Preference</label>
                {editMode ? (
                  <input
                    type="text"
                    name="notificationPreference"
                    value={form.notificationPreference}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{JSON.stringify(profile.notificationPreference)}</p>
                )}
              </div>

              {/* Risk Category */}
              <div>
                <label className="block font-medium text-gray-700">Risk Category</label>
                {editMode ? (
                  <input
                    type="text"
                    name="riskCategory"
                    value={form.riskCategory}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-800">{profile.riskCategory}</p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block font-medium text-gray-700">Active</label>
                <p className="text-gray-800">{profile.isActive ? "Yes" : "No"}</p>
              </div>

              {/* Created / Updated */}
              <div>
                <label className="block font-medium text-gray-700">Created At</label>
                <p className="text-gray-800">{new Date(profile.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Updated At</label>
                <p className="text-gray-800">{new Date(profile.updatedAt).toLocaleString()}</p>
              </div>
            </div>

          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-center space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    
    </>
  );
};

export default Profile;
