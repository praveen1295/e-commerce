import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../features/chat/messageSlice";

const useGetRealTimeUpdatedProduct = () => {
  const { socket } = useSelector((store) => store.socket);
  const { messages } = useSelector((store) => store.message);
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("updatedProduct", (updatedProduct) => {
      dispatch(setMessages([...messages, updatedProduct]));
    });
    return () => socket?.off("updatedProduct");
  }, [setMessages, messages]);
};
export default useGetRealTimeUpdatedProduct;
