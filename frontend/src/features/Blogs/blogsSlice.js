import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchMostViewedBlogs,
  fetchLatestBlogs,
} from "./blogsAPI";

const initialState = {
  blogs: [],
  totalBlogs: 0,
  status: "idle",
  error: null,
  selectedBlog: null,
  mostViewedBlogs: [],
  latestBlogs: [],
};

export const fetchAllBlogsAsync = createAsyncThunk(
  "blogs/fetchAll",
  async ({ sort, filters, pagination }) => {
    try {
      const response = await fetchBlogs(sort, filters, pagination);
      return response;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  }
);

export const fetchBlogByIdAsync = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id) => {
    try {
      const response = await fetchBlogById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const createBlogAsync = createAsyncThunk(
  "blogs/createBlog",
  async (blog) => {
    try {
      const response = await createBlog(blog);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const updateBlogAsync = createAsyncThunk(
  "blogs/updateBlog",
  async (updateData) => {
    try {
      const response = await updateBlog(updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteBlogAsync = createAsyncThunk(
  "blogs/deleteBlog",
  async (id) => {
    try {
      await deleteBlog(id);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchMostViewedBlogsAsync = createAsyncThunk(
  "blogs/fetchMostViewed",
  async () => {
    try {
      const response = await fetchMostViewedBlogs();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchLatestBlogsAsync = createAsyncThunk(
  "blogs/fetchLatest",
  async () => {
    try {
      const response = await fetchLatestBlogs();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Blogs
      .addCase(fetchAllBlogsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllBlogsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.blogs = action.payload.blogs;
        state.totalBlogs = action.payload?.totalBlogs;
      })
      .addCase(fetchAllBlogsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Fetch Blog By ID
      .addCase(fetchBlogByIdAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Create Blog
      .addCase(createBlogAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBlogAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.blogs.push(action.payload);
      })
      .addCase(createBlogAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Update Blog
      .addCase(updateBlogAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBlogAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(updateBlogAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Delete Blog
      .addCase(deleteBlogAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteBlogAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      })
      .addCase(deleteBlogAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Fetch Most Viewed Blogs
      .addCase(fetchMostViewedBlogsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMostViewedBlogsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.mostViewedBlogs = action.payload;
      })
      .addCase(fetchMostViewedBlogsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })
      // Fetch Latest Blogs
      .addCase(fetchLatestBlogsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLatestBlogsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.latestBlogs = action.payload;
      })
      .addCase(fetchLatestBlogsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;

export const selectBlogs = (state) => state.blogs.blogs;
export const selectTotalBlogs = (state) => state.blogs.totalBlogs;
export const selectSelectedBlog = (state) => state.blogs.selectedBlog;
export const selectBlogListStatus = (state) => state.blogs.status;
export const selectBlogError = (state) => state.blogs.error;
export const selectMostViewedBlogs = (state) => state.blogs.mostViewedBlogs;
export const selectLatestBlogs = (state) => state.blogs.latestBlogs;

export default blogSlice.reducer;
