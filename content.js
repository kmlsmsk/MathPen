(function() {
    // ==========================================
    // 1. AYARLAR & MATHPEN TEMA
    // ==========================================
    const CONFIG = {
        ID: 'mathpen-pro',
        Z_UI: 2147483647, // Max Z-Index
        Z_FX: 2147483646,
        Z_DRAW: 2147483645,
        Z_BG: 2147483640,
        // UI Renkleri
        BG: 'rgba(15, 23, 42, 0.95)', // Slate 900
        BORDER: '1px solid rgba(56, 189, 248, 0.3)', // Sky Blue Border
        ACCENT: '#0ea5e9' // Sky 500
    };

    // Eğer zaten açıksa kapat (Toggle mantığı)
    if (document.getElementById(`${CONFIG.ID}-ui`)) {
        document.getElementById(`${CONFIG.ID}-ui`).remove();
        document.getElementById(`${CONFIG.ID}-bg-layer`).remove();
        document.getElementById(`${CONFIG.ID}-canvas-draw`).remove();
        document.getElementById(`${CONFIG.ID}-canvas-fx`).remove();
        return;
    }

    const el = (tag, cls, parent, text) => {
        const e = document.createElement(tag);
        if(cls) e.className = cls;
        if(text) e.textContent = text;
        if(parent) parent.appendChild(e);
        return e;
    };

    // CSS
    const style = document.createElement('style');
    style.textContent = `
        #${CONFIG.ID}-ui {
            position: fixed; top: 20px; right: 20px; width: 300px;
            background: ${CONFIG.BG}; backdrop-filter: blur(15px);
            border-radius: 16px; border: ${CONFIG.BORDER};
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
            color: #fff; font-family: 'Segoe UI', system-ui, sans-serif;
            z-index: ${CONFIG.Z_UI}; display: flex; flex-direction: column;
            user-select: none;
        }
        .mp-header {
            padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            cursor: grab; font-weight: 700; letter-spacing: 0.5px;
            background: linear-gradient(90deg, rgba(14,165,233,0.2) 0%, transparent 100%);
            border-radius: 16px 16px 0 0;
        }
        .mp-tabs { display: flex; padding: 8px; gap: 4px; background: rgba(0,0,0,0.2); }
        .mp-tab {
            flex: 1; text-align: center; padding: 8px 0; font-size: 18px;
            cursor: pointer; border-radius: 6px; color: #94a3b8; transition: 0.2s;
        }
        .mp-tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .mp-tab.active { background: ${CONFIG.ACCENT}; color: white; box-shadow: 0 2px 10px rgba(14,165,233,0.4); }
        
        .mp-content { padding: 15px; display: grid; gap: 8px; max-height: 400px; overflow-y: auto; }
        .mp-content::-webkit-scrollbar { width: 5px; }
        .mp-content::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }

        .mp-btn {
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05);
            border-radius: 8px; display: flex; align-items: center; justify-content: center;
            aspect-ratio: 1; font-size: 20px; cursor: pointer; transition: 0.2s; position: relative;
        }
        .mp-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); border-color: rgba(255,255,255,0.2); }
        .mp-btn.active { background: rgba(14,165,233,0.2); border-color: ${CONFIG.ACCENT}; color: ${CONFIG.ACCENT}; }

        .mp-tooltip {
            position: absolute; bottom: -35px; left: 50%; transform: translateX(-50%);
            background: #000; color: #fff; padding: 4px 8px; font-size: 11px;
            border-radius: 4px; opacity: 0; pointer-events: none; white-space: nowrap; z-index: 999;
            transition: opacity 0.2s; border: 1px solid #333;
        }
        .mp-btn:hover .mp-tooltip { opacity: 1; }

        .mp-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
        .mp-credits { 
            text-align: center; margin-top: 10px; padding-top: 10px; 
            border-top: 1px solid rgba(255,255,255,0.05); 
            color: #64748b; font-size: 11px; 
        }
        .mp-credits strong { display: block; color: #94a3b8; font-size: 12px; margin-bottom: 2px; }

        input[type=range] { width: 100%; accent-color: ${CONFIG.ACCENT}; margin-bottom: 5px; cursor: pointer; }

        /* Arkaplan Desenleri */
        .bg-grid {
            background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
            background-size: 20px 20px; background-color: rgba(255,255,255,0.9);
        }
        .bg-lined {
            background-color: #fffbeb; /* Hafif sarımtırak kağıt */
            background-image: linear-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 100% 30px;
        }
        .bg-blackboard {
            background-color: #1a2e26;
            background-image: radial-gradient(circle, #3d5a4f 1px, transparent 1px);
            background-size: 30px 30px;
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. KATMANLAR
    // ==========================================
    const bgLayer = el('div', '', document.body); bgLayer.id = `${CONFIG.ID}-bg-layer`;
    Object.assign(bgLayer.style, { position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:CONFIG.Z_BG, pointerEvents:'none', display:'none' });

    const canvasDraw = document.createElement('canvas'); canvasDraw.id = `${CONFIG.ID}-canvas-draw`;
    Object.assign(canvasDraw.style, { position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:CONFIG.Z_DRAW, pointerEvents:'none' });
    document.body.appendChild(canvasDraw); const ctx = canvasDraw.getContext('2d');

    const canvasFx = document.createElement('canvas'); canvasFx.id = `${CONFIG.ID}-canvas-fx`;
    Object.assign(canvasFx.style, { position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:CONFIG.Z_FX, pointerEvents:'none' });
    document.body.appendChild(canvasFx); const ctxFx = canvasFx.getContext('2d');

    const resize = () => { [canvasDraw, canvasFx].forEach(c => { c.width = window.innerWidth; c.height = window.innerHeight; }); };
    window.addEventListener('resize', resize); resize();

    // ==========================================
    // 3. LOGIC ENGINE
    // ==========================================
    const state = { mode: 'none', tool: 'smooth', color: '#0ea5e9', size: 3, isDrawing: false, points: [], history: [], step: -1 };

    const saveHistory = () => {
        state.step++; state.history = state.history.slice(0, state.step);
        state.history.push(ctx.getImageData(0, 0, canvasDraw.width, canvasDraw.height));
        if (state.history.length > 20) { state.history.shift(); state.step--; }
    };

    let snapshot;
    const start = (e) => {
        if (state.mode === 'none' || e.target.closest(`#${CONFIG.ID}-ui`)) return;
        state.isDrawing = true;
        const p = { x: e.clientX, y: e.clientY };
        state.points = [p, p];
        
        if (state.mode === 'draw') {
            snapshot = ctx.getImageData(0, 0, canvasDraw.width, canvasDraw.height);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            if (state.tool === 'marker') {
                ctx.globalAlpha = 0.05; ctx.lineWidth = state.size * 6; ctx.strokeStyle = state.color;
                ctx.lineCap = 'square'; ctx.globalCompositeOperation = 'multiply'; 
            } else {
                ctx.globalAlpha = 1.0; ctx.lineWidth = state.size; ctx.strokeStyle = state.color; ctx.globalCompositeOperation = 'source-over';
            }
        }
    };

    const move = (e) => {
        const p = { x: e.clientX, y: e.clientY };
        if (state.mode === 'fx') {
            state.points.push(p);
            ctxFx.clearRect(0,0,canvasFx.width,canvasFx.height);
            if(state.tool === 'laser') {
                ctxFx.shadowBlur=15; ctxFx.shadowColor='red'; ctxFx.fillStyle='red'; ctxFx.beginPath(); ctxFx.arc(p.x,p.y,5,0,Math.PI*2); ctxFx.fill(); ctxFx.shadowBlur=0;
                if(state.points.length>5) { ctxFx.beginPath(); ctxFx.strokeStyle='rgba(255,0,0,0.5)'; ctxFx.lineWidth=3; ctxFx.moveTo(state.points[state.points.length-1].x,state.points[state.points.length-1].y); for(let i=state.points.length-1; i>Math.max(0,state.points.length-15); i--) ctxFx.lineTo(state.points[i].x,state.points[i].y); ctxFx.stroke(); }
            } else if(state.tool === 'spotlight') {
                ctxFx.fillStyle='rgba(0,0,0,0.85)'; ctxFx.fillRect(0,0,canvasFx.width,canvasFx.height);
                ctxFx.globalCompositeOperation='destination-out'; ctxFx.beginPath(); ctxFx.arc(p.x,p.y,120,0,Math.PI*2); ctxFx.fill();
                ctxFx.globalCompositeOperation='source-over'; ctxFx.strokeStyle='rgba(255,255,255,0.5)'; ctxFx.lineWidth=2; ctxFx.stroke();
            }
            return;
        }
        if (!state.isDrawing) return;
        state.points.push(p);

        if (state.mode === 'draw') {
            if (['marker','pen'].includes(state.tool)) { ctx.lineTo(p.x, p.y); ctx.stroke(); }
            else if (state.tool === 'smooth') {
                if (state.points.length > 2) {
                    const last = state.points[state.points.length-1]; const prev = state.points[state.points.length-2]; const pp = state.points[state.points.length-3];
                    const cp1 = { x: (pp.x + prev.x)/2, y: (pp.y + prev.y)/2 }; const cp2 = { x: (prev.x + last.x)/2, y: (prev.y + last.y)/2 };
                    ctx.beginPath(); ctx.moveTo(cp1.x, cp1.y); ctx.quadraticCurveTo(prev.x, prev.y, cp2.x, cp2.y); ctx.stroke();
                }
            }
            else if (state.tool === 'callig') {
                const p1 = state.points[state.points.length-2]; const width = state.size * 3; ctx.fillStyle = state.color;
                const dist = Math.hypot(p.x - p1.x, p.y - p1.y);
                for(let i=0; i<dist; i++) {
                    const t = i/dist; const x = p1.x + (p.x - p1.x)*t; const y = p1.y + (p.y - p1.y)*t;
                    ctx.save(); ctx.translate(x,y); ctx.rotate(-Math.PI/4); ctx.fillRect(-width/2, -0.5, width, 1); ctx.restore();
                }
            } else {
                ctx.putImageData(snapshot, 0, 0); ctx.beginPath();
                const s = state.points[0]; const w = p.x-s.x, h = p.y-s.y;
                if(state.tool==='rect') ctx.rect(s.x, s.y, w, h);
                else if(state.tool==='circle') ctx.arc(s.x, s.y, Math.hypot(w,h), 0, 2*Math.PI);
                else if(state.tool==='line') { ctx.moveTo(s.x,s.y); ctx.lineTo(p.x,p.y); }
                else if(state.tool==='tri') { ctx.moveTo(s.x+w/2, s.y); ctx.lineTo(s.x, s.y+h); ctx.lineTo(s.x+w, s.y+h); ctx.closePath(); }
                else if(state.tool==='tri_r') { ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y+h); ctx.lineTo(s.x+w, s.y+h); ctx.closePath(); }
                else if(state.tool==='rhombus') { ctx.moveTo(s.x+w/2,s.y); ctx.lineTo(s.x+w,s.y+h/2); ctx.lineTo(s.x+w/2,s.y+h); ctx.lineTo(s.x,s.y+h/2); ctx.closePath(); }
                else if(state.tool==='hex') { const r=Math.min(Math.abs(w),Math.abs(h))/2, cx=s.x+w/2, cy=s.y+h/2; for(let i=0;i<6;i++) ctx.lineTo(cx+r*Math.cos(i*Math.PI/3), cy+r*Math.sin(i*Math.PI/3)); ctx.closePath(); }
                else if(state.tool==='star') { const R=Math.hypot(w,h), r=R/2; for(let i=0;i<5;i++){ ctx.lineTo(s.x+R*Math.cos((18+i*72)*Math.PI/180), s.y+R*Math.sin((18+i*72)*Math.PI/180)); ctx.lineTo(s.x+r*Math.cos((54+i*72)*Math.PI/180), s.y+r*Math.sin((54+i*72)*Math.PI/180)); } ctx.closePath(); }
                else if(state.tool==='arrow') { const a=Math.atan2(h,w), H=20; ctx.moveTo(s.x,s.y); ctx.lineTo(p.x,p.y); ctx.lineTo(p.x-H*Math.cos(a-Math.PI/6),p.y-H*Math.sin(a-Math.PI/6)); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-H*Math.cos(a+Math.PI/6),p.y-H*Math.sin(a+Math.PI/6)); }
                ctx.stroke();
            }
        }
    };
    const end = () => { if(state.isDrawing) { state.isDrawing=false; if(state.mode==='draw'){ ctx.globalCompositeOperation='source-over'; saveHistory(); ctx.beginPath(); }}};
    window.addEventListener('pointerdown', start); window.addEventListener('pointermove', move); window.addEventListener('pointerup', end);

    // ==========================================
    // 4. UI CONSTRUCTION
    // ==========================================
    const panel = el('div', '', document.body); panel.id = `${CONFIG.ID}-ui`;
    
    // Header
    const header = el('div', 'mp-header', panel);
    el('div', '', header, 'MathPen Pro');
    el('div', '', header, '✕').onclick = () => { panel.remove(); bgLayer.remove(); canvasDraw.remove(); canvasFx.remove(); };
    let drag={on:false,dx:0,dy:0}; header.onmousedown=e=>{drag.on=true;drag.dx=e.clientX-panel.offsetLeft;drag.dy=e.clientY-panel.offsetTop;};
    window.onmousemove=e=>{if(drag.on){panel.style.left=(e.clientX-drag.dx)+'px';panel.style.top=(e.clientY-drag.dy)+'px';}}; window.onmouseup=()=>drag.on=false;

    const tabArea = el('div', 'mp-tabs', panel);
    const content = el('div', 'mp-content', panel);
    const footer = el('div', 'mp-footer', panel);

    const tabs = [
        { id: 'draw', i: '✏️', n:'Çizim' },
        { id: 'geo', i: '🔶', n:'Şekiller' },
        { id: 'color', i: '🎨', n:'Renk' },
        { id: 'util', i: '🛠️', n:'Araçlar' }
    ];

    const render = (tid) => {
        content.innerHTML = '';
        document.querySelectorAll('.mp-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tid}`).classList.add('active');
        content.style.gridTemplateColumns = 'repeat(4, 1fr)';

        if(tid === 'draw') {
            [
                { id:'smooth', i:'✨', t:'Akıllı Kalem' },
                { id:'callig', i:'🖋️', t:'Hat Kalemi' },
                { id:'pen', i:'🖊️', t:'Standart' },
                { id:'marker', i:'🖍️', t:'Fosforlu (Şeffaf)' },
                { id:'eraser', i:'🧼', t:'Silgi', a:()=>{state.tool='pen'; state.color='#ffffff'; state.size=20;} }
            ].forEach(b => btn(b));
        }
        else if(tid === 'geo') {
            [
                { id:'rect', i:'⬜', t:'Kare' },
                { id:'circle', i:'🔴', t:'Daire' }, 
                { id:'tri', i:'🔺', t:'Eşkenar Üçgen' },
                { id:'tri_r', i:'📐', t:'Dik Üçgen' },
                { id:'rhombus', i:'🔹', t:'Baklava' },
                { id:'hex', i:'⬢', t:'Altıgen' },
                { id:'star', i:'⭐', t:'Yıldız' },
                { id:'line', i:'📏', t:'Çizgi' },
                { id:'arrow', i:'↗️', t:'Ok' }
            ].forEach(b => btn(b));
        }
        else if(tid === 'color') {
            content.style.gridTemplateColumns = 'repeat(4, 1fr)';
            // Genişletilmiş Renk Paleti
            const colors = [
                '#000000', '#ffffff', '#ef4444', '#f97316', // Siyah, Beyaz, Kırmızı, Turuncu
                '#facc15', '#22c55e', '#0ea5e9', '#3b82f6', // Sarı, Yeşil, Açık Mavi, Koyu Mavi
                '#a855f7', '#ec4899', '#f43f5e', '#64748b', // Mor, Pembe, Gül, Gri
                '#14b8a6', '#8b5cf6', '#d946ef', '#84cc16'  // Teal, Menekşe, Fuşya, Limon
            ];
            colors.forEach(c => {
                const b = el('div', 'mp-btn', content, '');
                b.style.background = c;
                if(state.color === c) { b.style.border = '2px solid white'; b.style.transform = 'scale(0.9)'; }
                b.onclick = () => { state.color = c; render('color'); updateUI(); };
            });
        }
        else if(tid === 'util') {
            [
                { id:'laser', i:'🔥', t:'Lazer', m:'fx' },
                { id:'spotlight', i:'🔦', t:'Odak', m:'fx' },
                { i:'🖱️', t:'Mouse', a:()=>{state.mode='none'; canvasDraw.style.pointerEvents='none'; canvasFx.style.pointerEvents='none';} },
                { i:'📝', t:'Çizgili', a:()=>{ bgLayer.style.display='block'; bgLayer.className='bg-lined'; state.color='#000'; } },
                { i:'▦', t:'Kareli', a:()=>{ bgLayer.style.display='block'; bgLayer.className='bg-grid'; state.color='#000'; } },
                { i:'🏁', t:'Tahta', a:()=>{ bgLayer.style.display='block'; bgLayer.className='bg-blackboard'; state.color='#fff'; } },
                { i:'❌', t:'Arka Plan Kapa', a:()=>{ bgLayer.style.display='none'; } },
                { i:'↩️', t:'Geri', a:()=>{ if(state.step>=0){state.step--; ctx.putImageData(state.history[state.step]||ctx.createImageData(1,1),0,0);} else ctx.clearRect(0,0,canvasDraw.width,canvasDraw.height); } },
                { i:'🗑️', t:'Temizle', a:()=>{ ctx.clearRect(0,0,canvasDraw.width,canvasDraw.height); } },
                { i:'💾', t:'İndir', a:()=>{ const a=document.createElement('a'); a.download='MathPen-Not.png'; a.href=canvasDraw.toDataURL(); a.click(); } }
            ].forEach(b => btn(b));
        }
    };

    const btn = (conf) => {
        const b = el('div', `mp-btn ${state.tool===conf.id ? 'active' : ''}`, content, conf.i);
        if(conf.i==='🔴' || conf.i==='🔺' || conf.i==='🔹') b.style.textShadow = '0 0 0 white';
        el('div', 'mp-tooltip', b, conf.t);
        b.onclick = () => {
            if(conf.a) conf.a();
            else {
                state.mode = conf.m || 'draw';
                state.tool = conf.id;
                canvasDraw.style.pointerEvents = state.mode==='draw'?'auto':'none';
                canvasFx.style.pointerEvents = state.mode==='fx'?'auto':'none';
                ctxFx.clearRect(0,0,canvasFx.width,canvasFx.height);
            }
            updateUI();
            const curr = document.querySelector('.mp-tab.active');
            if(curr) render(curr.id.split('-')[1]);
        };
    };

    // Footer Alanı
    const slider = el('input', '', footer); slider.type='range'; slider.min=1; slider.max=40; slider.value=3;
    const info = el('div', '', footer); info.style.fontSize='12px'; info.style.color='#cbd5e1';
    
    // İmza Alanı
    const credits = el('div', 'mp-credits', footer);
    credits.innerHTML = '<strong>Kemal ŞİMŞEK</strong>Bilgisayar Mühendisi';

    slider.oninput = (e) => { state.size = parseInt(e.target.value); updateUI(); };
    const updateUI = () => { info.innerHTML = `Araç: <b>${state.tool}</b> | Boyut: <b>${state.size}px</b>`; slider.style.accentColor = state.color; };

    tabs.forEach(t => { const b = el('div', 'mp-tab', tabArea, t.i); b.id=`tab-${t.id}`; b.onclick=()=>render(t.id); });

    saveHistory(); render('draw'); updateUI();
})();