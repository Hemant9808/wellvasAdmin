import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs, deleteBlog, createBlog, updateBlog } from "../../utils/blogServices";
import { toast } from "react-hot-toast";
import { Editor } from '@tinymce/tinymce-react';
import useAuthStore from "../../utils/authStore";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    title: '',
    mainImg: '',
    description: '',
    secondaryImg: [],
    secondaryDesc: '',
    content: ''
  });

  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://wellvas-backend.onrender.com/product/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("data",data)
      if (data.coverImage) {
        return data.coverImage; // Return uploaded image URL
      } else {
        console.error("Upload failed:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent);
    setCurrentBlog(prev => ({ ...prev, content: newContent }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleSecondaryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => handleFileUpload(file));
    
    Promise.all(imagePromises)
      .then(urls => {
        setCurrentBlog(prev => ({
          ...prev,
          secondaryImg: [...prev.secondaryImg, ...urls.filter(url => url)]
        }));
      })
      .catch(error => {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload some images');
      });
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await handleFileUpload(file);
      if (url) {
        setCurrentBlog(prev => ({ ...prev, mainImg: url }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateBlog(currentBlog._id, currentBlog);
        toast.success('Blog updated successfully');
      } else {
        await createBlog(currentBlog);
        toast.success('Blog created successfully');
      }
      setIsDialogOpen(false);
      fetchBlogs();
      resetForm();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update blog' : 'Failed to create blog');
    }
  };

  const resetForm = () => {
    setCurrentBlog({
      title: '',
      mainImg: '',
      description: '',
      secondaryImg: [],
      secondaryDesc: '',
      content: ''
    });
    setContent('');
    setIsEditing(false);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setContent(blog.content);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      // Sort blogs by createdAt date in descending order (newest first)
      const sortedBlogs = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogs(sortedBlogs);
      setError(null);
    } catch (err) {
      setError("Failed to fetch blogs");
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully");
      fetchBlogs(); // Refresh the list
    } catch (err) {
      toast.error("Failed to delete blog");
    }
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

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Our Latest Posts
          </h2>
         
            <button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New Blog
            </button>
         
        </div>

        {/* Blog Dialog - Only show if user is admin */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-4">
                {isEditing ? 'Edit Blog' : 'Add New Blog'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={currentBlog.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full h-10 p-2  rounded-md border-gray-300 shadow-sm focus:border-none focus:ring-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="mt-1 block w-full h-10 shadow-md rounded-md p-2 cursor-pointer"
                  />
                  {currentBlog.mainImg && (
                    <img src={currentBlog.mainImg} alt="Main" className="mt-2 h-32 object-cover" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 ">Description</label>
                  <textarea
                    name="description"
                    value={currentBlog.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Secondary Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSecondaryImageChange}
                    className="mt-1 block  w-full"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentBlog.secondaryImg.map((img, index) => (
                      <img key={index} src={img} alt={`Secondary ${index + 1}`} className="h-24 object-cover" />
                    ))}
                  </div>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Secondary Description</label>
                  <textarea
                    name="secondaryDesc"
                    value={currentBlog.secondaryDesc}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className=" ">
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <Editor
                    apiKey='1me8jbsjux1lek0xoq6018iujrx1jv9isuam7bu259kygrqt'
                    init={{
                      // plugins: [
                        // 'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        // 'checklist', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                      // ],
                      // text color in toolbar
                      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | undo redo | bold italic | alignleft aligncenter alignright | image link media | code | forecolor backcolor',
                      images_upload_handler: async (blobInfo, success, failure) => {
                        const file = blobInfo.blob();
                        const imageUrl = await handleFileUpload(file);
                        if (imageUrl) {
                          success(imageUrl);
                        } else {
                          failure('Image upload failed');
                        }
                      },
                      promotion: false,
                      branding: false,
                      notifications: false
                    }}
                    value={content}
                    onEditorChange={handleEditorChange}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={post.mainImg}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 flex flex-col  h-[30%] justify-between">

              <div>
                <span className="text-sm font-semibold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                  Blog
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{post.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                 
                </div>
                </div>


                <div className="  flex justify-between mt-4 ">
                    {/* <Link
                      to={`/blogs/${post._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Read More →
                    </Link> */}
               
                      <div className=" flex gap-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-green-500 bg-green-200 p-2 rounded-lg hover:text-green-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-500 bg-red-200 p-2 rounded-lg hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 