import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

export type PanCoordinates = { x: number; y: number };

export function usePanZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [pan, setPan] = useState<PanCoordinates>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hasDraggedRef = useRef(false);

  // Keep a ref to latest state so callbacks and window event listeners don't become stale
  const stateRef = useRef({ pan, scale, isPressed });
  useEffect(() => {
    stateRef.current = { pan, scale, isPressed };
  }, [pan, scale, isPressed]);

  const handleZoomIn = useCallback(() => {
    setScale((s) => Math.min(Number((s * 1.15).toFixed(3)), 2.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((s) => Math.max(Number((s * 0.85).toFixed(3)), 0.2));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const handleSetScale = useCallback((value: number) => {
    setScale(Math.min(Math.max(Number(value.toFixed(3)), 0.2), 2.5));
  }, []);

  // Zoom centered around client coordinates (e.g. mouse cursor or center)
  const zoomAt = useCallback(
    (nextScaleTarget: number, clientX: number, clientY: number) => {
      const el = containerRef.current;
      const currentScale = stateRef.current.scale;
      const currentPan = stateRef.current.pan;
      const nextScale = Math.min(
        Math.max(Number(nextScaleTarget.toFixed(3)), 0.2),
        2.5,
      );

      if (nextScale === currentScale) return;

      if (!el) {
        setScale(nextScale);
        return;
      }

      const rect = el.getBoundingClientRect();
      const cursorX = clientX - rect.left;
      const cursorY = clientY - rect.top;

      // Keep point under cursor invariant:
      // (cursorX - currentPan.x) / currentScale = (cursorX - newPan.x) / nextScale
      const newPanX =
        cursorX - (cursorX - currentPan.x) * (nextScale / currentScale);
      const newPanY =
        cursorY - (cursorY - currentPan.y) * (nextScale / currentScale);

      setScale(nextScale);
      setPan({
        x: Math.round(newPanX),
        y: Math.round(newPanY),
      });
    },
    [containerRef],
  );

  const handleMouseDown = useCallback((e: MouseEvent<HTMLElement>) => {
    // Only drag with left click (0) or middle click (1)
    if (e.button !== 0 && e.button !== 1) return;

    const target = e.target as HTMLElement;
    if (
      target.closest(
        "button,a,input,select,textarea,[data-no-pan],[data-no-position-drag]",
      )
    ) {
      return;
    }

    setIsPressed(true);
    hasDraggedRef.current = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPan = { ...stateRef.current.pan };

    const handlePointerMove = (moveEvent: PointerEvent | globalThis.MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (!hasDraggedRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        moveEvent.preventDefault();
        setPan({
          x: Math.round(startPan.x + dx),
          y: Math.round(startPan.y + dy),
        });
      }
    };

    const handlePointerUp = () => {
      setIsPressed(false);
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);

      // Keep hasDraggedRef true briefly so handleClickCapture intercepts unwanted clicks
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 60);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
  }, []);

  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUpOrLeave = useCallback(() => {}, []);

  const handleClickCapture = useCallback((e: MouseEvent<HTMLElement>) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  }, []);

  return {
    scale,
    pan,
    setPan,
    isPressed,
    isDragging,
    zoomAt,
    handlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      handleClickCapture,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
      handleSetScale,
      setPan,
      zoomAt,
    },
  };
}
