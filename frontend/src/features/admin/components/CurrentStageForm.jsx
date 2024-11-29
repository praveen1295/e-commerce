import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectStatus, updateOrderAsync } from "../../order/orderSlice";
import toast from "react-hot-toast";
import CommonButton from "../../common/CommonButton";
import { Modal } from "antd";

const CurrentStageForm = ({
  order,
  handleOrderStage,
  closeForm,
  callFunction,
  btnText,
  btnStyle,
  btnDisabled,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    title: "",
    city: "",
    state: "",
    stage: "", // Add stage to the form data state
  });

  const orderLoading = useSelector(selectStatus);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.stage) {
      toast.error("Please select stage.");
      return;
    }

    let data = {};
    if (formData.stage === "dispatched") {
      data = { ...formData, dispatchedStages: [], status: formData.stage };
    } else if (formData.stage === "delivered") {
      data = { ...formData, dispatchedStages: [], status: formData.stage };
    } else if (formData.stage === "cancelled") {
      data = { ...formData, dispatchedStages: [], status: formData.stage };
    } else if (formData.stage === "return") {
      data = { ...formData, dispatchedStages: [], status: formData.stage };
    } else if (formData.stage === "refund") {
      data = { ...formData, dispatchedStages: [], status: formData.stage };
    } else {
      data = formData;
    }

    const updatedOrder = {
      id: order.id,
      orderStages: [...order.orderStages, data],
      currentStage: formData.stage,
    };

    if (callFunction) {
      callFunction(updatedOrder, data);
      return;
    }

    dispatch(updateOrderAsync(updatedOrder));
    handleOrderStage(formData.stage);
  };

  return (
    <>
      <CommonButton
        buttonClick={showModal}
        text={btnText}
        type="button"
        className={`rounded-full ${btnStyle}`}
        disabled={btnDisabled}
      />
      <Modal
        title={
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Enter Order Stage Information
          </h2>
        }
        centered
        open={open}
        onOk={handleSubmit}
        confirmLoading={orderLoading === "loading"}
        onCancel={handleCancel}
        width={1000}
      >
        <div className="bg-gray-100 flex justify-center relative">
          {/* {closeForm && (
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => closeForm(false)}
            >
              X
            </span>
          )} */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
            <form
              onSubmit={handleSubmit}
              className="flex space-x-4 justify-center items-center"
            >
              {/* Other form fields remain the same */}

              <div className="flex-1">
                <label
                  htmlFor="stage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stage
                </label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="pending">Pending</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="outForDelivery">Out For Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="return">Return</option>
                  <option value="returnApproved">Return Approved</option>
                  <option value="pickup">Pick Up</option>
                  <option value="refund">Refund</option>
                </select>
              </div>

              {/* Date, Time, Title, City, and State Fields */}
              <div className="flex-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex-1 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hidden"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CurrentStageForm;
