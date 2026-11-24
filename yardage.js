// ── ヤーデージブック（印刷用の手帳サイズ：A6 を A4 に4枚ずつ並べる）
// 図は GDO のホール図（ILLUS[key][0]）。作戦・キャディ・飛距離はアプリの最新データから毎回作る。
let YB=null;
const YB_ORDER=['1W','5W','4H','5I','6I','7I','8I','9I','PW','52°','58°'];
function ybPlan(date,k){const old=ROUND_PLAN[date];ROUND_PLAN[date]=k;try{return ROUND_BASE(date);}finally{ROUND_PLAN[date]=old;}}
function openYardageBook(date){
  const x=ROUND_BASE(date);if(!x||!x.mapKey)return;
  YB={date,plan:x.planKey||''};
  const go=()=>{if(YB)drawYardageBook();};
  const hz=typeof hzLoadAll==='function'?hzLoadAll(x.mapKey,x.holes.map(h=>h[0])).catch(()=>{}):Promise.resolve();
  const cl=typeof buildClubs==='function'&&typeof getRecs==='function'?getRecs().then(r=>{buildClubs(r);}).catch(()=>{}):Promise.resolve();
  go();Promise.all([hz,cl]).then(go,go);
}
function ybGo(i){const el=document.getElementById('yb');const sc=el&&el.querySelector('.yb-screen');if(!sc)return;if(el.classList.contains('yb-m')){el.scrollTo({top:0});sc.scrollTo({left:i*sc.clientWidth,behavior:'smooth'});}else{const c=sc.querySelectorAll(':scope>.yb-card')[i];c&&c.scrollIntoView({behavior:'smooth',block:'start'});}}
function closeYardageBook(){const el=$('yb');if(el)el.remove();document.body.style.overflow='';document.body.classList.remove('yb-open');YB=null;}

// 図の上の印：ルート・落とし所（番号）・ブレの範囲・OBライン・ピン
function ybSvg(I,hi,m,o){
  const r=hi.r,s=hi.s,IH=hi.h||I.h,K=o.k;const G=r[r.length-1];const DT=o.dt||0;const T=m.t||[];
  const T0=DT>=0?routeAt(r,DT*s).p:(()=>{const u=routeAt(r,0).u;return [r[0][0]+u[0]*DT*s,r[0][1]+u[1]*DT*s];})();
  const toPx=(x,y)=>{const a=routeAt(r,y*s);return [a.p[0]-a.u[1]*x*s,a.p[1]+a.u[0]*x*s];};
  const last=routeAt(r,1e9).u;const P=G;
  let v=`<svg viewBox="0 0 ${I.w} ${IH}" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" font-family="sans-serif">`;
  const cl=o.club;
  if(cl&&cl.side!=null&&T[0]){const a=routeAt(r,(cl.total||cl.carry)*s);const c=[a.p[0]-a.u[1]*cl.side*s,a.p[1]+a.u[0]*cl.side*s];const ang=Math.atan2(a.u[0],-a.u[1])*180/Math.PI;
    v+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${Math.max(1.5*K,1.5*(cl.sdSide||10)*s)}" ry="${Math.max(1.5*K,1.5*(cl.sdCarry||8)*s)}" transform="rotate(${ang} ${c[0]} ${c[1]})" fill="#ffb300" fill-opacity=".25" stroke="#e65100" stroke-width="${.25*K}" stroke-dasharray="${K} ${.7*K}"/>`;}
  // OBライン
  if(o.sides){const sd=o.sides;const Lr=r.reduce((t,q,i)=>i?t+Math.hypot(q[0]-r[i-1][0],q[1]-r[i-1][1]):0,0);const rg=o.obr||{};
    ['L','R'].forEach(k=>{const t=sd[k]||'';if(!/^OB(?!の記載)/.test(t))return;const sg=k==='R'?1:-1;const [f,e]=rg[k]||[0,9999];const pts=[];
      for(let d=Math.max(0,f*s);d<=Math.min(Lr,e*s)+0.1;d+=4){const a=routeAt(r,Math.min(d,Lr));let px=a.p[0]-a.u[1]*sg*36*s,py=a.p[1]+a.u[0]*sg*36*s;px=Math.max(2,Math.min(I.w-2,px));pts.push([px,py]);}
      if(pts.length<2)return;const pp=pts.map(p=>p.join(',')).join(' ');
      v+=hmOB(pp,K*.6);
      const q=pts[Math.floor((pts.length-1)*.45)];v+=`<rect x="${q[0]-2.6*K}" y="${q[1]-1.6*K}" width="${5.2*K}" height="${3.2*K}" rx="${.5*K}" fill="#d32f2f" stroke="#fff" stroke-width="${.2*K}"/><text x="${q[0]}" y="${q[1]+.85*K}" font-size="${2.4*K}" font-weight="bold" fill="#fff" text-anchor="middle">OB</text>`;});}
  // ルート
  const pts=T.map(t=>toPx(t[0],t[1]));let prev=T0;
  v+=hmRoute([prev,...pts,P].map(q=>q.join(',')).join(' '),.42*K);
  v+=`<circle cx="${T0[0]}" cy="${T0[1]}" r="${1.1*K}" fill="#fff" stroke="#111" stroke-width="${.3*K}"/>`;
  v+=`<line x1="${P[0]}" y1="${P[1]}" x2="${P[0]}" y2="${P[1]-3.6*K}" stroke="#111" stroke-width="${.25*K}"/><path d="M${P[0]} ${P[1]-3.6*K} l${2*K} ${.7*K} l${-2*K} ${.7*K}z" fill="#e53935"/>`;
  if(o.hzk&&typeof hzSvg==='function')v+=`<g class="hzi">${hzSvg(o.hzk,o.n,DT,K*.62,null,I.w)}</g><g class="hzo">${hzSvg(o.hzk,o.n,DT,K*.62,null,I.w,'out',IH)}</g>`;
  pts.forEach((q,i)=>{v+=`<circle cx="${q[0]}" cy="${q[1]}" r="${1.9*K}" fill="#ffd54a" stroke="#e65100" stroke-width="${.35*K}"/><text x="${q[0]}" y="${q[1]+.9*K}" font-size="${2.6*K}" font-weight="bold" fill="#111" text-anchor="middle">${i+1}</text>`;});
  return v+'</svg>';
}
// 図をタッチ：その場所までティーから何y・そこからグリーン中央まで何y（画面で見るときだけ）
function ybTap(ev,el){if(el.closest('.yb-print'))return;const key=el.dataset.k,n=+el.dataset.n,dt=+el.dataset.dt||0,K=+el.dataset.u||4;
  const IL=(ILLUS[key]||[]).find(v=>v.holes[n]);if(!IL)return;const hi=IL.holes[n],r=hi.r,s=hi.s,G=r[r.length-1];
  const svg=el.querySelector('svg');if(!svg)return;const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());
  const T0=dt>=0?routeAt(r,dt*s).p:(()=>{const u=routeAt(r,0).u;return [r[0][0]+u[0]*dt*s,r[0][1]+u[1]*dt*s];})();
  const a=Math.round(Math.hypot(q.x-T0[0],q.y-T0[1])/s),b=Math.round(Math.hypot(G[0]-q.x,G[1]-q.y)/s);
  svg.querySelectorAll('.ybtap').forEach(g=>g.remove());
  const u=K*.62,W=IL.w,w=36*u,hh=14*u;let lx=q.x+3*u;if(lx+w>W+30*u)lx=q.x-3*u-w;let ly=Math.max(-2*u,q.y-hh-3*u);
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','ybtap');
  g.innerHTML=`<line x1="${T0[0]}" y1="${T0[1]}" x2="${q.x}" y2="${q.y}" stroke="#fff" stroke-width="${1.2*u}"/><line x1="${T0[0]}" y1="${T0[1]}" x2="${q.x}" y2="${q.y}" stroke="#1565c0" stroke-width="${.6*u}" stroke-dasharray="${1.6*u} ${1*u}"/>`
   +`<line x1="${q.x}" y1="${q.y}" x2="${G[0]}" y2="${G[1]}" stroke="#fff" stroke-width="${1.2*u}"/><line x1="${q.x}" y1="${q.y}" x2="${G[0]}" y2="${G[1]}" stroke="#7b1fa2" stroke-width="${.6*u}" stroke-dasharray="${1.6*u} ${1*u}"/>`
   +`<circle cx="${q.x}" cy="${q.y}" r="${2*u}" fill="#fff" stroke="#1565c0" stroke-width="${.7*u}"/>`
   +`<rect x="${lx}" y="${ly}" width="${w}" height="${hh}" rx="${2.5*u}" fill="#fff" stroke="#263238" stroke-width="${.5*u}"/>`
   +`<text x="${lx+2.5*u}" y="${ly+6*u}" font-size="${4.4*u}" font-weight="bold" fill="#1565c0">ティー ${a}y</text><text x="${lx+2.5*u}" y="${ly+11.6*u}" font-size="${4.4*u}" font-weight="bold" fill="#7b1fa2">G中央 ${b}y</text>`;
  svg.appendChild(g);}
// 1打ごとの距離（ティー→落とし所、落とし所→ピン）
function ybShots(I,hi,m,dt){const r=hi.r,s=hi.s,G=r[r.length-1];const T=m.t||[];
  const T0=dt>=0?routeAt(r,dt*s).p:(()=>{const u=routeAt(r,0).u;return [r[0][0]+u[0]*dt*s,r[0][1]+u[1]*dt*s];})();
  const toPx=(x,y)=>{const a=routeAt(r,y*s);return [a.p[0]-a.u[1]*x*s,a.p[1]+a.u[0]*x*s];};
  let pv=[0,0];return T.map((t,i)=>{const q=toPx(t[0],t[1]);const d=i===0?Math.round(Math.hypot(q[0]-T0[0],q[1]-T0[1])/s):Math.round(Math.hypot(t[0]-pv[0],t[1]-pv[1]));pv=t;
    return {n:i+1,club:t[2]||'',d,rest:Math.round(Math.hypot(G[0]-q[0],G[1]-q[1])/s)};});}

// 結果（ホールごとの打数）があれば、ヤーデージブックに自動で書き込む
function ybScore(x,n){const r=x.result;return r&&r.holes&&r.holes[n-1]?r.holes[n-1]:null;}
function ybDiffCol(d){return d<=0?'#1b5e20':d===1?'#a8740f':'#c62828';}
const YB_CARD_W=105,YB_CARD_H=148.5,YB_IMG_H=98,YB_IMG_MAXW=46;
function ybCard(x,h,x2){
  const key=x.mapKey;const IL=(ILLUS[key]||[]).find(v=>v.holes[h[0]]);
  let m=HOLE_MAPS[key][h[0]];{const tc=teeCodeOf(x,h);if(tc&&h[1]>3&&m.t&&m.t[0])m={...m,t:[[m.t[0][0],m.t[0][1],tc,m.t[0][3]],...m.t.slice(1)]};}
  m=tmAdjust(m);
  // 2打目以降も、自分のトータル飛距離の位置に置き直す（グリーンの20y手前まで）
  {const IL0=(ILLUS[key]||[]).find(v=>v.holes[h[0]]);const T=m.t||[];if(IL0&&T.length>1&&typeof MYCLUBS!=='undefined'){const hi=IL0.holes[h[0]];const Lr=hi.r.reduce((t,q,i)=>i?t+Math.hypot(q[0]-hi.r[i-1][0],q[1]-hi.r[i-1][1]):0,0)/hi.s;
    const nt=[T[0]];for(let i=1;i<T.length;i++){const c=MYCLUBS[clubCode(T[i][2])];const py=nt[i-1][1];if(c&&c.src!=='仮'){const y=Math.min(py+(c.total||c.carry),Lr-20);nt.push([T[i][0],Math.max(py+5,y),T[i][2]]);}else nt.push(T[i]);}
    m={...m,t:nt};}}
  const code=m.t&&m.t[0]?(clubCode(m.t[0][2])||clubCode(h[5])):null;
  const club=typeof MYCLUBS!=='undefined'&&code&&MYCLUBS[code]&&MYCLUBS[code].src!=='仮'?MYCLUBS[code]:null;
  const yd=TEES[key]?TEES[key][teeIdx(key)][1][h[0]-1]:h[2];const teeName=TEES[key]?TEES[key][teeIdx(key)][0]:'';
  const dt=teeShift(key,h[0]);const sides=(HOLE_SIDES[key]||{})[h[0]];
  let fig='';let shots=[];
  if(IL){const hi=IL.holes[h[0]];const IH=hi.h||IL.h;let hmm=YB_IMG_H,wmm=hmm*IL.w/IH;if(wmm>YB_IMG_MAXW){wmm=YB_IMG_MAXW;hmm=wmm*IH/IL.w;}const k=IH/hmm;
    fig=`<div class="yb-fig" data-k="${key}" data-n="${h[0]}" data-dt="${dt}" data-u="${k}" onclick="ybTap(event,this)" style="width:${wmm}mm;height:${hmm}mm;--ar:${IL.w}/${IH};--hr:${(IH/IL.w).toFixed(3)}"><img src="${IL.base}${IL.ext(h[0])}" alt="${h[0]}番ホール図" referrerpolicy="no-referrer">${ybSvg(IL,hi,m,{hzk:key,n:h[0],k,dt,club,sides,obr:(OB_RANGE[key]||{})[h[0]]})}</div>`;
    shots=ybShots(IL,hi,m,dt);}
  const cad0=caddie(x,h,m);const iL=cad0.findIndex(t=>/>左 /.test(t));if(iL>=0&&/>右 /.test(cad0[iL+1]||''))cad0.splice(iL,2,cad0[iL]+'<br>'+cad0[iL+1]);
  const cad1=cad0.filter(t=>!/同じレベル|打ち出しが平均で|^<b>1打目|^<b>(\d+打目|ティーショット)<\/b>：ピンまで/.test(t));
  const cad=ybDedupe(cad1,h[6]); // 同じページで「狙い」と同じ文は書かない（洋平さんの指示：重複なし・シンプルに）
  const st=(HOLE_STATS[key]||{})[h[0]];
  const shotLines=shots.map(s=>{const cc=liveClub(s.club)||(clubCode(s.club)&&MYCLUBS[clubCode(s.club)]);
    return `<div class="yb-shot"><span class="yb-no">${s.n}</span><b>${esc(s.club||'')}</b> ${s.d}y${cc&&s.n===1?`<span class="yb-mut">（キャリー${Math.round(cc.carry)}・トータル${Math.round(cc.total||cc.carry)}）</span>`:''} → 残り<b>${s.rest}y</b></div>`;}).join('');
  const aim=''; // ずれの文は出さない（図の楕円で見る）
  const other=x2?x2.holes.find(r=>r[0]===h[0]):null;
  const col=h[7]==='hard'?'#c62828':h[7]==='mid'?'#b7791f':'#2e7d32';
  return `<div class="yb-card">
   <div class="yb-head"><div class="yb-num" style="background:${col}">${h[0]}</div>
    <div class="yb-ttl"><div><b>${PAR_NAME(h[1])}</b> Par${h[1]}・<b>${yd}y</b><span class="yb-mut">（${esc(teeName)}）</span></div><div class="yb-mut">HC${h[3]}${st?`・難易度${st.rank}位・OB率${Math.round(st.ob)}%`:''}</div></div>
    ${(()=>{const sc=ybScore(x,h[0]);return sc?`<div class="yb-goal"><div class="yb-mut">結果</div><b style="color:${ybDiffCol(sc-h[4])}">${sc}</b><div class="yb-mut">目標${h[4]}（${sc-h[4]>0?'+':''}${sc-h[4]}）</div></div>`:'';})()}<div class="yb-goal"><div class="yb-mut">目標</div><b>${h[4]}</b>${other?`<div class="yb-mut">${esc(x2.planName)} ${other[4]}</div>`:''}</div></div>
   <div class="yb-body">${fig}
    <div class="yb-txt">
     <div class="yb-tee">1打目 <b>${esc(h[5])}</b></div>${shotLines}${aim}
     <ul class="yb-cad">${cad.map(t=>ybCadLi(t)).join('')}</ul>
     <div class="yb-plan">${ybEmph(ybAim(h[6]),1)}</div>
    </div></div>
   <div class="yb-score">${['打数','パット','FW','OB・池','メモ'].map((t,i)=>{const sc=i===0?ybScore(x,h[0]):null;return `<div><span>${t}</span>${sc?`<b style="display:block;text-align:center;font-size:15pt;line-height:1;color:${ybDiffCol(sc-h[4])}">${sc}</b>`:''}</div>`;}).join('')}</div>
   <div class="yb-foot">${IL?esc(IL.credit)+'（縮図・距離は目安）':''}<span>${h[0]}</span></div>
  </div>`;
}
// 雑誌風の表紙（コースの写真＋今日の見出し）。写真はPHOTOS（公式）とCOURSE_VIEWの全景（楽天GORA）
function ybMag(x){
  const ph=(typeof PHOTOS!=='undefined'&&PHOTOS[x.mapKey])||{};const pv=(typeof COURSE_VIEW!=='undefined'&&COURSE_VIEW[x.mapKey])||{};
  const ks=Object.keys(ph);const hero=ks.length?ph[ks[0]]:(pv.pano?pv.pano[0]:'');const strip=ks.slice(1,4);
  const d=new Date(x.date+'T00:00');const wd='日月火水木金土'[d.getDay()];
  const g=typeof dwGroups==='function'?dwGroups(x):null;const H=x.holes||[];const sum=i=>H.reduce((s,h)=>s+h[i],0);
  const m7=typeof MYCLUBS!=='undefined'&&MYCLUBS['1W'];
  const credit=[ks.length?'写真：'+esc(x.course)+' 公式サイト':'',(!ks.length&&pv.pano)?'写真：'+esc(pv.pano[1]):''].filter(Boolean).join('・');
  const lines=[
    [`目標 <b>${x.target}</b>`,`${esc(x.planName)}への18ホール（OUT ${H.filter(h=>h[0]<=9).reduce((s,h)=>s+h[4],0)}・IN ${H.filter(h=>h[0]>=10).reduce((s,h)=>s+h[4],0)}）`],
    g?[`ドライバーは <b>${g.use.length}</b>ホール`,`使わないホールは${g.no.length}つ。OBを0にする作戦`]:null,
    m7?[`ドライバー <b>${Math.round(m7.total||m7.carry)}</b>y`,`${m7.date?+m7.date.slice(5,7)+'/'+(+m7.date.slice(8))+'の':''}当たりの良い球で番手表を作り直し`]:null,
    [`全${H.length}ホールの<b>攻略</b>`,'バンカー・池までの距離、狙い所、グリーンの傾き'],
  ].filter(Boolean);
  return `<div class="yb-card yb-mag">
   ${hero?`<img class="yb-mag-hero" src="${hero}" alt="${esc(x.course)}" referrerpolicy="no-referrer" onerror="this.remove()">`:''}
   <div class="yb-mag-shade"></div>
   <div class="yb-mag-top"><div class="yb-mag-mast">ヤーデージブック</div><div class="yb-mag-issue">${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${wd}）号</div></div>
   <div class="yb-mag-mid">
    <div class="yb-mag-kick">${esc(x.time||'')}${x.tee?'・'+esc(x.tee):''}${sum(1)&&!/パー|Par/i.test(x.tee||'')?'・パー'+sum(1):''}</div>
    <div class="yb-mag-course">${esc(x.course)}</div>
    <div class="yb-mag-sub">攻略特集</div>
   </div>
   <div class="yb-mag-lines">${lines.map(l=>`<div><div class="yb-mag-l1">${l[0]}</div><div class="yb-mag-l2">${l[1]}</div></div>`).join('')}</div>
   ${strip.length?`<div class="yb-mag-strip">${strip.map(k=>`<figure><img src="${ph[k]}" alt="${k}番" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"><figcaption>${k}番</figcaption></figure>`).join('')}</div>`:''}
   <div class="yb-mag-foot"><span>${credit}</span><span>みよトレ ゴルフ部</span></div>
  </div>`;
}
// ── 同じページの重複をなくす：文を「。」で切り、ほぼ同じ文（文字の2つ組の重なりが6割以上）は2回目から消す
function ybNorm(t){return String(t).replace(/<[^>]+>/g,'').replace(/（[^（）]*）|\([^()]*\)/g,'').replace(/11\/\d+の当たりの良い球(の|で)?/g,'').replace(/[\s　、。・：「」→]/g,'');}
function ybBig(t){const n=ybNorm(t);const S=new Set();for(let i=0;i<n.length-1;i++)S.add(n.slice(i,i+2));return S;}
function ybSim(a,b){if(!a.size||!b.size)return 0;let k=0;a.forEach(x=>{if(b.has(x))k++;});return k/Math.min(a.size,b.size);}
function ybSents(t){const o=[];let cur='',dep=0;for(const c of String(t)){if('（(「'.includes(c))dep++;else if('）)」'.includes(c))dep=Math.max(0,dep-1);cur+=c;if(c==='。'&&!dep){o.push(cur);cur='';}}if(cur.trim())o.push(cur);return o;}
function ybDedupe(lines,aim){const seen=ybSents(aim||'').map(ybBig).filter(b=>b.size>=3);const dup=t=>{const b=ybBig(t);if(b.size<3)return false;return seen.some(x=>ybSim(b,x)>=.45);};
  return lines.map(t=>{
    let m=t.match(/^(<span class="[^"]*"><b>ドライバー：[^<]*<\/b><\/span>)　(.*)$/);
    if(m){const keep=ybSents(m[2]).filter(x=>!dup(x));keep.forEach(x=>seen.push(ybBig(x)));return m[1]+(keep.length?'　'+keep.join(''):'');}
    m=t.match(/^グリーン：(.*)$/);
    if(m){const keep=ybSents(m[1]).filter(x=>!dup(x));keep.forEach(x=>seen.push(ybBig(x)));return keep.length?'グリーン：'+keep.join(''):null;}
    if(/^<span class="text-(muted|fg|accent|warn)">(左|右|前|奥) /.test(t)||/^<b>高低差/.test(t))return t;
    if(dup(t))return null;seen.push(ybBig(t));return t;}).filter(Boolean);}
function ybCover(x){
  const cl=YB_ORDER.map(c=>MYCLUBS&&MYCLUBS[c]).filter(Boolean);
  const H=x.holes;const sum=(a,i)=>a.reduce((s,h)=>s+h[i],0);const out=H.filter(h=>h[0]<=9),inn=H.filter(h=>h[0]>=10);
  return `<div class="yb-card yb-cover">
   <div class="yb-ctitle">${esc(x.course)}</div>
   <div class="yb-mut">${+x.date.slice(5,7)}/${+x.date.slice(8)}（${'日月火水木金土'[new Date(x.date+'T00:00').getDay()]}）${esc(x.time||'')}・${esc(x.tee||'')}</div>
   ${x.result&&x.result.score?`<div class="yb-big" style="border:.4mm solid #111;border-radius:1.5mm;padding:1mm 2mm">結果 <b style="color:#c62828">${x.result.score}</b><span class="yb-mut">${x.result.out?`（OUT ${x.result.out}・IN ${x.result.in}）`:''}</span></div>`:''}<div class="yb-big">${esc(x.planName)}プラン 目標 <b>${x.target}</b><span class="yb-mut">（OUT ${sum(out,4)}・IN ${sum(inn,4)}・上限 ${x.limit||99}）</span></div>
   ${(()=>{if(typeof SWING_LOG==='undefined')return '';const L=SWING_LOG.filter(c=>c.date<=x.date&&/秋野コーチ/.test((c.src||'')+(c.title||''))).sort((a,b)=>a.date<b.date?1:-1)[0];if(!L)return '';return `<div class="yb-sec">コーチの今の課題（${+L.date.slice(5,7)}/${+L.date.slice(8)}）</div><ul style="margin:0;padding-left:4mm">${(L.fix||[]).slice(0,3).map(f=>`<li>${esc(f.t)}</li>`).join('')}</ul>${L.drill?`<div class="yb-mut">${esc(String(L.drill).slice(0,90))}</div>`:''}`;})()}
   ${x.rules?`<div class="yb-sec">当日の約束</div><ol>${x.rules.map(r=>`<li><b>${esc(r[0])}</b></li>`).join('')}</ol>`:''}
   ${typeof dwGroups==='function'?(()=>{const g=dwGroups(x);return `<div class="yb-sec">ドライバーの使い分け</div><table class="yb-tbl">${DW_LABEL.map(([k,l,s2,c])=>g[k].length?`<tr><th style="color:${c};width:22%">${l}</th><td style="text-align:left;font-weight:bold">${g[k].join('・')}番</td><td style="width:18%">${g[k].length}回</td></tr>`:'').join('')}</table>`;})():''}
   ${typeof COURSE_YARDS!=='undefined'?`<div class="yb-sec">コースの番手表（${+COURSE_YARDS.date.slice(5,7)}/${+COURSE_YARDS.date.slice(8)}）</div><table class="yb-tbl"><tr>${COURSE_YARDS.rows.map(r=>`<th>${r[0]}</th>`).join('')}</tr><tr>${COURSE_YARDS.rows.map(r=>`<td>${r[1]===0?'〜'+r[2]:r[2]>=999?r[1]+'〜':r[1]+'〜'+r[2]}</td>`).join('')}</tr></table>`:''}
   ${x.result&&x.result.score?'':`<div class="yb-sec">全番手の飛距離（トラックマン・当たりの良い球の平均）</div><table class="yb-tbl"><tr><th>クラブ</th><th>キャリー</th><th>トータル</th><th>左右</th><th>測った日</th></tr>${(typeof CLUB_ORDER!=='undefined'?CLUB_ORDER.map(k=>cl.find(c=>c.c===k)).filter(Boolean):cl).map(c=>`<tr><td>${c.c}</td><td>${Math.round(c.carry)}</td><td>${Math.round(c.total||c.carry)}</td><td>${c.side!=null?(c.side>0?'右':'左')+Math.abs(Math.round(c.side)):'－'}</td><td>${c.date?(+c.date.slice(5,7))+'/'+(+c.date.slice(8)):'－'}</td></tr>`).join('')}</table>`}
   <!--YBMENU-->
   <div class="yb-foot">作成 ${new Date().toLocaleDateString('ja-JP')}・最新データで作り直すには、アプリで開き直して印刷<span>作戦</span></div>
  </div>`;
}
// パーからの差：±0・+1・-1。パー以下は緑、ボギーは黄土、ダブル以上は赤
const ybPm=d=>d===0?'±0':(d>0?'+':'')+d;
const ybParCol=d=>d<=0?'#2e7d32':d===1?'#8d6e00':'#c62828';
function ybScoreCard(x){
  const H=x.holes;const row=hs=>`<tr><th>H</th>${hs.map(h=>`<td>${h[0]}</td>`).join('')}<th>計</th></tr><tr><th>Par</th>${hs.map(h=>`<td>${h[1]}</td>`).join('')}<th>${hs.reduce((s,h)=>s+h[1],0)}</th></tr><tr><th>目標</th>${hs.map(h=>`<td>${h[4]}</td>`).join('')}<th>${hs.reduce((s,h)=>s+h[4],0)}</th></tr><tr class="yb-w"><th>打数</th>${hs.map(h=>{const sc=ybScore(x,h[0]);return `<td style="font-weight:bold;${sc?'color:'+ybDiffCol(sc-h[4]):''}">${sc||''}</td>`;}).join('')}<th>${hs.every(h=>ybScore(x,h[0]))?hs.reduce((t,h)=>t+ybScore(x,h[0]),0):''}</th></tr>${hs.every(h=>ybScore(x,h[0]))?`<tr><th>パー差</th>${hs.map(h=>{const d=ybScore(x,h[0])-h[1];return `<td style="color:${ybParCol(d)}">${ybPm(d)}</td>`;}).join('')}<th>${ybPm(hs.reduce((t,h)=>t+ybScore(x,h[0])-h[1],0))}</th></tr>`:''}<tr class="yb-w"><th>パット</th>${hs.map(()=>'<td></td>').join('')}<th></th></tr>`;
  return `<div class="yb-card yb-cover"><div class="yb-ctitle">スコア</div>
   <div class="yb-sec">OUT</div><table class="yb-tbl yb-sc">${row(H.filter(h=>h[0]<=9))}</table>
   <div class="yb-sec">IN</div><table class="yb-tbl yb-sc">${row(H.filter(h=>h[0]>=10))}</table>
   ${x.result&&x.result.score?`<div class="yb-big">合計 <b>${x.result.score}</b>（パー${ybPm(x.result.score-H.reduce((s,h)=>s+h[1],0))}）　目標 ${x.target}</div>`:'<div class="yb-big">合計 ＿＿＿＿　パット ＿＿＿＿</div>'}
   <div class="yb-sec">今日よかったこと・次の課題</div>${(()=>{const L=typeof SWING_LOG!=='undefined'&&SWING_LOG.find(c=>c.date===x.date);return L?`<ul style="margin:0;padding-left:4mm;font-size:7pt;line-height:1.5">${L.good.map(g=>`<li>◎ ${esc(g)}</li>`).join('')}${L.fix.map(f=>`<li style="color:#c62828">課題：${esc(f.t)}</li>`).join('')}</ul>`:`<div class="yb-lines">${'<div></div>'.repeat(6)}</div>`;})()}
   <div class="yb-foot"><span>裏表紙</span></div></div>`;
}
function drawYardageBook(){
  const x0=ybPlan(YB.date,YB.plan);const x={...x0,planName:YB.plan?(x0.plans[YB.plan].name):'100切り'};
  const alt=YB.plan?'':Object.keys(x0.plans||{})[0];const xa=x0.plans?ybPlan(YB.date,alt):null;const x2=xa?{...xa,planName:alt?(x0.plans[alt].name):'100切り'}:null;
  const order=(x.order||['out','in']).flatMap(k=>x.holes.filter(h=>k==='out'?h[0]<=9:h[0]>=10));
  const GC=typeof slopeGuideCards==='function'?slopeGuideCards():[];const cards=[ybMag(x),ybCover(x),...order.map(h=>ybCard(x,h,x2)),ybScoreCard(x),...GC]; // 最終ホールの次はすぐスコア、ガイドはその後ろ
  const SI=1+order.length; // 画面の並び（表紙と作戦は1ページ）での番号
  const G0=SI+1;cards[1]=cards[1].replace('<!--YBMENU-->',typeof slopeGuideMenu==='function'?slopeGuideMenu(G0,SI,order):'');
  // 切って重ねるだけで順番になる並べ方：シートs・位置p に cards[p*S+s]
  const S=Math.ceil(cards.length/4);const sheets=[...Array(S)].map((_,s)=>[0,1,2,3].map(p=>cards[p*S+s]||'<div class="yb-card"></div>'));
  let el=$('yb');if(!el){el=document.createElement('div');el.id='yb';document.body.appendChild(el);document.body.style.overflow='hidden';document.body.classList.add('yb-open');}
  const mob=window.innerWidth<700;el.classList.toggle('yb-m',mob);const keepX=mob&&el.querySelector('.yb-screen')?el.querySelector('.yb-screen').scrollLeft:0;
  el.innerHTML=`<div class="yb-bar">
    <button class="btn-sm" onclick="closeYardageBook()">✕ 閉じる</button>
    ${x0.plans?`<div class="seg !p-0.5 text-[12px]"><button class="${YB.plan?'':'on'} !min-h-[34px] !px-2" onclick="YB.plan='';drawYardageBook()">100切り</button>${Object.entries(x0.plans).map(([k,P])=>`<button class="${YB.plan===k?'on':''} !min-h-[34px] !px-2" onclick="YB.plan='${k}';drawYardageBook()">${P.name}</button>`).join('')}</div>`:''}
    <button class="btn !min-h-[38px] !px-3" onclick="window.print()">🖨 印刷</button></div>
   <div class="yb-help">A4で<b>倍率100％（実際のサイズ）・余白なし</b>で印刷 → ${S}枚を重ねて点線で十字に切る → <b>左上→右上→左下→右下</b>の束の順に重ねると、表紙・作戦・1〜18番・スコア・傾斜とバンカーの打ち方の順になります → 左はじをホッチキスで留める。</div>
   ${mob?`<div class="yb-jump"><button class="yb-jc" data-i="0" onclick="ybGo(0)">表紙</button>${order.map((h,k)=>`<button class="yb-jp${h[1]}" data-i="${k+1}" onclick="ybGo(${k+1})">${h[0]}</button>`).join('')}<button class="yb-js" data-i="${SI}" onclick="ybGo(${SI})">スコア</button></div>`:''}
   <div class="yb-screen">${[`<div class="yb-card yb-combo">${cards[0].replace('class="yb-card yb-mag"','class="yb-mag"')}${cards[1].replace('class="yb-card yb-cover"','class="yb-cover yb-cover-in"')}</div>`,...cards.slice(2)].join('')}</div>
   <div class="yb-print">${sheets.map(c=>`<div class="yb-sheet">${c.join('')}<i class="yb-cut-v"></i><i class="yb-cut-h"></i></div>`).join('')}</div>`;
  if(typeof jpWalk==='function')jpWalk(el);
  if(mob){const sc=el.querySelector('.yb-screen');sc.scrollLeft=keepX;const mark=()=>{const i=Math.round(sc.scrollLeft/sc.clientWidth);el.querySelectorAll('.yb-jump button').forEach(b=>{const on=+b.dataset.i===i;b.classList.toggle('on',on);if(on)b.scrollIntoView({block:'nearest',inline:'nearest'});});};sc.onscroll=()=>{clearTimeout(sc._t);sc._t=setTimeout(mark,80);};mark();}
  const fit=()=>{const sc=el.querySelector('.yb-screen');if(!sc||mob)return;const pw=YB_CARD_W*96/25.4;sc.style.zoom=Math.min(1.4,(el.clientWidth-16)/pw);};fit();
  // 文字があふれるカードは文字を小さくする（印刷用にも同じ大きさを写す）
  requestAnimationFrame(()=>{const y0=el.scrollTop;el.classList.add('yb-measure');if(mob)el.classList.remove('yb-m');const sc=[...el.querySelectorAll('.yb-screen .yb-txt')];const fs=sc.map(t=>{let f=9;t.style.fontSize=f+'pt';while(t.scrollHeight>t.clientHeight+1&&f>4.6){f-=.2;t.style.fontSize=f+'pt';}return f;});
    const pr=[...el.querySelectorAll('.yb-print .yb-card')];const idx=sheets.flatMap((c,s)=>[0,1,2,3].map(p=>p*S+s));
    const scards=[...el.querySelectorAll('.yb-screen .yb-card')];
    pr.forEach((c,i)=>{const t=c.querySelector('.yb-txt');const ci=idx[i];const st=scards[ci]&&scards[ci].querySelector('.yb-txt');if(t&&st)t.style.fontSize=st.style.fontSize;});
    el.classList.remove('yb-measure');if(mob){el.classList.add('yb-m');const s2=el.querySelector('.yb-screen');s2.style.zoom='';s2.scrollLeft=keepX;}el.scrollTop=y0;});
}

// 狙いの文章を読みやすく：見出し → 1文ずつ行に分ける → 「→」の流れは段に分ける → （カッコの補足）は小さく
function ybAim(t){if(!t)return '';t=String(t);let head='';const m=t.match(/^([^。：]{2,26})：/);if(m){head=m[1];t=t.slice(m[0].length);}
  const ss=[];let cur='',dep=0;for(const c of t){if('（(「'.includes(c))dep++;else if('）)」'.includes(c))dep=Math.max(0,dep-1);cur+=c;if(c==='。'&&!dep){ss.push(cur);cur='';}}if(cur.trim())ss.push(cur);
  {const kept=[];const ss2=ss.filter(x=>{const b=ybBig(x);if(b.size>=4&&kept.some(k=>ybSim(b,k)>=.6))return false;kept.push(b);return true;});ss.length=0;ss.push(...ss2);}
  const small=x=>esc(x).replace(/（([^（）]*)）/g,'<span class="yb-aim-n">（$1）</span>');
  const ic=x0=>{const x=x0.replace(/（[^（）]*）/g,'');return /^[23]打目/.test(x)?'⛳':/OB|しない|注意|出やすい|ダメ|禁止|避け/.test(x)?'⚠️':/スタート前|温め|素振り/.test(x)?'🔥':/ドライバー|ティー|1打目|ウッド|ユーティ|アイアン/.test(x)?'🏌️':/グリーン|アプローチ|パット/.test(x)?'⛳':'・';};
  const rows=ss.map(x=>x.trim().replace(/。$/,'')).filter(Boolean).map(x=>{const st=x.split('→').map(y=>y.trim()).filter(Boolean);
    const body=st.length>1?`<div class="yb-aim-flow">${st.map((y,i)=>`<div>${i?'<span class="yb-aim-ar">→</span>':''}${small(y)}</div>`).join('')}</div>`:small(x);
    return `<div class="yb-aim-row"><span class="yb-aim-ic">${ic(x)}</span><div>${body}</div></div>`;}).join('');
  return `<div class="yb-aim-h"><b>狙い</b>${head?`<span>${esc(head)}</span>`:''}</div>${rows}`;}

// 箇条書きの中の文も「。」ごとに改行（カッコやタグの中は切らない）
// キャディの1行を種類ごとに色分けし、危ない所（OB・池・崖）と狙い所を太字にする（洋平さんの指示：大事な所を太く、色をつけて目立たせる）
function ybKind(t){const p=String(t).replace(/<[^>]+>/g,'');
  if(/^グリーン：/.test(p))return 'grn';if(/^高低差：/.test(p))return 'elev';if(/^ドライバー：/.test(p))return 'dr';
  if(/^左 |^右 /.test(p))return 'side';if(/^⚠/.test(p))return 'warn';if(/^(前|奥) ✕/.test(p)||/OB(?!率)|池|崖/.test(p))return 'ob';return 'etc';}
function ybEmphText(s){return s.replace(/(すぐOB|OB(?!率)|崖|池)/g,'<b class="yb-red">$1</b>').replace(/(セーフ)/g,'<b class="yb-safe">$1</b>')
  .replace(/([^、。：→（）<>\s　]{1,16}(?:を狙いたい|を狙う|が狙い目|を向いて構える|狙い)(?![目た]))/g,'<b class="yb-key">$1</b>');}
function ybEmph(h,aim){let dep=0;return h.split(/(<[^>]+>)/).map(x=>{if(x[0]==='<'){if(/^<span class="(text-muted|yb-aim-n|yb-aim-h)/.test(x)||(aim&&/^<span/.test(x)&&dep))dep++;else if(dep&&x==='</span>')dep--;return x;}return dep?x:ybEmphText(x);}).join('');}
function ybCadLi(t){const k=ybKind(t);let h=ybBr(t);
  const TAG={grn:['グリーン','#2e7d32'],elev:['高低差','#1565c0']}[k];
  if(k==='grn')h=h.replace(/^グリーン：(?:<br>)?/,'');
  if(k==='elev')h=h.replace(/^<b>高低差<\/b>：(?:<br>)?/,'').replace(/^([^<　]+)/,'<b class="yb-big">$1</b>');
  h=ybEmph(h);
  return `<li class="yb-k yb-k-${k}">${TAG?`<span class="yb-tag" style="background:${TAG[1]}">${TAG[0]}</span>`:''}${h}</li>`;}
function ybBr(t){t=String(t).replace(/(<\/[^>]+>)?[\s　]*→[\s　]*/g,(m,a)=>(a||'')+'<br>→ ').replace(/^((?:<[^>]+>)*[^<。]{1,14}(?:<\/[^>]+>)+)[\s　]+/,'$1<br>');let o='',dep=0,tag=false;const n=t.length;for(let i=0;i<n;i++){const c=t[i];if(c==='<')tag=true;if(!tag){if('（(「'.includes(c))dep++;else if('）)」'.includes(c))dep=Math.max(0,dep-1);}o+=c;if(c==='>')tag=false;if(c==='。'&&!dep&&!tag&&i<n-1&&!/^\s*(<\/[^>]+>\s*)*$/.test(t.slice(i+1)))o+='<br>';}return o;}
