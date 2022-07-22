import { useCallback, useEffect, useRef } from "react";
import { useEvent } from "react-use";
import { getClosestGestureByPattern, PatternConstructor, Gesture } from "core";

/**
 * Recognize gestures and send events
 * @param gestures array of gestures to recognize
 * @param sensitivity sensitivity [-3, 3]
 * @param mouse use mouse for gesture
 * @param onChange called when gesture is recognized
 * @param onRelease called when fingers are released
 */
export function useGestureRecognizer(
  gestures: Gesture[],
  sensitivity: number,
  mouse: boolean,
  onChange: (gesture: Gesture | null) => void,
  onRelease: (gesture: Gesture | null) => void
): void {
  const patternConstructor = useRef(new PatternConstructor(0.12, 60));
  useEffect(() => {
    const differenceThreshold =
      0.12 + sensitivity * (sensitivity <= 0 ? 0.03 : 0.1);
    const distanceThreshold = 60 - sensitivity * 8;
    console.log(
      "apply sensitivity",
      sensitivity,
      differenceThreshold,
      distanceThreshold
    );
    patternConstructor.current = new PatternConstructor(
      differenceThreshold,
      distanceThreshold
    );
  }, [sensitivity]);

  const getClosestGesture = useCallback(() => {
    return getClosestGestureByPattern(
      patternConstructor.current.getPattern(),
      new Set(gestures),
      0.12
    );
  }, [gestures]);

  const touchMoveHandler = useCallback(
    (ev: TouchEvent) => {
      // ignore if more than 1 fingers are on screen
      if (ev.touches.length > 1) {
        return;
      }
      const r = patternConstructor.current.addPoint({
        x: ev.touches[0].clientX,
        y: ev.touches[0].clientY,
      });
      if (r >= 2) {
        onChange(getClosestGesture());
      }
    },
    [onChange, getClosestGesture]
  );

  const mouseMoveHandler = useCallback(
    (ev: MouseEvent) => {
      // ignore if mouse gesture is not enabled or not clicked
      if (!mouse || ev.buttons !== 1) {
        return;
      }
      const r = patternConstructor.current.addPoint({
        x: ev.clientX,
        y: ev.clientY,
      });
      if (r >= 2) {
        onChange(getClosestGesture());
      }
    },
    [mouse, onChange, getClosestGesture]
  );

  const releaseHandler = useCallback(() => {
    console.log("release");
    const g = getClosestGesture();
    onRelease(g);
    patternConstructor.current.clear();
  }, [onRelease, getClosestGesture]);

  useEvent("touchmove", touchMoveHandler, undefined, { capture: true });
  useEvent("touchend", releaseHandler, undefined, { capture: true });
  useEvent("mousemove", mouseMoveHandler, undefined, { capture: true });
  useEvent("mouseup", releaseHandler, undefined, { capture: true });
}
