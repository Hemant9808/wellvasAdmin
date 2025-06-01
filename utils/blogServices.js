import axiosInstance from "./axios";

// Get all blog posts
export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get('/blogs/getPosts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get single blog post by ID
export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blogs/getPost/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update blog post
export const updateBlog = async (id, blogData) => {
  try {
    const response = await axiosInstance.put(`/blogs/updatePost/${id}`, blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete blog post
export const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blogs/deletePost/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new blog post
export const createBlog = async (blogData) => {
  try {
    const response = await axiosInstance.post('/blogs/addPost', blogData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 