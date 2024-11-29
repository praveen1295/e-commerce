import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";

const BankDetailsModal = ({
  isOpen,
  onClose,
  bankDetails,
  setReferenceNumber,
  referenceNumber,
  handleTransfer,
}) => {
  // const handleTransfer = () => {
  //   // Implement the transfer logic here
  //   console.log("Reference Number:", referenceNumber);
  //   onClose(); // Close the modal after the transfer
  // };

  return (
    <Modal
      title="Bank Details"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleTransfer}>
          Confirm Transfer
        </Button>,
      ]}
    >
      {bankDetails ? (
        <div>
          <div className="mb-4">
            <p className="font-semibold">Bank Name:</p>
            <p>{bankDetails.bankName}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Account Number:</p>
            <p>{bankDetails.accountNumber}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">IFSC Code:</p>
            <p>{bankDetails.ifscCode}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Account Holder Name:</p>
            <p>{bankDetails.accountHolderName}</p>
          </div>
          <div className="mb-4">
            <label className="font-semibold" htmlFor="referenceNumber">
              Reference Number:
            </label>
            <Input
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number"
            />
          </div>
        </div>
      ) : (
        <p>Loading bank details...</p>
      )}
    </Modal>
  );
};

export default BankDetailsModal;
