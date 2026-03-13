# Attributes & Layers Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Transform sliders with a precise Attributes panel (width/height in inches, rotate, scale) and add a Layers panel with thumbnail, DPI, visibility, lock, delete, and drag-to-reorder — applied to both `configurator.html` and `configurator-shopify.html`.

**Architecture:** All logic lives in the existing script block. The Attributes section replaces the Transform HTML. The Layers section is a new collapsible block inserted just above `.sidebar-bottom-actions`. A new `syncAttributes()` function runs wherever `syncSliders()` runs plus inside mouse/touch move handlers. A `renderLayersList()` function rebuilds the layers DOM whenever `layers[]` changes.

**Tech Stack:** Vanilla JS, HTML5 Canvas, HTML5 drag-and-drop for layer reorder, existing CSS design system (`--accent`, `.tool-group`, `.text-input`, etc.)

---

## Task 1: Add `visible` and `locked` to the layer data model

**Files:**
- Modify: `configurator.html` — `addLayer()` function (~line 1435)
- Modify: `configurator-shopify.html` — same function

**Step 1: In `addLayer()`, add `visible` and `locked` to the layer object**

Find:
```js
const layer = {
    img, original: img,
    x: zone.x + (zone.w - w) / 2,
    y: zone.y + (zone.h - h) / 2,
    w, h, rotation: 0, baseScale: bs
};
```

Replace with:
```js
const layer = {
    img, original: img,
    x: zone.x + (zone.w - w) / 2,
    y: zone.y + (zone.h - h) / 2,
    w, h, rotation: 0, baseScale: bs,
    visible: true, locked: false
};
```

**Step 2: In `render()`, skip invisible layers**

Find the start of `layers.forEach` inside `render()`:
```js
        layers.forEach((layer, idx) => {
            ctx.save();
```

Add visibility check:
```js
        layers.forEach((layer, idx) => {
            if (!layer.visible) return;
            ctx.save();
```

**Step 3: In `findLayerAt()`, skip locked layers**

Find:
```js
    function findLayerAt(mx, my) {
        for (let i = layers.length - 1; i >= 0; i--) {
            if (hitTestLayer(mx, my, layers[i])) return i;
        }
        return -1;
    }
```

Replace with:
```js
    function findLayerAt(mx, my) {
        for (let i = layers.length - 1; i >= 0; i--) {
            if (!layers[i].locked && hitTestLayer(mx, my, layers[i])) return i;
        }
        return -1;
    }
```

**Step 4: Verify in browser**
Open in browser. Add an image, confirm it renders. Open console: `layers[0]` should show `visible: true, locked: false`.

**Step 5: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: add visible/locked to layer model"
```

---

## Task 2: Add CSS for Attributes and Layers panels

**Files:**
- Modify: `configurator.html` — inside style block, after `.slider-control` rules (~line 202)
- Modify: `configurator-shopify.html` — same location

**Step 1: Insert CSS in both files**

```css
/* Attributes inputs */
.attr-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 8px;
    align-items: end;
    margin-bottom: 10px;
}
.attr-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 4px;
}
.attr-field { display: flex; flex-direction: column; gap: 4px; }
.attr-field label {
    font-size: 0.68rem;
    color: var(--grey);
    letter-spacing: 0.5px;
    text-transform: uppercase;
}
.attr-input-wrap {
    display: flex;
    align-items: center;
    border: 1px solid var(--sidebar-input-border);
    border-radius: 4px;
    background: var(--sidebar-input);
    overflow: hidden;
}
.attr-input-wrap input[type="number"] {
    flex: 1;
    border: none;
    outline: none;
    padding: 7px 6px;
    font-size: 0.82rem;
    font-family: 'Geist', sans-serif;
    color: var(--text);
    background: transparent;
    width: 0;
    -moz-appearance: textfield;
}
.attr-input-wrap input[type="number"]::-webkit-outer-spin-button,
.attr-input-wrap input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
.attr-input-wrap .attr-unit {
    padding: 0 7px;
    font-size: 0.7rem;
    color: var(--grey);
    white-space: nowrap;
    border-left: 1px solid var(--border);
    line-height: 32px;
}
.attr-lock-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    width: 28px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--grey);
    transition: all 0.2s;
    align-self: end;
}
.attr-lock-btn.locked { border-color: var(--accent); color: var(--accent); }
.attr-input-wrap.disabled { opacity: 0.4; }

/* Layers list */
.layers-list { display: flex; flex-direction: column; gap: 6px; }
.layer-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--sidebar-input);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    user-select: none;
}
.layer-row:hover { border-color: var(--accent-border); }
.layer-row.active { border-color: var(--accent); background: var(--accent-subtle); }
.layer-row.drag-over { border-color: var(--accent); border-style: dashed; }
.layer-drag-handle {
    cursor: grab;
    color: var(--grey);
    font-size: 0.85rem;
    flex-shrink: 0;
    line-height: 1;
}
.layer-thumb {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    flex-shrink: 0;
    background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    overflow: hidden;
    position: relative;
}
.layer-thumb canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.layer-info { flex: 1; min-width: 0; }
.layer-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.layer-dpi { font-size: 0.65rem; color: var(--grey); margin-top: 1px; }
.layer-dpi.dpi-good { color: #22a06b; }
.layer-dpi.dpi-warn { color: #e67e22; }
.layer-dpi.dpi-bad  { color: #e74c3c; }
.layer-actions { display: flex; gap: 4px; flex-shrink: 0; }
.layer-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 3px;
    color: var(--grey);
    border-radius: 3px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
}
.layer-icon-btn:hover { color: var(--text); }
.layer-icon-btn.active { color: var(--accent); }
.layer-icon-btn.danger:hover { color: #e74c3c; }
```

**Step 2: Verify** — No visual regressions. Open browser. CSS is inert until HTML/JS adds the elements.

**Step 3: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: add CSS for attributes and layers panels"
```

---

## Task 3: Replace Transform HTML with Attributes HTML

**Files:**
- Modify: `configurator.html` — Transform section (~lines 1169–1185)
- Modify: `configurator-shopify.html` — same section

**Step 1: Find and replace the entire Transform collapsible section in both files**

Find:
```html
            <!-- Transform -->
            <div class="tool-group collapsed">
                <div class="tool-group-toggle" onclick="toggleGroup(this)">
                    <h4>Transform</h4>
```

Replace the whole block (through its closing `</div>`) with:
```html
            <!-- Attributes -->
            <div class="tool-group collapsed">
                <div class="tool-group-toggle" onclick="toggleGroup(this)">
                    <h4>Attributes</h4>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div class="tool-group-content">
                    <div class="attr-grid">
                        <div class="attr-field">
                            <label>Width</label>
                            <div class="attr-input-wrap" id="attrWWrap">
                                <input type="number" id="attrW" min="0.1" max="14" step="0.01" placeholder="—" oninput="attrWidthChanged(this.value)">
                                <span class="attr-unit">in</span>
                            </div>
                        </div>
                        <button class="attr-lock-btn locked" id="attrLockBtn" title="Lock aspect ratio" onclick="toggleAttrLock()">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </button>
                        <div class="attr-field">
                            <label>Height</label>
                            <div class="attr-input-wrap" id="attrHWrap">
                                <input type="number" id="attrH" min="0.1" max="16" step="0.01" placeholder="—" oninput="attrHeightChanged(this.value)">
                                <span class="attr-unit">in</span>
                            </div>
                        </div>
                    </div>
                    <div class="attr-grid-2">
                        <div class="attr-field">
                            <label>Rotate</label>
                            <div class="attr-input-wrap" id="attrRotWrap">
                                <input type="number" id="attrRot" min="-360" max="360" step="0.1" placeholder="—" oninput="attrRotChanged(this.value)">
                                <span class="attr-unit">°</span>
                            </div>
                        </div>
                        <div class="attr-field">
                            <label>Scale</label>
                            <div class="attr-input-wrap" id="attrScaleWrap">
                                <input type="number" id="attrScale" min="1" max="250" step="1" placeholder="—" oninput="attrScaleChanged(this.value)">
                                <span class="attr-unit">%</span>
                            </div>
                        </div>
                    </div>
                    <!-- Hidden legacy sliders — keep so syncSliders() refs don't error -->
                    <input type="range" id="sizeSlider" style="display:none" min="20" max="250" value="100">
                    <span id="sizeVal" style="display:none">100%</span>
                    <input type="range" id="rotSlider"  style="display:none" min="0" max="360" value="0">
                    <span id="rotVal"  style="display:none">0°</span>
                </div>
            </div>
```

**Step 2: Verify** — Open in browser. "Attributes" section expands and shows inputs. Typing does nothing yet.

**Step 3: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: replace Transform section with Attributes inputs HTML"
```

---

## Task 4: Add `syncAttributes()` and attribute input handlers

**Files:**
- Modify: `configurator.html` — JS block
- Modify: `configurator-shopify.html` — JS block

**Step 1: Add `attrLocked` state variable** near `let showBounds = false;`

```js
let attrLocked = true;
```

**Step 2: Add `syncAttributes()` function** after `syncSliders()`:

```js
function syncAttributes() {
    const l = sel();
    const ids = ['attrW', 'attrH', 'attrRot', 'attrScale'];
    const wrapIds = ['attrWWrap', 'attrHWrap', 'attrRotWrap', 'attrScaleWrap'];
    if (!l) {
        ids.forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.disabled = true; } });
        wrapIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('disabled'); });
        return;
    }
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.disabled = false; });
    wrapIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('disabled'); });

    const pxPerInchX = (canvas.width  * 0.32) / 14;
    const pxPerInchY = (canvas.height * 0.40) / 16;
    const wIn  = l.w / pxPerInchX;
    const hIn  = l.h / pxPerInchY;
    const scale = Math.round((l.w / (l.original.width * l.baseScale)) * 100);
    const rot   = ((l.rotation % 360) + 360) % 360;

    const wEl = document.getElementById('attrW');     if (wEl) wEl.value = wIn.toFixed(2);
    const hEl = document.getElementById('attrH');     if (hEl) hEl.value = hIn.toFixed(2);
    const rEl = document.getElementById('attrRot');   if (rEl) rEl.value = rot.toFixed(1);
    const sEl = document.getElementById('attrScale'); if (sEl) sEl.value = scale;
}
```

**Step 3: Add attribute input handler functions** after `syncAttributes()`:

```js
function toggleAttrLock() {
    attrLocked = !attrLocked;
    const btn = document.getElementById('attrLockBtn');
    if (btn) btn.classList.toggle('locked', attrLocked);
}

function attrWidthChanged(val) {
    const l = sel(); if (!l) return;
    const pxPerInchX = (canvas.width  * 0.32) / 14;
    const pxPerInchY = (canvas.height * 0.40) / 16;
    const newW = parseFloat(val) * pxPerInchX;
    if (!isFinite(newW) || newW < 1) return;
    const ocx = l.x + l.w / 2, ocy = l.y + l.h / 2;
    if (attrLocked) {
        const ratio = l.h / l.w;
        l.h = newW * ratio;
        const hEl = document.getElementById('attrH');
        if (hEl) hEl.value = (l.h / pxPerInchY).toFixed(2);
    }
    l.w = newW;
    l.x = ocx - l.w / 2; l.y = ocy - l.h / 2;
    render(); renderLayersList();
}

function attrHeightChanged(val) {
    const l = sel(); if (!l) return;
    const pxPerInchX = (canvas.width  * 0.32) / 14;
    const pxPerInchY = (canvas.height * 0.40) / 16;
    const newH = parseFloat(val) * pxPerInchY;
    if (!isFinite(newH) || newH < 1) return;
    const ocx = l.x + l.w / 2, ocy = l.y + l.h / 2;
    if (attrLocked) {
        const ratio = l.w / l.h;
        l.w = newH * ratio;
        const wEl = document.getElementById('attrW');
        if (wEl) wEl.value = (l.w / pxPerInchX).toFixed(2);
    }
    l.h = newH;
    l.x = ocx - l.w / 2; l.y = ocy - l.h / 2;
    render(); renderLayersList();
}

function attrRotChanged(val) {
    const l = sel(); if (!l) return;
    l.rotation = parseFloat(val) || 0;
    render();
}

function attrScaleChanged(val) {
    const l = sel(); if (!l) return;
    const pct = parseFloat(val);
    if (!isFinite(pct) || pct < 1) return;
    const scale = pct / 100;
    const ocx = l.x + l.w / 2, ocy = l.y + l.h / 2;
    l.w = l.original.width  * l.baseScale * scale;
    l.h = l.original.height * l.baseScale * scale;
    l.x = ocx - l.w / 2; l.y = ocy - l.h / 2;
    render(); renderLayersList();
}
```

**Step 4: Call `syncAttributes()` alongside every `syncSliders()` call**

Add `syncAttributes();` immediately after each `syncSliders();` call. Locations in both files:
- `addLayer()` — after `syncSliders(); render();`
- `deleteSelected()` — after `syncSliders();`
- `clearDesign()` — after `syncSliders();`
- mousedown: `selectedIdx = hit; syncSliders();`
- mousedown: `selectedIdx = -1; syncSliders();`

**Step 5: Call `syncAttributes()` in mouse/touch move handlers** — inside the `isResizing`, `isRotating`, and `isDragging` blocks after `render()`.

**Step 6: Verify**
- Upload image, expand Attributes — shows inches/scale/rotation
- Drag image — inputs update live
- Type a new width — canvas updates, height follows when locked
- Toggle lock — width/height become independent

**Step 7: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: add syncAttributes() and attribute input handlers"
```

---

## Task 5: Add Layers panel HTML

**Files:**
- Modify: `configurator.html` — just before `<!-- Bottom-locked actions -->` (~line 1206)
- Modify: `configurator-shopify.html` — same

**Step 1: Insert Layers section HTML before `<!-- Bottom-locked actions -->`**

Find:
```html
        <!-- Bottom-locked actions -->
```

Insert before it:
```html
            <div class="section-divider"></div>

            <!-- Layers -->
            <div class="tool-group collapsed" id="layersGroup">
                <div class="tool-group-toggle" onclick="toggleGroup(this)">
                    <h4>Layers</h4>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div class="tool-group-content">
                    <div class="layers-list" id="layersList"></div>
                </div>
            </div>

```

**Step 2: Verify** — "Layers" section appears in sidebar, empty.

**Step 3: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: add Layers panel HTML scaffold"
```

---

## Task 6: Add `renderLayersList()` and layer action helpers

**Files:**
- Modify: `configurator.html` — JS block
- Modify: `configurator-shopify.html` — JS block

**Step 1: Add `renderLayersList()` after `syncAttributes()`**

Build each layer row using DOM methods (not innerHTML) for all dynamic values to avoid XSS. SVG icons are built as static strings via `createElement('svg')` or inserted as safe SVG markup only for hardcoded icon paths.

```js
function renderLayersList() {
    const list = document.getElementById('layersList');
    if (!list) return;
    while (list.firstChild) list.removeChild(list.firstChild);

    const pxPerInch = (canvas.width * 0.32) / 14;

    // Show top layer first
    for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        const idx = i;
        const displayNum = idx + 1;
        const isSelected = idx === selectedIdx;

        // Thumbnail
        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'layer-thumb';
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 72; thumbCanvas.height = 72;
        const tCtx = thumbCanvas.getContext('2d');
        const sc = Math.min(72 / layer.img.width, 72 / layer.img.height);
        const tw = layer.img.width * sc, th = layer.img.height * sc;
        tCtx.drawImage(layer.img, (72 - tw) / 2, (72 - th) / 2, tw, th);
        thumbWrap.appendChild(thumbCanvas);

        // DPI
        const widthIn = layer.w / pxPerInch;
        const dpi = Math.round(layer.original.width / widthIn);
        const dpiClass = dpi >= 150 ? 'dpi-good' : dpi >= 100 ? 'dpi-warn' : 'dpi-bad';

        // Drag handle
        const handle = document.createElement('span');
        handle.className = 'layer-drag-handle';
        handle.title = 'Drag to reorder';
        handle.textContent = '⠿';

        // Info
        const info = document.createElement('div');
        info.className = 'layer-info';
        const nameEl = document.createElement('div');
        nameEl.className = 'layer-name';
        nameEl.textContent = 'Layer ' + displayNum;
        const dpiEl = document.createElement('div');
        dpiEl.className = 'layer-dpi ' + dpiClass;
        dpiEl.textContent = 'DPI: ' + dpi;
        info.appendChild(nameEl);
        info.appendChild(dpiEl);

        // Action buttons — SVG paths are static/hardcoded (not user data)
        const SVG_EYE_ON  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        const SVG_EYE_OFF = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
        const SVG_LOCK    = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
        const SVG_UNLOCK  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
        const SVG_TRASH   = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>';

        const actions = document.createElement('div');
        actions.className = 'layer-actions';

        const eyeBtn = document.createElement('button');
        eyeBtn.className = 'layer-icon-btn' + (layer.visible ? '' : ' active');
        eyeBtn.title = layer.visible ? 'Hide' : 'Show';
        eyeBtn.innerHTML = layer.visible ? SVG_EYE_ON : SVG_EYE_OFF;
        eyeBtn.addEventListener('click', e => { e.stopPropagation(); toggleLayerVisible(idx); });

        const lockBtn = document.createElement('button');
        lockBtn.className = 'layer-icon-btn' + (layer.locked ? ' active' : '');
        lockBtn.title = layer.locked ? 'Unlock' : 'Lock';
        lockBtn.innerHTML = layer.locked ? SVG_LOCK : SVG_UNLOCK;
        lockBtn.addEventListener('click', e => { e.stopPropagation(); toggleLayerLocked(idx); });

        const trashBtn = document.createElement('button');
        trashBtn.className = 'layer-icon-btn danger';
        trashBtn.title = 'Delete';
        trashBtn.innerHTML = SVG_TRASH;
        trashBtn.addEventListener('click', e => { e.stopPropagation(); deleteLayerByIdx(idx); });

        actions.appendChild(eyeBtn);
        actions.appendChild(lockBtn);
        actions.appendChild(trashBtn);

        // Row
        const row = document.createElement('div');
        row.className = 'layer-row' + (isSelected ? ' active' : '');
        row.draggable = true;
        row.appendChild(handle);
        row.appendChild(thumbWrap);
        row.appendChild(info);
        row.appendChild(actions);

        // Select on click
        row.addEventListener('click', () => {
            selectedIdx = idx;
            syncSliders(); syncAttributes();
            render(); renderLayersList();
        });

        // Drag reorder
        row.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', String(idx));
            row.style.opacity = '0.5';
        });
        row.addEventListener('dragend', () => { row.style.opacity = ''; });
        row.addEventListener('dragover', e => { e.preventDefault(); row.classList.add('drag-over'); });
        row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
        row.addEventListener('drop', e => {
            e.preventDefault();
            row.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIdx = idx;
            if (fromIdx === toIdx) return;
            const moved = layers.splice(fromIdx, 1)[0];
            layers.splice(toIdx, 0, moved);
            if (selectedIdx === fromIdx) selectedIdx = toIdx;
            else if (fromIdx < toIdx && selectedIdx > fromIdx && selectedIdx <= toIdx) selectedIdx--;
            else if (fromIdx > toIdx && selectedIdx >= toIdx && selectedIdx < fromIdx) selectedIdx++;
            render(); renderLayersList(); syncAttributes();
        });

        list.appendChild(row);
    }
}
```

**Step 2: Add layer action helpers** after `renderLayersList()`:

```js
function toggleLayerVisible(idx) {
    layers[idx].visible = !layers[idx].visible;
    render(); renderLayersList();
}

function toggleLayerLocked(idx) {
    layers[idx].locked = !layers[idx].locked;
    if (layers[idx].locked && selectedIdx === idx) {
        selectedIdx = -1; syncSliders(); syncAttributes();
    }
    renderLayersList(); render();
}

function deleteLayerByIdx(idx) {
    layers.splice(idx, 1);
    if (selectedIdx === idx) selectedIdx = -1;
    else if (selectedIdx > idx) selectedIdx--;
    syncSliders(); syncAttributes(); render(); renderLayersList(); updateOrderBtn();
}
```

**Step 3: Call `renderLayersList()` wherever `layers[]` changes**

Add `renderLayersList();` to:
- `addLayer()` — after `updateOrderBtn();`
- `deleteSelected()` — after `updateOrderBtn();`
- `clearDesign()` — after `updateOrderBtn();`

**Step 4: Verify**
- Upload image — Layers panel shows Layer 1 with thumbnail + DPI badge
- Upload second image — Layer 2 appears above Layer 1
- Click eye — layer hides on canvas
- Click lock — layer can't be dragged
- Click trash in layers panel — layer deleted
- Drag row — z-order swaps on canvas
- Click row — selects layer, shows handles

**Step 5: Commit**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: add renderLayersList() with thumbnail, DPI, visibility, lock, delete, reorder"
```

---

## Task 7: Respect `layer.visible` in cart preview and push

**Files:**
- Modify: `configurator.html` — `orderNow()` cart preview loop (~line 2091)
- Modify: `configurator-shopify.html` — same

**Step 1: Find the cart preview layers loop in `orderNow()`**

Find:
```js
        layers.forEach(l => {
            const cx = (l.x + l.w / 2) * scX, cy = (l.y + l.h / 2) * scY;
```

Add:
```js
        layers.forEach(l => {
            if (!l.visible) return;
            const cx = (l.x + l.w / 2) * scX, cy = (l.y + l.h / 2) * scY;
```

**Step 2: Final smoke test**
- Upload art → Attributes shows inches/scale/rotation
- Drag/resize → attributes update live
- Type width → canvas updates, height follows (locked)
- Toggle lock → independent sizing works
- Layers list: thumbnail, DPI, all icons function
- Drag reorder → z-order changes
- Hide a layer → stays hidden in cart preview
- Full order flow → cart preview renders correctly

**Step 3: Commit and push**
```
git add configurator.html configurator-shopify.html
git commit -m "feat: respect layer.visible in cart preview canvas"
git push origin main
```
