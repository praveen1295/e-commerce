import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

// import { XIcon } from "@heroicons/react/24/outline";

const AdminOrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [status, setStatus] = useState(order?.status || "");
  const [trackingId, setTrackingId] = useState(order?.trackingId || "");
  const [packingSlip, setPackingSlip] = useState(order?.packingSlip || "");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleTrackingIdChange = (e) => {
    setTrackingId(e.target.value);
  };

  const handlePackingSlipChange = (e) => {
    setPackingSlip(e.target.value);
  };

  const handleSave = () => {
    onUpdateStatus({ ...order, status, trackingId, packingSlip });
  };

  if (!order) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        >
          {/* <XIcon className="w-6 h-6" /> */}
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6">Order Details</h2>
        <div className="space-y-4">
          <div>
            <strong className="block text-lg">Order ID:</strong>
            <span>{order.id}</span>
          </div>
          <div>
            <strong className="block text-lg">Items:</strong>
            <ul className="list-disc pl-5">
              {order.items.map((item, index) => (
                <li key={index} className="mb-2">
                  <div>
                    {item.product.title} - #{item.quantity} - $
                    {item.product.discountPrice.ordered}
                  </div>
                  {item.packingSlip && (
                    <div className="text-gray-500">
                      Packing Slip: {item.packingSlip}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="block text-lg">Total Amount:</strong>
            <span>${order.totalAmount}</span>
          </div>
          <div>
            <strong className="block text-lg">Shipping Address:</strong>
            <address>
              {order.selectedAddress.name}, {order.selectedAddress.street},{" "}
              {order.selectedAddress.city}, {order.selectedAddress.state},{" "}
              {order.selectedAddress.pinCode}, {order.selectedAddress.phone}
            </address>
          </div>
          <div>
            <strong className="block text-lg">Status:</strong>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="pending">Pending</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <strong className="block text-lg">Tracking ID:</strong>
            <input
              type="text"
              value={trackingId}
              onChange={handleTrackingIdChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>
          <div>
            <strong className="block text-lg">Packing Slip:</strong>
            <input
              type="text"
              value={packingSlip}
              onChange={handlePackingSlipChange}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AdminOrderDetailModal;
