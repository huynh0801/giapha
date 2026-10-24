import { MouseEvent, PointerEvent, useCallback, useEffect, useRef, useState } from "react";

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

  // Zoom centered around client coordinates (e.g. mouse cursor or viewport center)
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

  const zoomByFactor = useCallback(
    (factor: number, clientX: number, clientY: number) => {
      const targetScale = stateRef.current.scale * factor;
      zoomAt(targetScale, clientX, clientY);
    },
    [zoomAt],
  );

  const handleZoomIn = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      zoomByFactor(1.15, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      setScale((s) => Math.min(Number((s * 1.15).toFixed(3)), 2.5));
    }
  }, [containerRef, zoomByFactor]);

  const handleZoomOut = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      zoomByFactor(0.85, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      setScale((s) => Math.max(Number((s * 0.85).toFixed(3)), 0.2));
    }
  }, [containerRef, zoomByFactor]);

  const handleResetZoom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      zoomAt(1, rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
      setScale(1);
    }
  }, [containerRef, zoomAt]);

  const handleSetScale = useCallback((value: number) => {
    setScale(Math.min(Math.max(Number(value.toFixed(3)), 0.2), 2.5));
  }, []);

  const startDrag = useCallback(
    (clientX: number, clientY: number, target: HTMLElement) => {
      if (
        target.closest(
          "button,a,input,select,textarea,[data-no-pan],[data-no-position-drag]",
        )
      ) {
        return;
      }

      setIsPressed(true);
      hasDraggedRef.current = false;
      const startX = clientX;
      const startY = clientY;
      const startPan = { ...stateRef.current.pan };

      const onPointerMove = (moveEvent: globalThis.PointerEvent | globalThis.MouseEvent) => {
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

      const onPointerUp = () => {
        setIsPressed(false);
        setIsDragging(false);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);

        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 60);
      };

      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("mousemove", onPointerMove, { passive: false });
      window.addEventListener("mouseup", onPointerUp);
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (e.button !== 0 && e.button !== 1) return;
      startDrag(e.clientX, e.clientY, e.target as HTMLElement);
    },
    [startDrag],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0 && e.button !== 1) return;
      startDrag(e.clientX, e.clientY, e.target as HTMLElement);
    },
    [startDrag],
  );

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
    zoomByFactor,
    handlers: {
      handleMouseDown,
      handlePointerDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      handleClickCapture,
      handleZoomIn,
      handleZoomOut,
      handleResetZoom,
      handleSetScale,
      setPan,
      zoomAt,
      zoomByFactor,
    },
  };
}
