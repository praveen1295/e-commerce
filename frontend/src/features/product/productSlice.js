import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  createProduct,
  updateProduct,
  getCategoryCounts,
  fetchRelatedProducts,
  fetchBestSellers,
  searchProducts,
  fetchRecommendedProducts, // Import the new search function
} from "./productAPI";

const initialState = {
  products: [],
  brands: [],
  categories: [],
  relatedProducts: [],
  recommendedProducts: [],
  bestSellers: [],
  status: "idle",
  totalItems: 0,
  selectedProduct: null,
  searchResults: [], // Add a new field for search results
};

export const fetchProductByIdAsync = createAsyncThunk(
  "product/fetchProductById",
  async (id) => {
    const response = await fetchProductById(id);
    return response;
  }
);

export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({ filter, sort, pagination, admin }) => {
    const response = await fetchProductsByFilters(
      filter,
      sort,
      pagination,
      admin
    );
    return response;
  }
);

export const getCategoryCountsAsync = createAsyncThunk(
  "product/getCategoryCounts",
  async ({ categories, admin }) => {
    const response = await getCategoryCounts(categories, admin);
    return response;
  }
);

export const fetchShopCategoriesData = createAsyncThunk(
  "product/fetchShopCategoriesData",
  async ({ filter, sort, pagination, admin }) => {
    const response = await fetchProductsByFilters(
      filter,
      sort,
      pagination,
      admin
    );
    return response;
  }
);

export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    return response;
  }
);

export const createProductAsync = createAsyncThunk(
  "product/create",
  async (product) => {
    const response = await createProduct(product);
    return response;
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (update) => {
    const response = await updateProduct(update);
    return response;
  }
);

export const fetchRelatedProductsAsync = createAsyncThunk(
  "product/fetchRelatedProducts:id",
  async ({ skus, id }) => {
    const response = await fetchRelatedProducts(skus, id);
    return response;
  }
);

export const fetchRecommendationsAsync = createAsyncThunk(
  "products/recommendedProducts",
  async ({ userId }) => {
    const response = await fetchRecommendedProducts(userId);
    return response;
  }
);

export const fetchBestSellersAsync = createAsyncThunk(
  "product/fetchBestSellers",
  async () => {
    const response = await fetchBestSellers();
    return response;
  }
);

// Define the new searchProductAsync function
export const searchProductAsync = createAsyncThunk(
  "product/searchProduct",
  async ({ query, userId }) => {
    const response = await searchProducts(query, userId);
    return response;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetSearchResults: (state) => {
      state.searchResults = [];
    },

    updateProductRealTime: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (index !== -1) {
        state.products[index] = updatedProduct; // Update existing product
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })

      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(getCategoryCountsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCategoryCountsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categoryCounts = action.payload;
      })
      .addCase(fetchRelatedProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRelatedProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRecommendationsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendationsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchBestSellersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBestSellersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.bestSellers = action.payload;
      })
      .addCase(searchProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.searchResults = action.payload;
      });
  },
});

export const {
  clearSelectedProduct,
  resetSearchResults,
  updateProductRealTime,
} = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectProductListStatus = (state) => state.product.status;
export const selectTotalItems = (state) => state.product.totalItems;
export const selectCategoryCounts = (state) => state.product.categoryCounts;
export const selectRelatedProducts = (state) => state.product.relatedProducts;
export const selectRecommendations = (state) =>
  state.product.recommendedProducts;
export const selectBestSellers = (state) => state.product.bestSellers;
export const selectSearchResults = (state) => state.product.searchResults; // Selector for search results

export default productSlice.reducer;
