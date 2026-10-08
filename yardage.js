// ── ヤーデージブック（印刷用の手帳サイズ：A6 を A4 に4枚ずつ並べる）
// 図は GDO のホール図（ILLUS[key][0]）。作戦・キャディ・飛距離はアプリの最新データから毎回作る。
let YB=null;
const YB_ORDER=['1W','5W','4H','5I','6I','7I','8I','9I','PW','52°','58°'];
function ybPlan(date,k){const old=ROUND_PLAN[date];ROUND_PLAN[date]=k;try{return ROUND_BASE(date);}finally{ROUND_PLAN[date]=old;}}
function openYardageBook(date){
  const x=ROUND_BASE(date);if(!x||!x.mapKey)return;
  YB={date,plan:x.planKey||''};
  const go=()=>{if(YB)drawYardageBook();};
  if(typeof buildClubs==='function'&&typeof getRecs==='function')getRecs().then(r=>{buildClubs(r);go();}).catch(go);else go();
}
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
      v+=`<polyline points="${pp}" fill="none" stroke="#fff" stroke-width="${.9*K}"/><polyline points="${pp}" fill="none" stroke="#d32f2f" stroke-width="${.45*K}" stroke-dasharray="${1.6*K} ${1*K}"/>`;
      const q=pts[Math.floor((pts.length-1)*.45)];v+=`<rect x="${q[0]-2.6*K}" y="${q[1]-1.6*K}" width="${5.2*K}" height="${3.2*K}" rx="${.5*K}" fill="#d32f2f" stroke="#fff" stroke-width="${.2*K}"/><text x="${q[0]}" y="${q[1]+.85*K}" font-size="${2.4*K}" font-weight="bold" fill="#fff" text-anchor="middle">OB</text>`;});}
  // ルート
  const pts=T.map(t=>toPx(t[0],t[1]));let prev=T0;
  [...pts,P].forEach(q=>{v+=`<line x1="${prev[0]}" y1="${prev[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#fff" stroke-width="${.8*K}"/><line x1="${prev[0]}" y1="${prev[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#e65100" stroke-width="${.45*K}" stroke-dasharray="${1.2*K} ${.7*K}"/>`;prev=q;});
  v+=`<circle cx="${T0[0]}" cy="${T0[1]}" r="${1.1*K}" fill="#fff" stroke="#111" stroke-width="${.3*K}"/>`;
  v+=`<line x1="${P[0]}" y1="${P[1]}" x2="${P[0]}" y2="${P[1]-3.6*K}" stroke="#111" stroke-width="${.25*K}"/><path d="M${P[0]} ${P[1]-3.6*K} l${2*K} ${.7*K} l${-2*K} ${.7*K}z" fill="#e53935"/>`;
  pts.forEach((q,i)=>{v+=`<circle cx="${q[0]}" cy="${q[1]}" r="${1.9*K}" fill="#ffd54a" stroke="#e65100" stroke-width="${.35*K}"/><text x="${q[0]}" y="${q[1]+.9*K}" font-size="${2.6*K}" font-weight="bold" fill="#111" text-anchor="middle">${i+1}</text>`;});
  return v+'</svg>';
}
// 1打ごとの距離（ティー→落とし所、落とし所→ピン）
function ybShots(I,hi,m,dt){const r=hi.r,s=hi.s,G=r[r.length-1];const T=m.t||[];
  const T0=dt>=0?routeAt(r,dt*s).p:(()=>{const u=routeAt(r,0).u;return [r[0][0]+u[0]*dt*s,r[0][1]+u[1]*dt*s];})();
  const toPx=(x,y)=>{const a=routeAt(r,y*s);return [a.p[0]-a.u[1]*x*s,a.p[1]+a.u[0]*x*s];};
  let pv=[0,0];return T.map((t,i)=>{const q=toPx(t[0],t[1]);const d=i===0?Math.round(Math.hypot(q[0]-T0[0],q[1]-T0[1])/s):Math.round(Math.hypot(t[0]-pv[0],t[1]-pv[1]));pv=t;
    return {n:i+1,club:t[2]||'',d,rest:Math.round(Math.hypot(G[0]-q[0],G[1]-q[1])/s)};});}

const YB_CARD_W=105,YB_CARD_H=148.5,YB_IMG_H=98,YB_IMG_MAXW=46;
function ybCard(x,h,x2){
  const key=x.mapKey;const IL=(ILLUS[key]||[]).find(v=>v.holes[h[0]]);
  let m=HOLE_MAPS[key][h[0]];{const tc=teeCodeOf(x,h);if(tc&&h[1]>3&&m.t&&m.t[0])m={...m,t:[[m.t[0][0],m.t[0][1],tc],...m.t.slice(1)]};}
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
    fig=`<div class="yb-fig" style="width:${wmm}mm;height:${hmm}mm"><img src="${IL.base}${IL.ext(h[0])}" alt="${h[0]}番ホール図" referrerpolicy="no-referrer">${ybSvg(IL,hi,m,{k,dt,club,sides,obr:(OB_RANGE[key]||{})[h[0]]})}</div>`;
    shots=ybShots(IL,hi,m,dt);}
  const cad0=caddie(x,h,m);const iL=cad0.findIndex(t=>/>左 /.test(t));if(iL>=0&&/>右 /.test(cad0[iL+1]||''))cad0.splice(iL,2,cad0[iL]+'　'+cad0[iL+1]);
  const cad=cad0.filter(t=>!/同じレベル|打ち出しが平均で|^<b>1打目|^<b>(\d+打目|ティーショット)<\/b>：ピンまで/.test(t));
  const st=(HOLE_STATS[key]||{})[h[0]];
  const shotLines=shots.map(s=>{const cc=liveClub(s.club)||(clubCode(s.club)&&MYCLUBS[clubCode(s.club)]);
    return `<div class="yb-shot"><span class="yb-no">${s.n}</span><b>${esc(s.club||'')}</b> ${s.d}y${cc&&s.n===1?`<span class="yb-mut">（キャリー${Math.round(cc.carry)}・トータル${Math.round(cc.total||cc.carry)}）</span>`:''} → 残り<b>${s.rest}y</b></div>`;}).join('');
  const aim=club&&club.side!=null&&Math.abs(club.side)>=6?`<div class="yb-aim">${club.side>0?'右':'左'}に約${Math.abs(Math.round(club.side))}yずれる → <b>${club.side>0?'左':'右'}を向く</b></div>`:'';
  const other=x2?x2.holes.find(r=>r[0]===h[0]):null;
  const col=h[7]==='hard'?'#c62828':h[7]==='mid'?'#b7791f':'#2e7d32';
  return `<div class="yb-card">
   <div class="yb-head"><div class="yb-num" style="background:${col}">${h[0]}</div>
    <div class="yb-ttl"><div><b>${PAR_NAME(h[1])}</b> Par${h[1]}・<b>${yd}y</b><span class="yb-mut">（${esc(teeName)}）</span></div><div class="yb-mut">HC${h[3]}${st?`・難易度${st.rank}位・OB率${Math.round(st.ob)}%`:''}</div></div>
    <div class="yb-goal"><div class="yb-mut">目標</div><b>${h[4]}</b>${other?`<div class="yb-mut">${esc(x2.planName)} ${other[4]}</div>`:''}</div></div>
   <div class="yb-body">${fig}
    <div class="yb-txt">
     <div class="yb-tee">1打目 <b>${esc(h[5])}</b></div>${shotLines}${aim}
     <ul>${cad.map(t=>`<li>${t}</li>`).join('')}</ul>
     <div class="yb-plan"><b>狙い</b> ${esc(h[6])}</div>
    </div></div>
   <div class="yb-score">${['打数','パット','FW','OB・池','メモ'].map(t=>`<div><span>${t}</span></div>`).join('')}</div>
   <div class="yb-foot">${IL?esc(IL.credit)+'（縮図・距離は目安）':''}<span>${h[0]}</span></div>
  </div>`;
}
function ybCover(x){
  const cl=YB_ORDER.map(c=>MYCLUBS&&MYCLUBS[c]).filter(Boolean);
  const H=x.holes;const sum=(a,i)=>a.reduce((s,h)=>s+h[i],0);const out=H.filter(h=>h[0]<=9),inn=H.filter(h=>h[0]>=10);
  return `<div class="yb-card yb-cover">
   <div class="yb-ctitle">${esc(x.course)}</div>
   <div class="yb-mut">${+x.date.slice(5,7)}/${+x.date.slice(8)}（${'日月火水木金土'[new Date(x.date+'T00:00').getDay()]}）${esc(x.time||'')}・${esc(x.tee||'')}</div>
   <div class="yb-big">${esc(x.planName)}プラン 目標 <b>${x.target}</b><span class="yb-mut">（OUT ${sum(out,4)}・IN ${sum(inn,4)}・上限 ${x.limit||99}）</span></div>
   ${x.rules?`<div class="yb-sec">当日の約束</div><ol>${x.rules.map(r=>`<li><b>${esc(r[0])}</b></li>`).join('')}</ol>`:''}
   <div class="yb-sec">自分の飛距離（トラックマン）</div>
   <table class="yb-tbl"><tr><th>クラブ</th><th>キャリー</th><th>トータル</th><th>左右</th></tr>${cl.map(c=>`<tr><td>${c.c}</td><td>${Math.round(c.carry)}</td><td>${Math.round(c.total||c.carry)}</td><td>${c.side!=null?(c.side>0?'右':'左')+Math.abs(Math.round(c.side)):'－'}</td></tr>`).join('')}</table>
   <div class="yb-foot">作成 ${new Date().toLocaleDateString('ja-JP')}・最新データで作り直すには、アプリで開き直して印刷<span>表紙</span></div>
  </div>`;
}
function ybScoreCard(x){
  const H=x.holes;const row=hs=>`<tr><th>H</th>${hs.map(h=>`<td>${h[0]}</td>`).join('')}<th>計</th></tr><tr><th>Par</th>${hs.map(h=>`<td>${h[1]}</td>`).join('')}<th>${hs.reduce((s,h)=>s+h[1],0)}</th></tr><tr><th>目標</th>${hs.map(h=>`<td>${h[4]}</td>`).join('')}<th>${hs.reduce((s,h)=>s+h[4],0)}</th></tr><tr class="yb-w"><th>打数</th>${hs.map(()=>'<td></td>').join('')}<th></th></tr><tr class="yb-w"><th>パット</th>${hs.map(()=>'<td></td>').join('')}<th></th></tr>`;
  return `<div class="yb-card yb-cover"><div class="yb-ctitle">スコア</div>
   <div class="yb-sec">OUT</div><table class="yb-tbl yb-sc">${row(H.filter(h=>h[0]<=9))}</table>
   <div class="yb-sec">IN</div><table class="yb-tbl yb-sc">${row(H.filter(h=>h[0]>=10))}</table>
   <div class="yb-big">合計 ＿＿＿＿　パット ＿＿＿＿</div>
   <div class="yb-sec">今日よかったこと・次の課題</div><div class="yb-lines">${'<div></div>'.repeat(6)}</div>
   <div class="yb-foot"><span>裏表紙</span></div></div>`;
}
function drawYardageBook(){
  const x0=ybPlan(YB.date,YB.plan);const x={...x0,planName:YB.plan?(x0.plans[YB.plan].name):'100切り'};
  const alt=YB.plan?'':Object.keys(x0.plans||{})[0];const xa=x0.plans?ybPlan(YB.date,alt):null;const x2=xa?{...xa,planName:alt?(x0.plans[alt].name):'100切り'}:null;
  const order=(x.order||['out','in']).flatMap(k=>x.holes.filter(h=>k==='out'?h[0]<=9:h[0]>=10));
  const cards=[ybCover(x),...order.map(h=>ybCard(x,h,x2)),ybScoreCard(x)];
  // 切って重ねるだけで順番になる並べ方：シートs・位置p に cards[p*S+s]
  const S=Math.ceil(cards.length/4);const sheets=[...Array(S)].map((_,s)=>[0,1,2,3].map(p=>cards[p*S+s]||'<div class="yb-card"></div>'));
  let el=$('yb');if(!el){el=document.createElement('div');el.id='yb';document.body.appendChild(el);document.body.style.overflow='hidden';document.body.classList.add('yb-open');}
  el.innerHTML=`<div class="yb-bar">
    <button class="btn-sm" onclick="closeYardageBook()">✕ 閉じる</button>
    ${x0.plans?`<div class="seg !p-0.5 text-[12px]"><button class="${YB.plan?'':'on'} !min-h-[34px] !px-2" onclick="YB.plan='';drawYardageBook()">100切り</button>${Object.entries(x0.plans).map(([k,P])=>`<button class="${YB.plan===k?'on':''} !min-h-[34px] !px-2" onclick="YB.plan='${k}';drawYardageBook()">${P.name}</button>`).join('')}</div>`:''}
    <button class="btn !min-h-[38px] !px-3" onclick="window.print()">🖨 印刷</button></div>
   <div class="yb-help">A4で<b>倍率100％（実際のサイズ）・余白なし</b>で印刷 → ${S}枚を重ねて点線で十字に切る → <b>左上→右上→左下→右下</b>の束の順に重ねると、表紙・1〜18番・スコアの順になります → 左はじをホッチキスで留める。</div>
   <div class="yb-screen">${cards.join('')}</div>
   <div class="yb-print">${sheets.map(c=>`<div class="yb-sheet">${c.join('')}<i class="yb-cut-v"></i><i class="yb-cut-h"></i></div>`).join('')}</div>`;
  const fit=()=>{const sc=el.querySelector('.yb-screen');if(!sc)return;const pw=YB_CARD_W*96/25.4;sc.style.zoom=Math.min(1.4,(el.clientWidth-16)/pw);};fit();
  // 文字があふれるカードは文字を小さくする（印刷用にも同じ大きさを写す）
  requestAnimationFrame(()=>{const sc=[...el.querySelectorAll('.yb-screen .yb-txt')];const fs=sc.map(t=>{let f=9;t.style.fontSize=f+'pt';while(t.scrollHeight>t.clientHeight+1&&f>4.6){f-=.2;t.style.fontSize=f+'pt';}return f;});
    const pr=[...el.querySelectorAll('.yb-print .yb-card')];const idx=sheets.flatMap((c,s)=>[0,1,2,3].map(p=>p*S+s));
    const scards=[...el.querySelectorAll('.yb-screen .yb-card')];
    pr.forEach((c,i)=>{const t=c.querySelector('.yb-txt');const ci=idx[i];const st=scards[ci]&&scards[ci].querySelector('.yb-txt');if(t&&st)t.style.fontSize=st.style.fontSize;});});
}
