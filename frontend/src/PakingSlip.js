import React from "react";

const dummyOptions = {
  // ... other properties
  items: [
    {
      name: "Item 1",
      code: "ITM001",
      quantity: 2,
      unit: "pcs",
      pricePerUnit: "500.00",
      gst: 18,
      amount: "1180.00",
      image: "https://via.placeholder.com/50", // Example image URL
    },
    {
      name: "Item 2",
      code: "ITM002",
      quantity: 1,
      unit: "pcs",
      pricePerUnit: "1000.00",
      gst: 18,
      amount: "1180.00",
      image: "https://via.placeholder.com/50", // Example image URL
    },
  ],
};

const Invoice = () => {
  const options = dummyOptions;

  const getDeliveryItemsHTML = (items) => {
    return items.map((item, index) => (
      <div className="table-row items-center border-b" key={index}>
        <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
          {index + 1}
        </div>
        <div className="table-cell py-2 px-4 border-x-2 border-white w-1/12 text-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 object-cover"
          />
        </div>
        <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-4/12">
          {item.name}
        </div>
        <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-3/12">
          {item.code}
        </div>
        <div className="table-cell text-end py-2 px-4 border-x-2 border-white w-1/12 text-sm">
          {item.quantity}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-10 text-xs">
      <div className="flex items-start justify-end">
        <div className="flex items-end flex-col">
          <div className="pb-16">
            <h1 className="font-bold text-4xl text-orange-400 pb-1">
              PACKAGE SLIP
            </h1>
            <p className="text-right text-gray-500 text-xl">
              Package# - {options.orderId}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex-1">
          <div className="w-60 pl-4 pb-2">
            <p>F-400, Sudershan Park, Uttam Nagar, New Delhi</p>
            <p>Phone no. : 9711996214, 9654866346</p>
            <p>GSTIN : 07AKLPM6608H1ZX</p>
            <p>State: 07-Delhi</p>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col items-end">
            <p className="text-gray-500 py-1">Order Date:</p>
          </div>
          <div className="flex flex-col items-end w-[12rem] text-right">
            <p className="py-1">{options.date}</p>
          </div>
        </div>
      </div>

      <div className="table w-full pb-4">
        <div className="table-header-group bg-orange-500 text-white">
          <div className="table-row flex items-center">
            <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              #
            </div>
            <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              Image
            </div>
            <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-4/12">
              Item name
            </div>
            <div className="table-cell text-left py-2 px-4 border-x-2 border-white w-3/12">
              Item code
            </div>
            <div className="table-cell text-end py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              Quantity
            </div>
          </div>
        </div>
        <div className="table-row-group">
          {getDeliveryItemsHTML(options.items)}
        </div>
      </div>
      <div class=" pt-20 pr-4 text-right">
        <p class="text-gray-400">
          Total: <span class="pl-24 text-black">{options.total}44</span>
        </p>
      </div>

      <div className="py-6 px-4">
        <p className="text-gray-400 pb-2">Notes:</p>
        <p>{options.notes}</p>
      </div>
      <div className="px-4">
        <p className="text-gray-400 pb-2">Terms:</p>
        <p>{options.terms}</p>
      </div>
    </div>
  );
};

export default Invoice;
