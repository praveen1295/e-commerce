import React from "react";
import CustomerCare from "./CustomerCare";
import useGetOtherUsers from "../../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";
import { selectUsers } from "../user/userSlice";

const CustomerCares = () => {
  // my custom hook
  useGetOtherUsers();
  const customerCares = useSelector(selectUsers);

  if (!customerCares) return; // early return in react

  return (
    <div className="overflow-auto flex-1">
      {customerCares?.map((customerCare) => {
        return <CustomerCare key={customerCare._id} user={customerCare} />;
      })}
    </div>
  );
};

export default CustomerCares;
