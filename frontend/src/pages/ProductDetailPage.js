import NavBar from "../features/navbar/Navbar";
import ProductDetail from "../features/product/components/ProductDetail";
// import Footer from "../features/common/Footer";
import ProductDetail1 from "../features/product/components/ProductDetail1";
import Footer from "../features/footer/Footer";

function ProductDetailPage() {
  return (
    <div>
      <NavBar>
        <ProductDetail1></ProductDetail1>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default ProductDetailPage;
