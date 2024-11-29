import { Steps } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";

const { Step } = Steps;

const OrderStages = ({ order, currentStage = "outForDelivery" }) => {
  const [orderStages, setOrderStages] = useState(order?.orderStages || []);

  const splitCamelCaseAndCapitalize = (str) => {
    return str
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Find the index of the current stage
  // const currentStageIndex = orderStages.findIndex(
  //   (stage) => stage.stage === currentStage
  // );

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
    <div className="w-full px-28 my-10">
      {orderStages.length > 1 && (
        <>
          <Steps
            progressDot
            current={order?.orderStages?.length - 1}
            // direction="vertical"
            items={orderStages?.map((item, idx) => {
              if (item.stage === "dispatched") {
                return {
                  title: splitCamelCaseAndCapitalize(item?.stage),
                  description: (
                    <div className="steps-description">
                      <div>
                        <small>
                          {formatDate(item.date)} - {item.time} - {item.city}
                        </small>
                      </div>
                      {item?.dispatchedStages?.map((item, idx) => {
                        return (
                          <div key={idx}>
                            <small>{item.title}</small>
                            <small>
                              {formatDate(item.date)} - {item.time} -{" "}
                              {item.city}
                            </small>
                          </div>
                        );
                      })}
                      {/* <CommonButton
                    buttonClick={() => setCurrentStatusForm(!currentStatusForm)}
                    className={"py-0 px-0 p-0 text-xs"}
                    type={"button"}
                    text={"Add Current Stage"}
                  ></CommonButton> */}

                      {/* {currentStatusForm && (
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
                  )} */}
                    </div>
                  ),
                };
              }
              return {
                title: splitCamelCaseAndCapitalize(item.stage),
                description: (
                  <div>
                    <span>{formatDate(item.date)}</span>
                  </div>
                ),
              };
            })}
          />

          <div className="w-full flex justify-center my-4">
            <div className="container w-1/2">
              <p className="text-sm text-gray-600 mt-2">
                Item yet to reach hub nearest to you. {order.logistics} -{" "}
                {order.trackingId}
              </p>
              <div className="text-sm text-gray-600 mt-2">
                <div className="flex">
                  <div className="w-3/4 flex">
                    <div className="w-2/4">
                      Your item has arrived at a {order.logistics}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStages;
