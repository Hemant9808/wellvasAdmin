import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, updateBlog } from "../../services/blogService";
import { toast } from "react-hot-toast";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      setPost(data);
      setEditedPost(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch blog post");
      toast.error("Failed to fetch blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedPost = await updateBlog(id, editedPost);
      setPost(updatedPost);
      setIsEditing(false);
      toast.success("Blog updated successfully");
    } catch (err) {
      toast.error("Failed to update blog");
    }
  };

  const handleCancel = () => {
    setEditedPost(post);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Blog post not found</div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <textarea
              name="description"
              value={editedPost.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
            <textarea
              name="content"
              value={editedPost.content}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="8"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <img
              src={post.mainImg}
              alt={post.title}
              className="w-full    object-contain rounded-lg"
            />
            <div className="mt-4 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
              {/* <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button> */}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {post.description}
            </p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Content</h2>
              <p className="text-gray-700 leading-relaxed"><div dangerouslySetInnerHTML={{ __html: post.content }} />
</p>
            </div>
            {post.secondaryImg && post.secondaryImg.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Additional Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {post.secondaryImg.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Additional image ${index + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogDetail; 