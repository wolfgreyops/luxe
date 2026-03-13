# Attributes & Layers Panel — Design Doc

## Summary

Add an **Attributes** panel and a **Layers** panel to the configurator sidebar. Attributes replaces the existing Transform sliders with precise editable inputs (inches, degrees, %). Layers shows all canvas layers with thumbnail, DPI, visibility, lock, delete, and drag-to-reorder.

Both apply to `configurator.html` and `configurator-shopify.html`.

---

## Print Zone Reference

Print area: **14" × 16"** mapped to canvas zone `cw × 0.32` wide by `ch × 0.40` tall.

```
pxPerInch_x = (canvas.width  × 0.32) / 14
pxPerInch_y = (canvas.height × 0.40) / 16
layerWidthIn  = layer.w / pxPerInch_x
layerHeightIn = layer.h / pxPerInch_y
dpi = Math.round(layer.original.width / layerWidthIn)
```

DPI color coding: green ≥ 150, yellow 100–149, red < 100.

---

## Attributes Panel

**Replaces** the existing "Transform" collapsible section.

### Layout (2×2 grid + chain icon)

```
[ Width  ____ in ]  [🔗]  [ Height ____ in ]
[ Rotate ____ °  ]        [ Scale  ____ %  ]
```

### Behavior

- All inputs are **two-way bound** to the selected layer:
  - Typing a value → updates layer → calls `render()`
  - Dragging layer on canvas → updates input values via `syncAttributes()`
- **Aspect ratio lock** (chain icon): when locked, changing Width scales Height proportionally and vice versa. Default: locked.
- **No layer selected**: inputs show `—` and are `disabled`.
- Width/Height are in inches (2 decimal places). Scale is integer %. Rotate is 1 decimal place.

### New function: `syncAttributes()`

Called alongside `syncSliders()` wherever the selected layer changes (drag, resize, rotate, select). Reads `layer.w`, `layer.h`, `layer.rotation`, computes inches and scale %, writes to input fields.

---

## Layers Panel

**New collapsible section** added above the sidebar bottom actions (above Delete/Clear buttons).

### Per-layer row

```
[≡] [thumb] Layer N   DPI:NNN   [👁] [🔒] [🗑]
```

- **Drag handle** (≡) on left — HTML5 draggable for reorder
- **Thumbnail** — 36×36px `<canvas>` rendering `layer.img` centered, checkerboard bg for transparency
- **Label** — "Layer 1", "Layer 2", etc. (1-indexed from bottom)
- **DPI badge** — color-coded span
- **Eye icon** — toggles `layer.visible` (boolean, default true). Hidden layers skip `drawImage` in `render()` but are included in cart export.
- **Lock icon** — toggles `layer.locked` (boolean, default false). Locked layers ignore mousedown hit-test for drag/resize/rotate.
- **Trash icon** — removes layer, re-renders, re-renders layer list

### Drag reorder

Uses HTML5 `draggable` + `dragover`/`drop` events. Reordering changes `layers[]` array index (z-order). After drop, re-render canvas + re-render layer list.

### Selecting layers

Clicking a layer row sets `selectedIdx` to that layer's index, calls `syncSliders()`, `syncAttributes()`, `render()`.

### Active state

The row for `selectedIdx` gets an `active` class (accent left border or background tint).

---

## Layer Data Model Changes

Add two new properties to each layer object (set in `addLayer()`):

```js
layer.visible = true;
layer.locked  = false;
```

---

## Files Changed

- `configurator.html`
- `configurator-shopify.html`

No new files. No server changes.
