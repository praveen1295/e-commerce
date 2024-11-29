import React from "react";
const dummyOptions = {
  name: "Ecommerce",
  address1: "123 Main Street",
  address2: "Suite 400",
  customerName: "John Doe",
  orderId: "INV-12345",
  date: "2024-08-01",
  paymentTerms: "Net 30",
  balanceDue: "1500.00",
  total: "1500.00",
  notes: "Thank you for your business!",
  terms: "Payment is due within 30 days.",
  items: [
    {
      name: "Item 1",
      code: "ITM001",
      quantity: 2,
      unit: "pcs",
      pricePerUnit: "500.00",
      gst: 18,
      amount: "1180.00",
    },
    {
      name: "Item 2",
      code: "ITM002",
      quantity: 1,
      unit: "pcs",
      pricePerUnit: "1000.00",
      gst: 18,
      amount: "1180.00",
    },
  ],
};
const Invoice = ({}) => {
  const options = dummyOptions;
  const getDeliveryItemsHTML = (items) => {
    return items.map((item, index) => (
      <div className="table-row" key={index}>
        <div className="table-cell text-left py-2 px-4 ">{index + 1}</div>
        <div className="table-cell text-left py-2 px-4 ">{item.name}</div>
        <div className="table-cell text-left py-2 px-4 ">{item.code}</div>
        <div className="table-cell text-center ">{item.quantity}</div>
        <div className="table-cell text-center ">{item.unit}</div>
        <div className="table-cell text-end ">₹{item.pricePerUnit}</div>
        <div className="table-cell text-end ">{item.gst}%</div>
        <div className="table-cell text-end px-4">₹{item.amount}</div>
      </div>
    ));
  };

  return (
    <div className="p-10" style={{ fontSize: "10px" }}>
      {/* Logo and Other info */}
      <div className="flex items-center justify-center">
        <div className="flex-1">
          <div className="w-60 pl-4 pb-2">
            <h2 className="font-bold text-xl">Solution Forever</h2>

            <p>F-400, Sudershan Park, Uttam Nagar, New Delhi</p>
            <p>Phone no. : 9711996214, 9654866346</p>
            <p>GSTIN : 07AKLPM6608H1ZX</p>
            <p>State: 07-Delhi</p>
          </div>
        </div>
        <div className=" flex justify-end w-60 pb-2">
          <img className="w-40" src="../assets/biotronixLogo.png" alt="Logo" />
        </div>
      </div>

      <hr className="border-t-2 border-blue-400" />
      <h2 className="text-blue-400 text-center text-2xl py-2 font-bold">
        Tax Invoice
      </h2>

      <div className="flex items-center justify-center">
        <div className="flex-1">
          <div className="w-60 pl-4 pb-2 hidden">
            <h2 className="font-bold text-xl">Solution Forever</h2>
            <p>F-400, Sudershan Park, Uttam Nagar, New Delhi</p>
            <p>Phone no. : 9711996214, 9654866346</p>
            <p>GSTIN : 07AKLPM6608H1ZX</p>
            <p>State: 07-Delhi</p>
          </div>
        </div>
        <div className="flex flex-col text-end justify-end w-60 pb-2 pr-4">
          <h4 className="text-xl py-1 font-bold">Invoice Detail</h4>
          <p>Invoice no.: 1857</p>
          <p>Date : 29-07-2024</p>
        </div>
      </div>

      {/* Items List */}
      <div className="table w-full pb-4">
        <div className="table-header-group bg-blue-500 text-white">
          <div className="table-row">
            <div className="table-cell text-left py-2 px-4">#</div>
            <div className="table-cell text-left py-2 px-4 ">Item name</div>
            <div className="table-cell text-left py-2 px-4 ">Item code</div>
            <div className="table-cell text-center ">Quantity</div>
            <div className="table-cell text-center ">Unit</div>
            <div className="table-cell text-end ">Price/ unit</div>
            <div className="table-cell text-end ">GST</div>
            <div className="table-cell text-end px-4">Amount</div>
          </div>
        </div>
        <div className="table-row-group">
          {getDeliveryItemsHTML(options.items)}
        </div>
      </div>

      <div className="flex justify-center gap-4 w-full">
        <div className="flex-1 w-60">
          <div className="pl-4 pb-2">
            <p className="font-bold py-1">Description</p>
            <p className="py-1 text-wrap">
              courier mark se bhejna sab , payment pending, traction machine
              already sent
            </p>
          </div>
        </div>
        <div className="flex justify-between w-60">
          <div className="flex flex-col pb-2">
            <p className="py-1">Sub Total</p>
            <p className="py-1">IGST@12%</p>
            <p className="py-1">IGST@18%</p>
          </div>
          <div className="flex flex-col text-end justify-end pb-2 pr-4">
            <p className="py-1">₹ 1254</p>
            <p className="py-1">₹ 1857</p>
            <p className="py-1">₹1564</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center w-full ">
        <div className="flex-1 w-60">
          <div className="pl-4 pb-2">
            <p className="font-bold py-1">Invoice Amount In Words</p>
            <p className="py-1">
              Twenty Five Thousand One Hundred Sixty Rupees only
            </p>
          </div>
        </div>
        <div className="flex justify-between w-60">
          <div className="flex flex-col pb-2 w-1/2">
            <p className="py-1 bg-blue-400 text-white">Total</p>
            <p className="py-1">Payment mode</p>
          </div>
          <div className="flex flex-col text-end justify-end pb-2 w-1/2">
            <p className="py-1 bg-blue-400 text-white pr-4">₹ 1254</p>
            <div className="px-4">
              <p className="py-1 ">Card</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Other info */}
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

// Dummy data for testing

export default Invoice;
