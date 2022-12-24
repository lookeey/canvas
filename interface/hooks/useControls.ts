import { useEffect, useRef, useState } from "react";
import { XYPos } from "utils/types";

const ACCELERATION = -0.0005;
const MAX_SPEED = 1;
const ZOOM_DURATION = 1000;

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
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const [zoom, _setZoom] = useState(2);
  const setZoom = (zoom: number) => {
    _setZoom(Math.max(0.5, Math.min(zoom)));
  };

  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastMouseEventTime, setLastMouseEventTime] = useState<number>(null);
  const [mouseSpeed, setMouseSpeed] = useState({ x: 0, y: 0 });
  const lastMomentumRAF = useRef<number>(null);
  const destinationZoom = useRef<number>(null);

  function momentum(
    initialSpeed: XYPos,
    initialPosition: XYPos,
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
        x: mouseDelta.x / (Date.now() - lastMouseEventTime),
        y: mouseDelta.y / (Date.now() - lastMouseEventTime),
      });
      setLastMouseEventTime(Date.now());
      setLastMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (lastZoomRAF.current !== null) {
      window.cancelAnimationFrame(lastZoomRAF.current);
    }
    destinationZoom.current = Math.max(
      0.5,
      Math.min(32, destinationZoom.current + e.deltaY * -0.005)
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
  };
}

export default useCanvasControls;
