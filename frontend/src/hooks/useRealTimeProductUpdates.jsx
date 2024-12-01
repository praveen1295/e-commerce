import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProductRealTime } from "../features/product/productSlice";

const useRealTimeProductUpdates = () => {
  const { socket } = useSelector((state) => state.socket); // Assuming a socket slice
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpdatedProduct = (updatedProduct) => {
      dispatch(updateProductRealTime(updatedProduct));
    };

    // Listen for real-time product updates
    socket?.on("updatedProduct", handleUpdatedProduct);

    // Cleanup listener on unmount
    return () => {
      socket?.off("updatedProduct", handleUpdatedProduct);
    };
  }, [socket, dispatch]);
};

export default useRealTimeProductUpdates;
