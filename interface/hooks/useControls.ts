import { useEffect, useRef, useState } from "react";
import { XYPos } from "utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { bi } from "../utils/bigint";
import { useAccount } from "wagmi";
import { useMotionValue, useSpring } from "framer-motion";

const ACCELERATION = -0.0003;
const MAX_SPEED = 1;

const MIN_ZOOM = 1;
const MAX_ZOOM = 32;

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

function useCanvasControls(ref: React.RefObject<HTMLCanvasElement>) {
  const router = useRouter();
  const { isConnected } = useAccount();

  let canvas = ref?.current as HTMLCanvasElement;

  // the viewport's center position in pixels must be stored as a bigint, because it can be very large
  // the offset represents the decimal part of the center position
  const [centerPos, setCenterPos] = useState({ x: 0n, y: 0n });
  const [centerPosOffset, setCenterPosOffset] = useState({ x: 0, y: 0 });

  const _zoom = useMotionValue(0.2)
  const animatedZoom = useSpring(_zoom, {
    damping: 5,
    mass: 0.005,
    stiffness: 100,
  })
  const [effectiveZoom, setEff] = useState(1)
  animatedZoom.on("change", (v) => setEff(MIN_ZOOM + (MAX_ZOOM - MIN_ZOOM) * v **2))
  const setZoom = (zoom: number) => {
    _zoom.set(Math.max(0, Math.min(1, zoom)))
  }



  const [selectedColor, setSelectedColor] = useState(0n);

  useEffect(() => {
    const posQuery = router.asPath;
    if (posQuery) {
      let x, y, zoom;
      let match = /@(.*),(.*)\?z=(.*)/.exec(posQuery);
      if (match) {
        [, x, y, zoom] = match;
        setCenterPos({ x: bi(x), y: bi(y) });
        setZoom(Number(zoom));
      }
    }
  }, []);


  const updateUrl = (x: bigint, y: bigint, zoom: number) => {
    router.replace(
      location.href.replace(/@.*/, "") + `@${x},${y}?z=${zoom.toFixed(1)}`,
      undefined,
      { shallow: true }
    );
  };

  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastMouseEventTime, setLastMouseEventTime] = useState<number>(
    Date.now().valueOf()
  );
  const [mouseSpeed, setMouseSpeed] = useState({ x: 0, y: 0 });
  const lastMomentumRAF = useRef<number | null>(null);
  const destinationZoom = useRef<number | null>(null);
  const [lastMouseDownPos, setLastMouseDownPos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [selectedPixels, setSelectedPixels] = useState<
    { x: bigint; y: bigint; color: bigint }[]
  >([]);

  let hoveredPixel = canvas
    ? {
        x:
          bi(
            Math.floor(
              (lastMousePos.x - canvas.width / 2) / effectiveZoom -
                centerPosOffset.x
            )
          ) + centerPos.x,
        y:
          bi(
            Math.floor(
              (lastMousePos.y - canvas.height / 2) / effectiveZoom -
                centerPosOffset.y
            )
          ) + centerPos.y,
      }
    : { x: 0n, y: 0n };


  function momentum(
    initialSpeed: { x: number; y: number },
    _initialPosition: { x: bigint; y: bigint },
    _initialPositionOffset: { x: number; y: number },
    startTime?: number,
    timestamp?: number
  ) {
    let initialPosition = {
      x: Number(_initialPosition.x % 1000000n) - _initialPositionOffset.x,
      y: Number(_initialPosition.y % 1000000n) - _initialPositionOffset.y,
    };
    if (startTime === undefined) {
      startTime = performance.now();
      timestamp = performance.now();
      let v = Math.sqrt(initialSpeed.x ** 2 + initialSpeed.y ** 2);
      let cappedVelocity = Math.min(v || 1, MAX_SPEED);
      let decreaseRatio = cappedVelocity / (v || 1);
      initialSpeed = {
        x: initialSpeed.x * decreaseRatio,
        y: initialSpeed.y * decreaseRatio,
      };
    }

    let timeElapsed = (timestamp as number) - startTime;

    let velocity = Math.sqrt(initialSpeed.x ** 2 + initialSpeed.y ** 2);

    let accelerations = {
      x: (initialSpeed.x / (velocity || 1)) * ACCELERATION,
      y: (initialSpeed.y / (velocity || 1)) * ACCELERATION,
    };

    let result = {
      x:
        initialPosition.x +
        initialSpeed.x * timeElapsed +
        (accelerations.x * timeElapsed ** 2) / 2,
      y:
        initialPosition.y +
        initialSpeed.y * timeElapsed +
        (accelerations.y * timeElapsed ** 2) / 2,
    };

    setCenterPosOffset({
      x: (result.x > 0 ? 1 : 0) - (result.x % 1),
      y: (result.y > 0 ? 1 : 0) - (result.y % 1),
    });

    setCenterPos({
      x:
        bi(Math.ceil(result.x)) +
        (_initialPosition.x - (_initialPosition.x % 1000000n)),
      y:
        bi(Math.ceil(result.y)) +
        (_initialPosition.y - (_initialPosition.y % 1000000n)),
    });

    if (timeElapsed <= Math.abs(velocity / ACCELERATION)) {
      lastMomentumRAF.current = window.requestAnimationFrame((time) => {
        momentum(
          initialSpeed,
          _initialPosition,
          _initialPositionOffset,
          startTime,
          time
        );
      });
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLastMouseDownPos({ x: e.clientX, y: e.clientY });
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
      momentum(mouseSpeed, centerPos, centerPosOffset);
    }
    updateUrl(centerPos.x, centerPos.y, _zoom.get());

    // detect a click
    if (
      Math.abs(e.clientX - lastMouseDownPos.x) < 3 &&
      Math.abs(e.clientY - lastMouseDownPos.y) < 3 &&
      isConnected
    ) {
      let foundSelectedPixel = selectedPixels.findIndex(
        (a) => a.x === hoveredPixel.x && a.y === hoveredPixel.y
      );
      if (foundSelectedPixel === -1) {
        setSelectedPixels([
          ...selectedPixels,
          { x: hoveredPixel.x, y: hoveredPixel.y, color: selectedColor },
        ]);
      } else if (selectedPixels[foundSelectedPixel].color !== selectedColor) {
        let newSelectedPixels = selectedPixels;
        newSelectedPixels[foundSelectedPixel].color = selectedColor;
        setSelectedPixels(newSelectedPixels);
      } else {
        let newSelectedPixels = selectedPixels;
        newSelectedPixels.splice(foundSelectedPixel, 1);
        setSelectedPixels(newSelectedPixels);
      }
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
      let delta = {
        x: mouseDelta.x / effectiveZoom,
        y: mouseDelta.y / effectiveZoom,
      };
      let deltaPlusOffset = {
        x: delta.x + centerPosOffset.x,
        y: delta.y + centerPosOffset.y,
      };
      setCenterPos({
        x: centerPos.x - bi(Math.floor(deltaPlusOffset.x)),
        y: centerPos.y - bi(Math.floor(deltaPlusOffset.y)),
      });
      setCenterPosOffset({
        x: (deltaPlusOffset.x % 1) + (deltaPlusOffset.x < 0 ? 1 : 0),
        y: (deltaPlusOffset.y % 1) + (deltaPlusOffset.y < 0 ? 1 : 0),
      });
      setMouseSpeed({
        x: -mouseDelta.x / (Date.now() - lastMouseEventTime) / effectiveZoom,
        y: -mouseDelta.y / (Date.now() - lastMouseEventTime) / effectiveZoom,
      });
      setLastMouseEventTime(Date.now());
    }
    setLastMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    setZoom((destinationZoom.current ?? _zoom.get()) -
      (e.deltaY * 0.001))
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
    }
    const moveAmount = e.ctrlKey ? 1n : 30n;

    switch (e.key) {
      case "Escape":
        setSelectedPixels([]);
        break;
      case "+":
      case ".":
        setZoom(_zoom.get() + 0.05);
        break;
      case "-":
      case ",":
        setZoom(_zoom.get() - 0.05);
        break;
      case "ArrowUp":
        setCenterPos({
          x: centerPos.x,
          y: centerPos.y - moveAmount,
        });
        break;
      case "ArrowDown":
        setCenterPos({
          x: centerPos.x,
          y: centerPos.y + moveAmount,
        });
        break;
      case "ArrowLeft":
        setCenterPos({
          x: centerPos.x - moveAmount,
          y: centerPos.y,
        });
        break;
      case "ArrowRight":
        setCenterPos({
          x: centerPos.x + moveAmount,
          y: centerPos.y,
        });
    }
  };

  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLastMouseDownPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    if (lastMomentumRAF.current !== null) {
      window.cancelAnimationFrame(lastMomentumRAF.current);
    }
    if (e.touches.length >= 2) {
      setLastTouchDistance(
        Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        )
      );
      setLastTouchCenter({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      });
    }
    setDragging(true);
  }

  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (Date.now() - lastMouseEventTime <= 50) {
      momentum(mouseSpeed, centerPos, centerPosOffset);
    }
    updateUrl(centerPos.x, centerPos.y, _zoom.get());
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) {
      if (e.touches.length === 1) {
        const mouseDelta = {
          x: e.touches[0].clientX - lastMousePos.x,
          y: e.touches[0].clientY - lastMousePos.y,
        };
        let delta = {
          x: mouseDelta.x / effectiveZoom,
          y: mouseDelta.y / effectiveZoom,
        };
        let deltaPlusOffset = {
          x: delta.x + centerPosOffset.x,
          y: delta.y + centerPosOffset.y,
        };
        setCenterPos({
          x: centerPos.x - bi(Math.floor(deltaPlusOffset.x)),
          y: centerPos.y - bi(Math.floor(deltaPlusOffset.y)),
        });
        setCenterPosOffset({
          x: (deltaPlusOffset.x % 1) + (deltaPlusOffset.x < 0 ? 1 : 0),
          y: (deltaPlusOffset.y % 1) + (deltaPlusOffset.y < 0 ? 1 : 0),
        });
        setMouseSpeed({
          x: -mouseDelta.x / (Date.now() - lastMouseEventTime) / effectiveZoom,
          y: -mouseDelta.y / (Date.now() - lastMouseEventTime) / effectiveZoom,
        });
        setLastMousePos({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        })
      }
      if (e.touches.length >= 2) {
        const touchDistance = Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );
        const zoomDelta = (touchDistance - lastTouchDistance) / 2000;
        setZoom(_zoom.get() + zoomDelta);
        setLastTouchDistance(touchDistance);
        const touchCenter = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        }
        const mouseDelta = {
          x: touchCenter.x - lastTouchCenter.x,
          y: touchCenter.y - lastTouchCenter.y,
        }
        let delta = {
          x: mouseDelta.x / effectiveZoom,
          y: mouseDelta.y / effectiveZoom,
        }
        let deltaPlusOffset = {
          x: delta.x + centerPosOffset.x,
          y: delta.y + centerPosOffset.y,
        }
        setCenterPos({
          x: centerPos.x - bi(Math.floor(deltaPlusOffset.x)),
          y: centerPos.y - bi(Math.floor(deltaPlusOffset.y)),
        });
        setCenterPosOffset({
          x: (deltaPlusOffset.x % 1) + (deltaPlusOffset.x < 0 ? 1 : 0),
          y: (deltaPlusOffset.y % 1) + (deltaPlusOffset.y < 0 ? 1 : 0),
        });
        setLastTouchCenter(touchCenter);
      }
      setLastMouseEventTime(Date.now());
    }
  }

  useEffect(() => {
    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mousemove", handleMove);
      canvas.addEventListener("wheel", handleWheel);
      window.addEventListener("keydown", handleKeyDown);
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchmove", handleTouchMove);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [canvas, handleMouseUp, handleMove, handleWheel]);

  return {
    zoom: effectiveZoom,
    centerPos,
    centerPosOffset,
    mousePos: lastMousePos,
    hoveredPixel,
    selectedColor,
    setSelectedColor,
    selectedPixels,
    clearPixels: () => setSelectedPixels([]),
  };
}

export default useCanvasControls;
