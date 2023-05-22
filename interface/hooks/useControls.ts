import { useEffect, useRef, useState } from "react";
import { XYPos } from "utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const ACCELERATION = -0.0005;
const MAX_SPEED = 1;
const ZOOM_DURATION = 1000;
const MIN_ZOOM = 1;

function easeOutExpo(
  elapsed: number,
  initialValue: number,
  amountOfChange: number,
  duration: number
): number {
  return elapsed === duration
    ? initialValue + amountOfChange
    : amountOfChange * (-Math.pow(2, (-10 * elapsed) / duration) + 1) +
        initialValue;
}

function useCanvasControls(ref: React.MutableRefObject<HTMLCanvasElement>) {
  const router = useRouter();

  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const [zoom, _setZoom] = useState(6);

  useEffect(() => {
    const posQuery = router.asPath  ;
    if (posQuery) {
      console.log(posQuery)
      let [, x, y, zoom] = /@(.*),(.*)\?z=(.*)/.exec(posQuery);
      console.log("AAA", x, y, zoom);
      setCenterPos({ x: Number(x), y: Number(y) });
      setZoom(Number(zoom));
    }
  }, []);

  const setZoom = (zoom: number) => {
    _setZoom(Math.max(1, zoom));
  };

  const updateUrl = (x, y, zoom) => {
    router.replace(
      location.href.replace(/@.*/, "") + `@${Math.round(x)},${Math.round(y)}?z=${zoom.toFixed(1)}`, undefined, { shallow: true }
    )
  }

  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastMouseEventTime, setLastMouseEventTime] = useState<number>(null);
  const [mouseSpeed, setMouseSpeed] = useState({ x: 0, y: 0 });
  const lastMomentumRAF = useRef<number>(null);
  const destinationZoom = useRef<number>(null);

  function momentum(
    initialSpeed: { x: number; y: number },
    initialPosition: { x: number; y: number },
    startTime?: number,
    timestamp?: number
  ) {
    if (startTime === undefined) {
      startTime = performance.now();
      timestamp = performance.now();
      let v = Math.sqrt(initialSpeed.x ** 2 + initialSpeed.y ** 2);
      let cappedVelocity = Math.min(v, MAX_SPEED);
      let decreaseRatio = cappedVelocity / v;
      initialSpeed = {
        x: initialSpeed.x * decreaseRatio,
        y: initialSpeed.y * decreaseRatio,
      };
    }

    let timeElapsed = timestamp - startTime;

    let velocity = Math.sqrt(initialSpeed.x ** 2 + initialSpeed.y ** 2);

    let accelerations = {
      x: (initialSpeed.x / velocity) * ACCELERATION,
      y: (initialSpeed.y / velocity) * ACCELERATION,
    };

    setCenterPos({
      x:
        initialPosition.x +
        initialSpeed.x * timeElapsed +
        (accelerations.x * timeElapsed ** 2) / 2,
      y:
        initialPosition.y +
        initialSpeed.y * timeElapsed +
        (accelerations.y * timeElapsed ** 2) / 2,
    });

    if (timeElapsed <= Math.abs(velocity / ACCELERATION)) {
      lastMomentumRAF.current = window.requestAnimationFrame((time) => {
        momentum(initialSpeed, initialPosition, startTime, time);
      });
    }
  }

  const lastZoomRAF = useRef<number>(null);

  function animateZoom(
    dest: number,
    initialZoom: number,
    startTime?: number,
    timestamp?: number
  ) {
    if (startTime === undefined) {
      startTime = performance.now();
      timestamp = performance.now();
      lastZoomRAF.current = window.requestAnimationFrame((time) => {
        animateZoom(dest, initialZoom, startTime, time);
      });
      return;
    }

    let timeElapsed = timestamp - startTime;
    setZoom(
      easeOutExpo(timeElapsed, initialZoom, dest - initialZoom, ZOOM_DURATION)
    );

    if (timeElapsed < ZOOM_DURATION) {
      lastZoomRAF.current = window.requestAnimationFrame((time) => {
        animateZoom(dest, initialZoom, startTime, time);
      });
    } else {
      updateUrl(centerPos.x, centerPos.y, Math.max(1, dest))
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLastMousePos({ x: e.clientX, y: e.clientY });
    if (lastMomentumRAF.current !== null) {
      window.cancelAnimationFrame(lastMomentumRAF.current);
    }
    setDragging(true);
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (Date.now() - lastMouseEventTime <= 50) {
      momentum(mouseSpeed, centerPos);
    }
    updateUrl(centerPos.x, centerPos.y, zoom)
  };

  const handleMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (dragging) {
      const mouseDelta = {
        x: e.clientX - lastMousePos.x,
        y: e.clientY - lastMousePos.y,
      };
      setCenterPos({
        x: centerPos.x + mouseDelta.x / zoom,
        y: centerPos.y + mouseDelta.y / zoom,
      });
      setMouseSpeed({
        x: mouseDelta.x / (Date.now() - lastMouseEventTime) / zoom,
        y: mouseDelta.y / (Date.now() - lastMouseEventTime) / zoom,
      });
      setLastMouseEventTime(Date.now());

    }
    setLastMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleWheel = (e: WheelEvent) => {
    if (lastZoomRAF.current !== null) {
      window.cancelAnimationFrame(lastZoomRAF.current);
    }
    destinationZoom.current = Math.max(
      0.5,
      Math.min(
        32,
        (destinationZoom.current ?? zoom) +
          (destinationZoom.current ?? zoom) * (e.deltaY * -0.005)
      )
    );
    animateZoom(destinationZoom.current, zoom);
  };

  useEffect(() => {
    let canvas = ref.current;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("wheel", handleWheel);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("wheel", handleWheel);
    };
  });

  return {
    zoom,
    centerPos,
    mousePos: lastMousePos,
  };
}

export default useCanvasControls;
