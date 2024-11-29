import { PhoneIcon } from "@heroicons/react/24/outline";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";

const UpperHeader = () => {
  return (
    <div className="upperHeader bg-blue-950 h-10 items-center justify-between md:px-20 flex max-w-8xl px-4 sm:px-6 lg:px-2">
      <div className="upperHeaderLeftBox flex flex-wrap gap-2 md:gap-7 text-white text-xs sm:text-sm">
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2" />
          <span>+91 9654866346</span>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1 sm:mr-2" />
          <span>+91 9015251243</span>
        </div>
        <div className="flex items-center">
          <span>example@example.com</span>
        </div>
      </div>
      <div className="upperHeaderRightBox flex gap-2 md:gap-7 text-white">
        <div className="flex items-center">
          <FaXTwitter className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer" />
        </div>
        <div className="flex items-center">
          <CiFacebook className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer" />
        </div>
        <div className="flex items-center">
          <FaYoutube className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default UpperHeader;
