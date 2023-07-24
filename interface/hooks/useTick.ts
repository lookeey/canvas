import { useEffect, useState } from "react";

const useTick = (ms: number) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(tick => tick + 1);
    }, ms);
    return () => clearInterval(timer);
  },[]);
  return tick;
}

export default useTick;