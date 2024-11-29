import React, { useState } from "react";
import apiClient from "../../common/apiClient";
import CommonButton from "../../common/CommonButton";

const InvoiceDownloadBtn = ({ order, type, text }) => {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    try {
      // Explicitly set the response type to 'arraybuffer'
      setLoading(true);
      const response = await apiClient.post(
        `/orders/${type}`,
        { order },
        {
          responseType: "arraybuffer", // Use 'arraybuffer' for binary data
        }
      );
      setLoading(false);

      if (!response || response.status !== 200) {
        throw new Error("Failed to download PDF");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <CommonButton
      type="button"
      buttonClick={handleDownload}
      text={text}
      className="rounded-full"
      loading={loading}
      // bgColor="bg-green-500"
    />
  );
};

export default InvoiceDownloadBtn;
