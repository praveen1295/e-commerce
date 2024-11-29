import React from "react";
import { Flex, Spin, Switch } from "antd";
import { FiCommand } from "react-icons/fi";

const Loader = ({ loading }) => {
  const [auto, setAuto] = React.useState(false);
  const [percent, setPercent] = React.useState(-50);
  const timerRef = React.useRef();
  React.useEffect(() => {
    timerRef.current = setTimeout(() => {
      setPercent((v) => {
        const nextPercent = v + 5;
        return nextPercent > 150 ? -50 : nextPercent;
      });
    }, 100);
    return () => clearTimeout(timerRef.current);
  }, [percent]);
  const mergedPercent = auto ? "auto" : percent;
  return (
    <div className="w-full h-auto p-4 flex justify-center items-center">
      {/* <FiCommand className="loading-icon" /> */}
      <Flex align="center" gap="middle">
        {/* <Switch
        checkedChildren="Auto"
        unCheckedChildren="Auto"
        checked={auto}
        onChange={() => {
          setAuto(!auto);
          setPercent(-50);
        }}
      /> */}
        <Spin percent={mergedPercent} tip="Loading" size="large" />
      </Flex>
    </div>
  );
};

export default Loader;
