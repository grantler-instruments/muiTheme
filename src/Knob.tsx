import { useCallback, useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";

export interface KnobProps {
  /** Controlled value */
  value: number;
  /** Called when value changes */
  onChange?: (newValue: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Diameter in px */
  size?: number;
  /** Optional label below the knob */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** MUI palette color key (e.g. "primary", "secondary", "error") */
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /** Start angle in degrees (default 225 = bottom-left) */
  startAngle?: number;
  /** End angle in degrees (default 135 = 270° clockwise sweep from start) */
  endAngle?: number;
  /** Px of drag per full range */
  sensitivity?: number;
}

/**
 * Knob — a MUI-themed rotary knob component.
 *
 * Supports mouse drag, touch drag, scroll wheel, click-on-arc, and keyboard
 * (Arrow Up/Down/Left/Right, Home, End). Accessible via role="slider".
 */
export function Knob({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 56,
  label,
  disabled = false,
  color = "primary",
  startAngle = 225,
  endAngle = 135,
  sensitivity = 200,
}: KnobProps) {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startY: number; startValue: number } | null>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const snap = (v: number) => {
    const snapped = Math.round((v - min) / step) * step + min;
    return clamp(parseFloat(snapped.toFixed(10)));
  };

  const norm = (v: number) => (v - min) / (max - min);

  const totalSweep = ((endAngle - startAngle + 360) % 360) || 360;
  const valueToAngle = (v: number) => {
    const a = startAngle + norm(v) * totalSweep;
    return ((a % 360) + 360) % 360;
  };

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const polarToXY = (
    angleDeg: number,
    r: number,
    cx: number,
    cy: number
  ) => {
    const rad = toRad(angleDeg - 90);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const palette = theme.palette[color] ?? theme.palette.primary;
  const trackColor = theme.palette.action.disabledBackground;
  const activeColor = disabled ? theme.palette.action.disabled : palette.main;
  const bgColor = theme.palette.background.paper;

  const strokeWidth = Math.max(3, size * 0.08);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2 - 2;

  const buildArc = (fromAngle: number, toAngle: number) => {
    const start = polarToXY(fromAngle, r, cx, cy);
    const end = polarToXY(toAngle, r, cx, cy);
    const angleDiff = ((toAngle - fromAngle) + 360) % 360;
    const largeArc = angleDiff > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const trackPath = buildArc(startAngle, endAngle);
  const activePath = buildArc(startAngle, valueToAngle(value));

  const indicatorAngle = valueToAngle(value);
  const indicatorR = r * 0.55;
  const indicatorPos = polarToXY(indicatorAngle, indicatorR, cx, cy);

  const emit = useCallback(
    (v: number) => {
      const next = snap(v);
      if (next !== value) onChange?.(next);
    },
    [value, onChange, min, max, step]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      dragRef.current = { startY: e.clientY, startValue: value };

      const onMove = (me: MouseEvent) => {
        if (!dragRef.current) return;
        const dy = dragRef.current.startY - me.clientY;
        const delta = (dy / sensitivity) * (max - min);
        emit(dragRef.current.startValue + delta);
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragRef.current = null;
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [disabled, value, emit, sensitivity, min, max]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      const touch = e.touches[0];
      dragRef.current = { startY: touch.clientY, startValue: value };

      const onMove = (te: TouchEvent) => {
        if (!dragRef.current || !te.touches[0]) return;
        const t = te.touches[0];
        const dy = dragRef.current.startY - t.clientY;
        const delta = (dy / sensitivity) * (max - min);
        emit(dragRef.current.startValue + delta);
      };

      const onEnd = () => {
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        dragRef.current = null;
      };

      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd);
    },
    [disabled, value, emit, sensitivity, min, max]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (disabled) return;
      e.preventDefault();
      const dir = e.deltaY < 0 ? 1 : -1;
      emit(value + dir * step);
    },
    [disabled, value, emit, step]
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (disabled || dragRef.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left - cx;
      const my = e.clientY - rect.top - cy;
      let clickAngle = (Math.atan2(my, mx) * 180) / Math.PI + 90;
      if (clickAngle < 0) clickAngle += 360;

      let offset = ((clickAngle - startAngle) + 360) % 360;
      if (offset > totalSweep) {
        offset = offset - totalSweep < totalSweep / 2 ? totalSweep : 0;
      }
      const newValue = min + (offset / totalSweep) * (max - min);
      emit(newValue);
    },
    [disabled, cx, cy, startAngle, totalSweep, min, max, emit]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        emit(value + step);
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        emit(value - step);
      } else if (e.key === "Home") {
        e.preventDefault();
        emit(min);
      } else if (e.key === "End") {
        e.preventDefault();
        emit(max);
      }
    },
    [disabled, value, emit, step, min, max]
  );

  return (
    <Box
      display="inline-flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      sx={{ userSelect: "none" }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={onSvgClick}
        onKeyDown={onKeyDown}
        style={{
          cursor: disabled ? "not-allowed" : "grab",
          outline: "none",
          display: "block",
        }}
        onFocus={(e) => {
          e.currentTarget.style.filter = `drop-shadow(0 0 ${strokeWidth}px ${palette.main}80)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.filter = "none";
        }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r - strokeWidth / 2}
          fill={bgColor}
          stroke={theme.palette.divider}
          strokeWidth={1}
        />
        <path
          d={trackPath}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={activePath}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle
          cx={indicatorPos.x}
          cy={indicatorPos.y}
          r={strokeWidth * 0.7}
          fill={activeColor}
        />
      </svg>

      {label && (
        <Typography
          variant="caption"
          color={disabled ? "text.disabled" : "text.secondary"}
          sx={{ lineHeight: 1 }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}
