import { Counter } from "./features/counter/Counter";
import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import ProductDetailPage from "./pages/ProductDetailPage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked,
} from "./features/auth/authSlice";
import { fetchItemsByUserIdAsync } from "./features/cart/cartSlice";
import PageNotFound from "./pages/404";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import { fetchLoggedInUserAsync } from "./features/user/userSlice";
import Logout from "./features/auth/components/Logout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedRout from "./features/auth/components/ProtectedRoute";
import AdminHome from "./pages/AdminHome";
import AdminProductDetailPage from "./pages/AdminProductDetailPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminUsersPage from "./pages/AdminUsersPage";

import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
// import StripeCheckout from "./pages/StripeCheckout";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LandingPage from "./pages/LandingPage";
import ShopPage from "./pages/ShopPage";
import ShopProductsPage from "./pages/ShopProductsPage";
import ContactUsPage from "./pages/ContactUsPage";
import AdminNewUserRequestsPage from "./pages/AdminNewUserRequestsPage";
import UserOrdersDetailPage from "./pages/useOrderDetailPage";
import { Toaster } from "react-hot-toast";
import AdminBlogsPage from "./pages/AdminBlogsPage";
import AdminBlogForm from "./pages/AdminBlogFormPage";
import AboutusPage from "./pages/AboutusPage";
import AdminOrdersDetailPage from "./pages/AdminOrderDetailPage";
import AdminBannerPage from "./pages/AdminBannerPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import BlogsPage from "./pages/BlogsPage";
import TermsConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import AdminSignUpPage from "./pages/AdminSignUpPage";
import AdminListPage from "./pages/AdminListPage";
import { AuthProvider } from "./features/auth/components/AuthProvider";

import Invoice from "./Invoice";
import PackingSlip from "./PakingSlip";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";
import AdminBankDetailsPage from "./pages/AdminBankDetails";
import AdminBankDetailForm from "./features/admin/components/bankDetails/AdminBankDetailsForm";

import HomePage from "./features/chat/HomePage";
import io from "socket.io-client";
import { setSocket } from "./features/socket/socketSlice";
import { setOnlineUsers } from "./features/customerCare/customerCareSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("baseUrl=====>", BASE_URL);

const options = {
  timeout: 5000,
  position: positions.BOTTOM_LEFT,
};

const router = createBrowserRouter([
  {
    path: "/home",
    element: (
      // <ProtectedRout>
      <LandingPage />
      // </ProtectedRout>
    ),
  },
  {
    path: "/productLists",
    element: (
      // <ProtectedRout>
      <Home />
      // </ProtectedRout>
    ),
  },
  {
    path: "/shop",
    element: (
      // <ProtectedRout>
      <ShopProductsPage></ShopProductsPage>
      // <ShopPage></ShopPage>
      // </ProtectedRout>
    ),
  },
  {
    path: "/shop/products",
    element: (
      // <ProtectedRout>
      <ShopProductsPage></ShopProductsPage>
      // </ProtectedRout>
    ),
  },
  {
    path: "/aboutus",
    element: (
      // <ProtectedRout>
      <AboutusPage></AboutusPage>
      // </ProtectedRout>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminHome></AdminHome>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/blogs",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminBlogsPage></AdminBlogsPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/banks",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminBankDetailsPage></AdminBankDetailsPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/blogs",
    element: <BlogsPage></BlogsPage>,
  },
  {
    path: "/",
    // element: <PackingSlip />,
    element: <LandingPage />,
  },

  {
    path: "/chat",
    // element: <PackingSlip />,
    element: <HomePage />,
  },

  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/signup",
    element: <SignupPage></SignupPage>,
  },
  {
    path: "/cart",
    element: (
      <ProtectedRout roles={["admin", "owner", "user", "customerCare"]}>
        <CartPage></CartPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRout
        roles={["admin", "supervisor", "owner", "user", "customerCare"]}
      >
        <Checkout></Checkout>
      </ProtectedRout>
    ),
  },
  {
    path: "/product-detail/:id",
    element: (
      // <ProtectedRout>
      <ProductDetailPage></ProductDetailPage>
      // </ProtectedRout>
    ),
  },

  {
    path: "/blog/:id",
    element: (
      // <ProtectedRout>
      <BlogDetailsPage></BlogDetailsPage>
      // </ProtectedRout>
    ),
  },
  {
    path: "/contactus",
    element: (
      // <ProtectedRout>
      <ContactUsPage></ContactUsPage>
      // </ProtectedRout>
    ),
  },
  {
    path: "/admin/product-detail/:id",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/product-form",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/blog-form/",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminBlogForm></AdminBlogForm>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/blog-form/edit/:id",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminBlogForm></AdminBlogForm>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/bank-detail-form",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminBankDetailForm></AdminBankDetailForm>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/bank-detail-form/edit/:id",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminBankDetailForm></AdminBankDetailForm>
      </ProtectedRout>
    ),
  },
  // {
  //   path: "/admin/register",
  //   element: (
  //     <ProtectedRout>
  //       <AdminSignUpPage></AdminSignUpPage>
  //     </ProtectedRout>
  //   ),
  // },
  {
    path: "/admin/banners",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminBannerPage></AdminBannerPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/banner-form/",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminBannerPage></AdminBannerPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/banner-form/edit/:id",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminBannerPage></AdminBannerPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminUsersPage></AdminUsersPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/adminList",
    element: (
      <ProtectedRout roles={["admin", "supervisor", "owner"]}>
        <AdminListPage></AdminListPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/newUserRequests",
    element: (
      <ProtectedRout roles={["owner"]}>
        <AdminNewUserRequestsPage></AdminNewUserRequestsPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/userDetails",
    element: (
      <ProtectedRout roles={["owner", "admin", "supervisor"]}>
        <AdminUserDetailsPage></AdminUserDetailsPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/admin/product-form/edit/:id",
    element: (
      <ProtectedRout roles={["supervisor", "owner"]}>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedRout>
    ),
  },
  {
    path: "/order-success/:id",
    element: (
      <ProtectedRout roles={["admin", "owner", "user"]}>
        <OrderSuccessPage></OrderSuccessPage>{" "}
      </ProtectedRout>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <ProtectedRout roles={["user", "customerCare", "admin", "owner"]}>
        <UserOrdersPage></UserOrdersPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/my-orders/orderDetail",
    element: (
      <ProtectedRout
        roles={["user", "customerCare", "admin", "supervisor", "owner"]}
      >
        <UserOrdersDetailPage></UserOrdersDetailPage>
      </ProtectedRout>
    ),
  },

  {
    path: "orders/adminOrderDetail",
    element: (
      <ProtectedRout roles={["user", "admin", "supervisor", "owner"]}>
        <AdminOrdersDetailPage></AdminOrdersDetailPage>
      </ProtectedRout>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRout
        roles={["admin", "supervisor", "owner", "user", "customerCare"]}
      >
        <UserProfilePage></UserProfilePage>{" "}
      </ProtectedRout>
    ),
  },
  // {
  //   path: "/stripe-checkout/",
  //   element: (
  //     // <ProtectedRout>
  //     <StripeCheckout></StripeCheckout>
  //     // </ProtectedRout>
  //   ),
  // },
  {
    path: "/logout",
    element: <Logout></Logout>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage></ForgotPasswordPage>,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage></ResetPasswordPage>,
  },

  {
    path: "/privacyPolicy",
    element: <PrivacyPolicyPage></PrivacyPolicyPage>,
  },
  {
    path: "/termsAndConditions",
    element: <TermsConditionsPage></TermsConditionsPage>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  const { socket } = useSelector((store) => store.socket);

  useEffect(() => {
    if (user) {
      const socketio = io(`${BASE_URL}`, {
        query: {
          userId: user.id,
        },
      });
      dispatch(setSocket(socketio));

      socketio?.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      // we can get req.user by token on backend so no need to give in front-end
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <>
      <AuthProvider>
        <div className="App">
          <Toaster />
          {userChecked && (
            <Provider template={AlertTemplate} {...options}>
              <RouterProvider router={router} />
            </Provider>
          )}
          {/* Link must be inside the Provider */}
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
