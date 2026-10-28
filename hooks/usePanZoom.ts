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

  // Track all active pointers by pointerId for multi-touch (pinch-zoom, multi-finger pan)
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(
    new Map(),
  );

  // Drag state for single-pointer panning
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPan: PanCoordinates;
  } | null>(null);

  // Pinch state for two-finger zooming and panning
  const pinchStateRef = useRef<{
    initialDistance: number;
    initialScale: number;
    initialPan: PanCoordinates;
    initialMidpoint: { x: number; y: number };
  } | null>(null);

  // Double-tap tracking for mobile
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null,
  );

  // Momentum / inertia tracking for touch flicks
  const momentumRef = useRef<{
    lastTime: number;
    lastX: number;
    lastY: number;
    vx: number;
    vy: number;
    rafId: number | null;
  }>({
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    rafId: null,
  });

  const cancelInertia = useCallback(() => {
    if (momentumRef.current.rafId !== null) {
      cancelAnimationFrame(momentumRef.current.rafId);
      momentumRef.current.rafId = null;
    }
    momentumRef.current.vx = 0;
    momentumRef.current.vy = 0;
  }, []);

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

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Allow primary (left) or middle button for mouse
      if (e.pointerType === "mouse" && e.button !== 0 && e.button !== 1) return;

      cancelInertia();

      const target = e.target as HTMLElement;
      const isNoPan = Boolean(
        target.closest("[data-no-pan],input,select,textarea"),
      );

      // Double-tap zoom detection on mobile touch
      if (e.pointerType === "touch" && !isNoPan) {
        const now = performance.now();
        const lastTap = lastTapRef.current;
        if (
          lastTap &&
          now - lastTap.time < 320 &&
          Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 32
        ) {
          lastTapRef.current = null;
          hasDraggedRef.current = true;
          const currentScale = stateRef.current.scale;
          if (currentScale < 1.15) {
            zoomAt(1.45, e.clientX, e.clientY);
          } else {
            zoomAt(0.9, e.clientX, e.clientY);
          }
          return;
        }
        lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
      }

      activePointersRef.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
      });

      // Two-finger touch detected -> activate multi-touch pinch-to-zoom
      if (activePointersRef.current.size === 2) {
        const pts = Array.from(activePointersRef.current.values());
        const p1 = pts[0];
        const p2 = pts[1];
        const initialDistance = Math.max(
          Math.hypot(p2.x - p1.x, p2.y - p1.y),
          1,
        );
        const initialMidpoint = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };

        pinchStateRef.current = {
          initialDistance,
          initialScale: stateRef.current.scale,
          initialPan: { ...stateRef.current.pan },
          initialMidpoint,
        };
        dragStateRef.current = null;
        hasDraggedRef.current = true;
        setIsPressed(true);
        setIsDragging(true);
        return;
      }

      // Single pointer touch or click
      if (activePointersRef.current.size === 1) {
        if (isNoPan) return;

        dragStateRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startY: e.clientY,
          startPan: { ...stateRef.current.pan },
        };
        momentumRef.current.lastTime = performance.now();
        momentumRef.current.lastX = e.clientX;
        momentumRef.current.lastY = e.clientY;
        momentumRef.current.vx = 0;
        momentumRef.current.vy = 0;

        setIsPressed(true);
        hasDraggedRef.current = false;
      }
    },
    [cancelInertia, zoomAt],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // Fallback for non-pointer browsers
      if (e.button !== 0 && e.button !== 1) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-no-pan],input,select,textarea")) return;
      if (activePointersRef.current.size > 0) return;

      cancelInertia();
      dragStateRef.current = {
        pointerId: -999,
        startX: e.clientX,
        startY: e.clientY,
        startPan: { ...stateRef.current.pan },
      };
      setIsPressed(true);
      hasDraggedRef.current = false;
    },
    [cancelInertia],
  );

  // Global window listeners for movement, pinch, and pointer release / cancel
  useEffect(() => {
    const onWindowPointerMove = (e: globalThis.PointerEvent) => {
      if (!activePointersRef.current.has(e.pointerId)) return;
      activePointersRef.current.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
      });

      // 1. Pinch-to-zoom with 2 fingers
      if (activePointersRef.current.size >= 2 && pinchStateRef.current) {
        const pts = Array.from(activePointersRef.current.values());
        const p1 = pts[0];
        const p2 = pts[1];
        const currentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const currentMidpoint = {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2,
        };

        const {
          initialDistance,
          initialScale,
          initialPan,
          initialMidpoint,
        } = pinchStateRef.current;
        const scaleRatio = currentDistance / initialDistance;
        const nextScaleTarget = initialScale * scaleRatio;
        const nextScale = Math.min(
          Math.max(Number(nextScaleTarget.toFixed(3)), 0.2),
          2.5,
        );

        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const initialCursorX = initialMidpoint.x - rect.left;
          const initialCursorY = initialMidpoint.y - rect.top;
          const currentCursorX = currentMidpoint.x - rect.left;
          const currentCursorY = currentMidpoint.y - rect.top;

          const worldX = (initialCursorX - initialPan.x) / initialScale;
          const worldY = (initialCursorY - initialPan.y) / initialScale;

          const newPanX = currentCursorX - worldX * nextScale;
          const newPanY = currentCursorY - worldY * nextScale;

          setScale(nextScale);
          setPan({
            x: Math.round(newPanX),
            y: Math.round(newPanY),
          });
        } else {
          setScale(nextScale);
        }
        return;
      }

      // 2. Single Pointer Drag
      const drag = dragStateRef.current;
      if (drag && (drag.pointerId === e.pointerId || drag.pointerId === -999)) {
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        const threshold = e.pointerType === "touch" ? 6 : 3;

        if (
          !hasDraggedRef.current &&
          (Math.abs(dx) > threshold || Math.abs(dy) > threshold)
        ) {
          hasDraggedRef.current = true;
          setIsDragging(true);
        }

        if (hasDraggedRef.current) {
          if (e.cancelable) e.preventDefault();
          setPan({
            x: Math.round(drag.startPan.x + dx),
            y: Math.round(drag.startPan.y + dy),
          });

          // Record momentum for touch release
          const now = performance.now();
          const dt = now - momentumRef.current.lastTime;
          if (dt > 10 && dt < 120) {
            momentumRef.current.vx =
              (e.clientX - momentumRef.current.lastX) / dt;
            momentumRef.current.vy =
              (e.clientY - momentumRef.current.lastY) / dt;
          }
          momentumRef.current.lastTime = now;
          momentumRef.current.lastX = e.clientX;
          momentumRef.current.lastY = e.clientY;
        }
      }
    };

    const handlePointerEnd = (e: globalThis.PointerEvent) => {
      if (!activePointersRef.current.has(e.pointerId)) {
        if (dragStateRef.current?.pointerId === -999) {
          dragStateRef.current = null;
          setIsPressed(false);
          setIsDragging(false);
          setTimeout(() => {
            hasDraggedRef.current = false;
          }, 80);
        }
        return;
      }

      activePointersRef.current.delete(e.pointerId);

      // If one finger remains on screen after pinch-zoom, transition smoothly to 1-finger pan
      if (activePointersRef.current.size === 1) {
        pinchStateRef.current = null;
        const [remainingId, remainingPt] = Array.from(
          activePointersRef.current.entries(),
        )[0];
        dragStateRef.current = {
          pointerId: remainingId,
          startX: remainingPt.x,
          startY: remainingPt.y,
          startPan: { ...stateRef.current.pan },
        };
        momentumRef.current.lastTime = performance.now();
        momentumRef.current.lastX = remainingPt.x;
        momentumRef.current.lastY = remainingPt.y;
        momentumRef.current.vx = 0;
        momentumRef.current.vy = 0;
        return;
      }

      // All fingers lifted
      if (activePointersRef.current.size === 0) {
        const wasDragging = hasDraggedRef.current;
        pinchStateRef.current = null;
        dragStateRef.current = null;
        setIsPressed(false);
        setIsDragging(false);

        // Apply smooth momentum gliding if user flicked on touch device
        if (wasDragging && e.pointerType === "touch") {
          const timeSinceLastMove =
            performance.now() - momentumRef.current.lastTime;
          if (timeSinceLastMove < 80) {
            let vx = momentumRef.current.vx * 16;
            let vy = momentumRef.current.vy * 16;
            const speed = Math.hypot(vx, vy);
            if (speed > 1.2) {
              const maxSpeed = 32;
              if (speed > maxSpeed) {
                const factor = maxSpeed / speed;
                vx *= factor;
                vy *= factor;
              }
              const step = () => {
                vx *= 0.92;
                vy *= 0.92;
                if (Math.hypot(vx, vy) < 0.25) {
                  cancelInertia();
                  return;
                }
                setPan((prev) => ({
                  x: Math.round(prev.x + vx),
                  y: Math.round(prev.y + vy),
                }));
                momentumRef.current.rafId = requestAnimationFrame(step);
              };
              momentumRef.current.rafId = requestAnimationFrame(step);
            }
          }
        }

        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 80);
      }
    };

    const onWindowPointerUp = (e: globalThis.PointerEvent) => {
      handlePointerEnd(e);
    };

    const onWindowPointerCancel = (e: globalThis.PointerEvent) => {
      handlePointerEnd(e);
    };

    window.addEventListener("pointermove", onWindowPointerMove, {
      passive: false,
    });
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerCancel);

    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("pointercancel", onWindowPointerCancel);
      cancelInertia();
    };
  }, [cancelInertia, containerRef]);

  const handleMouseMove = useCallback(() => {}, []);
  const handleMouseUpOrLeave = useCallback(() => {}, []);

  const handleClickCapture = useCallback((e: MouseEvent<HTMLElement>) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
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
