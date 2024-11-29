import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import CurrentStageForm from "./CurrentStageForm";
import { useDispatch } from "react-redux";
import { fetchOrderByIdAsync, updateOrderAsync } from "../../order/orderSlice";
import "./AdminOrderStages.scss";
import CommonButton from "../../common/CommonButton";
import Modal from "../../common/Modal";
import { PencilIcon } from "@heroicons/react/24/outline";
import { MdOutlineDeleteForever } from "react-icons/md";

const { Step } = Steps;

const AdminOrderStages = ({ order, logistic }) => {
  const dispatch = useDispatch();
  const [orderStages, setOrderStages] = useState(order?.orderStages || []);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    title: "",
    city: "",
    state: "",
    stage: "", // Add stage to the form data state
  });
  const [currentStatusForm, setCurrentStatusForm] = useState(false);
  const [isEditStage, setIsEditStage] = useState({
    flag: false,
    item: {},
    index: -1,
  });
  const [isDeleteStage, setIsDeleteStage] = useState({
    flag: false,
    item: {},
    index: -1,
  });

  const splitCamelCaseAndCapitalize = (str) => {
    return str
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrder = {
      id: order.id,
      orderStages: order.orderStages?.map((item) => {
        if (item.stage === "dispatched") {
          return {
            ...item,
            dispatchedStages: [
              ...item?.dispatchedStages,
              {
                date: formData.date,
                time: formData.time,
                title: formData.title,
                city: formData.city,
                state: formData.state,
              },
            ],
          };
        }

        return item;
      }),
    };

    dispatch(updateOrderAsync(updatedOrder));
  };

  const handleStepEdit = (_, updatedOrder) => {
    const updatedSteps = order.orderStages
      .map((item, index) => {
        if (index === isEditStage.index) {
          return { ...item, ...updatedOrder };
        }
        return item;
      })
      .filter((item, idx) => item.stage !== "expectedDelivery");
    dispatch(
      updateOrderAsync({
        id: order.id,
        orderStages: updatedSteps,
      })
    );
    dispatch(fetchOrderByIdAsync({ orderId: order.id }));
  };

  const handleStepDelete = () => {
    const updatedSteps = orderStages
      .filter((item, index) => {
        return index !== isDeleteStage.index;
      })
      .filter((item) => item.stage !== "expectedDelivery");

    dispatch(updateOrderAsync({ id: order.id, orderStages: updatedSteps }));
    dispatch(fetchOrderByIdAsync({ orderId: order.id }));
  };

  function formatDate(isoDateString) {
    // Parse the ISO date string using moment
    const date = moment(isoDateString);

    // Format the date as 'Wed, 5th Jun'
    return date.format("ddd, Do MMM");
  }

  useEffect(() => {
    if (order?.orderStages) {
      const hasDeliveredOrReturned = order.orderStages.some(
        (item) =>
          (item.stage === "delivered" || item.stage === "return") &&
          item.stage !== "expectedDelivery"
      );

      if (!hasDeliveredOrReturned) {
        setOrderStages([
          ...order.orderStages,
          { stage: "expectedDelivery", date: order.expectedDelivery },
        ]);
      }
    }
  }, [order]);

  return (
    <div className="w-full my-10 overflow-auto py-4">
      {orderStages.length > 1 && (
        <Steps
          progressDot
          current={order?.orderStages?.length - 1}
          // direction="vertical"
          items={orderStages?.map((item, idx) => {
            if (item.stage === "dispatched") {
              return {
                title: (
                  <div className="flex flex-col justify-start items-start">
                    <div className="">
                      {splitCamelCaseAndCapitalize(item?.stage)}
                    </div>{" "}
                    <div className="flex items-center justify-start gap-1">
                      <small
                        onClick={() => {
                          setIsEditStage({
                            ...isEditStage,
                            flag: true,
                            item,
                            index: idx,
                          });
                          setIsDeleteStage({
                            ...isEditStage,
                            flag: false,
                            item: {},
                            index: -1,
                          });
                        }}
                      >
                        {
                          <CurrentStageForm
                            callFunction={handleStepEdit}
                            order={order}
                            btnStyle={"p-0 py-0 px-0 border-none"}
                            btnText={
                              <PencilIcon
                                className="w-3 cursor-pointer hover:text-red-500"
                                // onClick={() => setEditStage(true)}
                              />
                            }
                            btnDisabled={item.stage === "expectedDelivery"}
                          />
                        }
                      </small>
                      <small>
                        <CommonButton
                          buttonClick={() => {
                            setIsDeleteStage({
                              ...isEditStage,
                              flag: true,
                              item,
                              index: idx,
                            });
                            setIsEditStage({
                              ...isEditStage,
                              flag: false,
                              item: {},
                              index: -1,
                            });
                          }}
                          text={
                            <MdOutlineDeleteForever className="w-4 cursor-pointer hover:text-red-500" />
                          }
                          disabled={item.stage === "expectedDelivery"}
                          className={"p-0 py-0 px-0 border-none"}
                        />
                      </small>
                    </div>
                  </div>
                ),
                description: (
                  <div className="steps-description">
                    <div>
                      <small>
                        {formatDate(item.date)} - {item.time} - {item.city}
                      </small>
                    </div>
                    {item?.dispatchedStages?.map((item, idx) => {
                      return (
                        <div key={idx} style={{ lineHeight: "12px" }}>
                          <small>{item.title}</small>
                          <small>
                            {formatDate(item.date)} - {item.time} - {item.city}
                          </small>
                        </div>
                      );
                    })}
                    <CommonButton
                      buttonClick={() =>
                        setCurrentStatusForm(!currentStatusForm)
                      }
                      className={"py-0 px-0 p-0 text-xs"}
                      type={"button"}
                      text={"Add Current Stage"}
                    ></CommonButton>

                    {currentStatusForm && (
                      <form onSubmit={handleSubmit} className="w-[400px]">
                        <div className="flex items-center justify-center gap-2">
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
                              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-40"
                              required
                            />
                          </div>
                        </div>
                        <div className="block">
                          <div
                            div
                            className="flex items-center justify-center gap-2"
                          >
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
                                className="mt-1 block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                            <div className="self-end">
                              <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                ),
              };
            }
            return {
              title: (
                <div className="flex flex-col justify-start items-start">
                  <div className="">
                    {splitCamelCaseAndCapitalize(item?.stage)}
                  </div>{" "}
                  <div className="flex items-center justify-start gap-1">
                    <small
                      onClick={() => {
                        setIsEditStage({
                          ...isEditStage,
                          flag: true,
                          item,
                          index: idx,
                        });
                        setIsDeleteStage({
                          ...isEditStage,
                          flag: false,
                          item: {},
                          index: -1,
                        });
                      }}
                    >
                      {
                        <CurrentStageForm
                          callFunction={handleStepEdit}
                          order={order}
                          btnStyle={"p-0 py-0 px-0 border-none"}
                          btnText={
                            <PencilIcon
                              className="w-3 cursor-pointer hover:text-red-500"
                              // onClick={() => setEditStage(true)}
                            />
                          }
                          btnDisabled={item.stage === "expectedDelivery"}
                        />
                      }
                    </small>
                    <small>
                      <CommonButton
                        buttonClick={() => {
                          setIsDeleteStage({
                            ...isEditStage,
                            flag: true,
                            item,
                            index: idx,
                          });
                          setIsEditStage({
                            ...isEditStage,
                            flag: false,
                            item: {},
                            index: -1,
                          });
                        }}
                        text={
                          <MdOutlineDeleteForever
                            className={`w-4 hover:text-red-500`}
                          />
                        }
                        disabled={item.stage === "expectedDelivery"}
                        className={`p-0 py-0 px-0 border-none`}
                      />
                    </small>
                  </div>
                </div>
              ),
              description: (
                <div>
                  <small>{formatDate(item.date)}</small>
                </div>
              ),
            };
          })}
        />
      )}

      {/* {order?.currentStage === "dispatched" ? (
        <CurrentStageForm order={order} orderStages={orderStages} />
      ) : (
        ""
      )} */}
      {/* <div className="w-full flex justify-center my-4">
        <div className="container w-1/2">
          <p className="text-sm text-gray-600 mt-2">
            Item yet to reach hub nearest to you. {logistic} - FMPC3771877021
          </p>
          <div className="text-sm text-gray-600 mt-2">
            <div className="flex">
              <div className="w-1/4">Wed, 5th Jun</div>
              <div className="w-3/4 flex">
                <div className="w-1/4">3:37 pm</div>
                <div className="w-1/4">Indore</div>
                <div className="w-2/4">
                  Your item has arrived at a Flipkart Facility
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* {isEditStage.flag && (
        <CurrentStageForm
          callFunction={handleStepEdit}
          order={order}
          btnText={"Edit"}
        />
      )} */}
      {isDeleteStage.flag && (
        // <CurrentStageForm callFunction={handleStepDelete} />
        <Modal
          title="Confirm Delete"
          message="Are you sure you want to delete this stage?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleStepDelete}
          cancelAction={() => setIsDeleteStage({})}
          showModal={() => isDeleteStage.flag}
        />
      )}
    </div>
  );
};

export default AdminOrderStages;
