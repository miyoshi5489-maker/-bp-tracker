// ── ハザードまでの距離（ティーから）を、ホール図の画像から自動で測る ──
// バンカー（白）と池（青）のかたまりを見つけて、ルート（ティー→グリーン）に沿って
// 「手前まで」「越えるまで」の距離と左右を出す。図は縮図なので距離は目安。
// 新しいコースも ILLUS（図とルート）を入れるだけで自動で出る。結果は端末に保存して2回目から速くする。
const HZ_VER=5;
const HZ_CACHE={};
function hzKey(key,n){return 'hz:'+HZ_VER+':'+key+':'+n;}
function hzProject(r,px,py){ // ルートへの投影：沿った距離(px)と横のずれ(px、右がプラス)
  let best=null,acc=0;
  for(let i=1;i<r.length;i++){const ax=r[i-1][0],ay=r[i-1][1],bx=r[i][0],by=r[i][1];const L=Math.hypot(bx-ax,by-ay);const ux=(bx-ax)/L,uy=(by-ay)/L;
    let t=(px-ax)*ux+(py-ay)*uy;const last=i===r.length-1;const tt=Math.max(i===1?-1e9:0,Math.min(last?1e9:L,t));
    const qx=ax+ux*tt,qy=ay+uy*tt;const d=Math.hypot(px-qx,py-qy);
    if(!best||d<best.d)best={d,along:acc+tt,lat:(px-qx)*(-uy)+(py-qy)*ux};acc+=L;}
  return best;
}
function hzDetect(img,hi){
  const W=img.naturalWidth||img.width,H=img.naturalHeight||img.height;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(img,0,0);
  const D=g.getImageData(0,0,W,H).data;const k=200/W; // ルートは幅200の座標
  const typ=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++){const R=D[i*4],G=D[i*4+1],B=D[i*4+2];
    if(R>205&&G>205&&B>195&&Math.max(R,G,B)-Math.min(R,G,B)<40)typ[i]=1; // 砂（白）
    else if(B>150&&B>R+45&&B>G+15)typ[i]=2;} // 水（青）
  const seen=new Uint8Array(W*H);const out=[];const r=hi.r,s=hi.s;
  const Lr=r.reduce((t,q,i)=>i?t+Math.hypot(q[0]-r[i-1][0],q[1]-r[i-1][1]):0,0);
  for(let i=0;i<W*H;i++){if(!typ[i]||seen[i])continue;const t=typ[i];const st=[i];seen[i]=1;const px=[];
    while(st.length){const j=st.pop();px.push(j);const x=j%W,y=(j/W)|0;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const q=ny*W+nx;if(!seen[q]&&typ[q]===t){seen[q]=1;st.push(q);}}}
    const area=px.length*k*k;if(area<(t===1?10:25))continue;
    let xs=px.map(j=>j%W),ys=px.map(j=>(j/W)|0);const bw=(Math.max(...xs)-Math.min(...xs)+1)*k,bh=(Math.max(...ys)-Math.min(...ys)+1)*k;
    if(t===1&&area/(bw*bh)<0.3)continue; // カート道・文字など細いものは除く
    let a0=1e9,a1=-1e9,lat=0,dmin=1e9;for(let m=0;m<px.length;m+=Math.max(1,(px.length/400)|0)){const p=hzProject(r,xs[m]*k,ys[m]*k);a0=Math.min(a0,p.along);a1=Math.max(a1,p.along);lat+=p.lat;dmin=Math.min(dmin,p.d);}
    const nS=Math.ceil(px.length/Math.max(1,(px.length/400)|0));lat/=nS;
    if(dmin/s>70)continue; // ホールから遠すぎるもの（隣のホール）は除く
    const gx=r[r.length-1][0],gy=r[r.length-1][1];let ge=1e9;for(let m=0;m<px.length;m+=Math.max(1,(px.length/400)|0))ge=Math.min(ge,Math.hypot(xs[m]*k-gx,ys[m]*k-gy));
    out.push({t:t===1?'b':'w',f:Math.round(a0/s),c:Math.round(a1/s),x:Math.round(lat/s),g:a1>=Lr-28*s,gl:Math.round(Lr/s),ge:Math.round(ge/s),gp:a1<Lr-4*s?'手前':a0>Lr+4*s?'奥':'横',cx:Math.round((Math.min(...xs)+Math.max(...xs))/2*k),cy:Math.round((Math.min(...ys)+Math.max(...ys))/2*k),hw:Math.round(bw/2)});}
  return out.sort((a,b)=>a.f-b.f);
}
function hzLoad(key,n){
  const ck=hzKey(key,n);if(HZ_CACHE[ck])return Promise.resolve(HZ_CACHE[ck]);
  try{const v=localStorage.getItem(ck);if(v){HZ_CACHE[ck]=JSON.parse(v);return Promise.resolve(HZ_CACHE[ck]);}}catch(_){}
  const IL=(ILLUS[key]||[]).find(v=>v.holes[n]);if(!IL)return Promise.resolve(null);
  const url=IL.base+IL.ext(n);
  return fetch(url,{mode:'cors'}).then(r=>{if(!r.ok)throw 0;return r.blob();}).then(b=>new Promise((ok,ng)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=ng;im.src=URL.createObjectURL(b);}))
    .then(im=>{const res=hzDetect(im,IL.holes[n]);HZ_CACHE[ck]=res;try{localStorage.setItem(ck,JSON.stringify(res));}catch(_){}return res;}).catch(()=>{HZ_CACHE[ck]=[];return [];});
}
function hzLoadAll(key,holes){return Promise.all(holes.map(n=>hzLoad(key,n)));}
// 表示用の文：ティーから（ティーの位置のずれ dt を引く）
function hzSide(x){return x>8?'右':x<-8?'左':'中央';}
function hzSrc(key,n){const m=(typeof HOLE_MAPS!=='undefined'&&HOLE_MAPS[key]&&HOLE_MAPS[key][n])||{};const c=m.c;
  return (m.hz||[]).filter(h=>(h.t==='b'||h.t==='w')&&!h.nd&&h.y!=null).map(h=>{const e=h.t==='w'?(h.ry||10):6;let x=h.x||0;if(c&&typeof alongPt==='function')x-=alongPt(c,h.y)[0];return {t:h.t,f:h.y-e,c:h.y+e,x,src:1};});}
// 図のグリーン周りのバンカーと出典の距離を、近い組から1対1で対応させる（手前・奥が食い違う組は使わない）
function hzGMatch(L,src,gl){const used=new Set(),got=new Map();const ov=(z,h)=>z.t===h.t&&z.c>=h.f-20&&z.f<=h.c+20;
  const okp=(h,z)=>!gl||(h.gp==='手前'?z.c<=gl+5:h.gp==='奥'?z.f>=gl-5:true);
  L.filter(h=>h.g).flatMap(h=>src.filter(z=>ov(z,h)&&okp(h,z)&&Math.abs(z.f+z.c-h.f-h.c)<=30).map(z=>[Math.abs(z.f+z.c-h.f-h.c)+Math.abs(z.x-h.x),h,z])).sort((p,q)=>p[0]-q[0])
    .forEach(([,h,z])=>{if(!used.has(z)&&!got.has(h)){used.add(z);got.set(h,z);}});
  return got;}
function hzLines(key,n,dt){
  const L=HZ_CACHE[hzKey(key,n)];if(!L)return null;dt=dt||0;
  // 出典のある距離（HOLE_MAPS）を優先し、図から測ったものは重ならない分だけ足す
  const src=hzSrc(key,n);const gl=(L.find(h=>h.gl)||{}).gl||0;
  // グリーン周りのものと同じバンカー（出典の距離）は1つにまとめて、グリーン周りとして出す
  const ov=(z,h)=>z.t===h.t&&z.c>=h.f-20&&z.f<=h.c+20;
  // 図のグリーン周りのバンカーと出典の距離を、近い組から1対1で対応させる（手前・奥が食い違う組は使わない）
  const G0=L.filter(h=>h.g);const got=hzGMatch(L,src,gl);const used=new Set(got.values());
  const gs=G0.map(h=>{const z=got.get(h);return z?{...h,f:z.f,c:z.c,srcd:1}:h;});
  const src2=src.filter(z=>!used.has(z));
  // ティーのすぐ前（60y未満）に図から見つかった白いもの（文字・カート道など）は除く
  const all=[...src2,...gs,...L.filter(h=>!h.g&&h.c>=60&&!src.some(z=>ov(z,h)))];
  const tee=[],sec=[],grn=[],segs=[];const gm=new Map(); // グリーン周りは同じ側・同じ種類を1つにまとめる
  all.sort((a,b)=>a.f-b.f).forEach(h=>{const f=Math.max(0,Math.round(h.f-dt)),cc=Math.round(h.c-dt);if(cc<=0)return;const nm=(h.t==='b'?'バンカー':'池');const ic=h.t==='b'?'⛱':'💧';
    if(h.g){const k=h.t+hzSide(h.x);const o2=gm.get(k);if(!o2)gm.set(k,{...h,f,c:cc,ic,nm});else{o2.ge=Math.min(o2.ge,h.ge);o2.f=Math.min(o2.f,f);o2.c=Math.max(o2.c,cc);if(o2.gp!==h.gp)o2.gp='手前〜横';}segs.push([f,cc]);return;}
    const toG=gl?Math.max(0,gl-h.c):null;const o={t:h.t,f,c:cc,txt:`${ic}${hzSide(h.x)}の${nm} <b>${f}</b>〜<b>${cc}</b>y${toG!=null?`<span class="hzg">（越えてグリーンまで${toG}y）</span>`:''}`};
    (f<=320?tee:sec).push(o);segs.push([f,cc]);});
  gm.forEach(h=>grn.push(`${h.ic}${hzSide(h.x)}の${h.nm}${h.ge!=null?`（グリーン中央から約<b>${h.ge}</b>y・${h.gp||'横'}・ティーから${h.f}〜${h.c}y）`:''}`));
  // バンカー・池がない区間（ティーショットの範囲）
  const gaps=[];let mx=null;segs.sort((a,b)=>a[0]-b[0]).forEach(([f,c])=>{if(mx!=null&&f-mx>=8&&mx<=330)gaps.push(`${mx}〜${f}y（${f-mx}y）`);mx=mx==null?c:Math.max(mx,c);});
  // 表の行：ティーからの順に バンカー・池 と すき間 を並べ、最後にグリーン周り
  const rows=[];all.filter(h=>!h.g).forEach(h=>{const f=Math.max(0,Math.round(h.f-dt)),cc=Math.round(h.c-dt);if(cc<=0)return;rows.push({k:'h',t:h.t,sd:hzSide(h.x),f,c:cc,toG:gl?Math.max(0,gl-h.c):null});});
  {let mx=null;segs.slice().sort((a,b)=>a[0]-b[0]).forEach(([f,c])=>{if(mx!=null&&f-mx>=8&&mx<=330)rows.push({k:'gap',f:mx,c:f,w:f-mx});mx=mx==null?c:Math.max(mx,c);});}
  rows.sort((a,b)=>a.f-b.f||(a.k==='gap')-(b.k==='gap'));
  const grows=[...gm.values()].sort((a,b)=>a.f-b.f).map(h=>({k:'g',t:h.t,sd:hzSide(h.x),f:h.f,c:h.c,ge:h.ge,gp:h.gp||'横'}));
  return {tee,sec,grn:[...new Set(grn)],gaps,gl,rows,grows};
}
// 1つの表にまとめる（ヤーデージブック・ホールマップ共通）：名前｜ティーから｜グリーンまで
function hzHtml(z){if(!z)return '';const nm=t=>t==='b'?'バンカー':'池',ic=t=>t==='b'?'⛱':'💧';
  const tr=r=>r.k==='gap'?`<tr class="hzt-gap"><td>すき間 <b>${r.w}</b>y</td><td>${r.f}〜${r.c}</td><td></td></tr>`
    :r.k==='g'?`<tr><td>${ic(r.t)} ${r.sd}${nm(r.t)}</td><td><b>${r.f}</b>〜<b>${r.c}</b></td><td>中央へ <b>${r.ge}</b>・${r.gp}</td></tr>`
    :`<tr><td>${ic(r.t)} ${r.sd}${nm(r.t)}</td><td><b>${r.f}</b>〜<b>${r.c}</b></td><td>${r.toG!=null?`越えて <b>${r.toG}</b>`:''}</td></tr>`;
  const body=(z.rows||[]).map(tr).join('')||'<tr><td colspan="3">グリーンまでバンカー・池なし</td></tr>';
  return `<table class="hzt"><thead><tr><th></th><th>ティーから（y）</th><th>グリーンまで（y）</th></tr></thead><tbody>${body}${(z.grows||[]).length?`<tr class="hzt-sec"><td colspan="3">グリーン周り</td></tr>${z.grows.map(tr).join('')}`:''}</tbody></table>`;}

// 図の上のラベル：バンカー・池の横に「手前〜越える」ヤード（グリーン周りは除く）
function hzSvg(key,n,dt,u,wrap,W,mode,H){
  // mode 'out'：図の外の余白にラベルを出して、線でバンカー・池を指す（図が隠れない）
  const L=HZ_CACHE[hzKey(key,n)];if(!L)return '';dt=dt||0;u=u||1;W=W||200;const out=mode==='out';
  const src=hzSrc(key,n);const items=[];const gl=(L.find(h=>h.gl)||{}).gl||0;const gm=hzGMatch(L,src,gl);
  L.forEach(h0=>{if(h0.cx==null)return;const col=h0.t==='b'?'#8d6e00':'#1565c0';
    if(h0.g){const z=gm.get(h0);const f=Math.max(0,Math.round((z?z.f:h0.f)-dt)),c=Math.round((z?z.c:h0.c)-dt);items.push({h:h0,txt:`${f}〜${c}`,sub:`G中央へ${h0.ge}`,col,f,c});return;}
    const z=src.filter(z=>z.t===h0.t&&z.c>=h0.f-20&&z.f<=h0.c+20).sort((a,b)=>Math.abs(a.f+a.c-h0.f-h0.c)+Math.abs(a.x-h0.x)/2-Math.abs(b.f+b.c-h0.f-h0.c)-Math.abs(b.x-h0.x)/2)[0];if(!z&&h0.c<60)return;const h=z?{...h0,f:z.f,c:z.c}:h0;const f=Math.max(0,Math.round(h.f-dt)),c=Math.round(h.c-dt);if(c<=0)return;
    items.push({h,txt:`${f}〜${c}`,sub:gl?`G迄${Math.max(0,gl-h.c)}`:'',col,f,c});});
  const cw=t=>[...t].reduce((s,ch)=>s+(/[\x00-\x7f]/.test(ch)?2.9:4.6),0);
  const H1=8.4*u,H2=13*u;let v='';
  const lab=(o,x,y,w,hh)=>o.gap?`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${2*u}" fill="#e8f5e9" stroke="#2e7d32" stroke-width="${.6*u}" stroke-dasharray="${1.6*u} ${.9*u}"/><text x="${x+w/2}" y="${y+H1*.69}" font-size="${4.2*u}" font-weight="bold" fill="#1b5e20" text-anchor="middle">すき間<tspan fill="#c62828">${o.w}</tspan>y</text><text x="${x+w/2}" y="${y+H1*.69+4.6*u}" font-size="${3.6*u}" font-weight="bold" fill="#2e7d32" text-anchor="middle">${o.sub}</text>`:`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${2*u}" fill="#fff" fill-opacity="${out?1:.93}" stroke="${o.col}" stroke-width="${.5*u}"/><text x="${x+w/2}" y="${y+H1*.69}" font-size="${4.6*u}" font-weight="bold" fill="${o.col}" text-anchor="middle">${o.txt}</text>${o.sub?`<text x="${x+w/2}" y="${y+H1*.69+4.6*u}" font-size="${3.6*u}" font-weight="bold" fill="#455a64" text-anchor="middle">${o.sub}</text>`:''}`;
  if(out){
    // 左右は「コースの中心から左か右か」で決める（左のバンカーは左側の余白に）
    // すき間（バンカー・池がない区間）も同じ列に並べる：前後のバンカーの高さの間に置き、ラベルが少ない側へ（洋平さんの指示）
    if(typeof hzLines==='function'){const z=hzLines(key,n,dt);const hz=items.filter(o=>!o.h.g&&o.f!=null).map(o=>[(o.f+o.c)/2,o.h.cy]).sort((a,b)=>a[0]-b[0]);
      const cyAt=yd=>{if(hz.length<2)return hz.length?hz[0][1]:null;let k=hz.findIndex(p=>p[0]>=yd);if(k<=0)k=k<0?hz.length-1:1;const [a,b]=[hz[k-1],hz[k]];return a[1]+(b[1]-a[1])*(yd-a[0])/((b[0]-a[0])||1);};
      (z&&z.rows||[]).filter(g=>g.k==='gap').forEach(g=>{const cy=cyAt((g.f+g.c)/2);if(cy==null)return;const hs=items.filter(o=>!o.gap&&!o.h.g&&o.f!=null);const prev=hs.filter(o=>o.c<=g.f+3).sort((a,b)=>b.c-a.c)[0],next=hs.filter(o=>o.f>=g.c-3).sort((a,b)=>a.f-b.f)[0];items.push({gap:1,w:g.w,ref:prev||next,h:{cy,cx:W/2,x:null},txt:`すき間${g.w}y`,sub:`${g.f}〜${g.c}`,col:'#1b5e20'});});}
    const nL=items.filter(o=>!o.gap&&((o.h.x!=null&&Math.abs(o.h.x)>=4)?o.h.x<0:o.h.cx<W/2)).length,nR=items.filter(o=>!o.gap).length-nL;
    const side=o=>{if(o.gap)return o.ref?side(o.ref):(nL<=nR?'L':'R');const x=o.h.x;return (x!=null&&Math.abs(x)>=4)?(x<0?'L':'R'):(o.h.cx<W/2?'L':'R');};
    const HH=gl?H2:H1,G=1.4*u,J=(typeof hzGut==='function'&&hzGut()<HZ_GUT?3:8)*u;
    ['L','R'].forEach(sd=>{const it=items.filter(o=>side(o)===sd).sort((a,b)=>a.h.cy-b.h.cy);if(!it.length)return;
      const w=(Math.max(...it.map(o=>Math.max(cw(o.txt),cw(o.sub)*.8)))+7)*u; // 同じ側は全部同じ幅・同じ高さ
      const ys=[];it.forEach((o,i)=>{ys[i]=Math.max(o.h.cy-HH/2,i?ys[i-1]+HH+G:-1e9);});
      if(H){for(let i=it.length-1;i>=0;i--){ys[i]=Math.min(ys[i],(i<it.length-1?ys[i+1]-HH-G:H-HH));}}
      let ey=-1e9;
      it.forEach((o,i)=>{const y=ys[i],ly=y+HH/2;const x=sd==='L'?-w-J:W+J;const ax=sd==='L'?x+w:x;const ex=sd==='L'?0:W;
        if(o.gap){v+=lab(o,x,y,w,HH);return;} // 前後のバンカーのラベルの間に並ぶ（下の数字は前のバンカーの終わり〜次の始まり）
        const bx=sd==='L'?Math.max(0,o.h.cx-(o.h.hw||4)):Math.min(W,o.h.cx+(o.h.hw||4));ey=Math.max(o.h.cy,ey+2.6*u);
        const pts=`${ax},${ly} ${ex},${ey} ${bx},${ey} ${bx},${o.h.cy}`;
        v+=`<polyline points="${pts}" fill="none" stroke="#fff" stroke-width="${1.1*u}" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${o.col}" stroke-width="${.55*u}" stroke-linejoin="round"/><circle cx="${bx}" cy="${o.h.cy}" r="${.9*u}" fill="${o.col}" stroke="#fff" stroke-width="${.3*u}"/>`+lab(o,x,y,w,HH);});});
    return v;}
  const placed=[];// 図の中に置く時は、ラベル同士が重ならないように上下にずらす
  items.sort((p,q)=>p.h.cy-q.h.cy).forEach(o=>{const h=o.h;const hh=o.sub?H2:H1;const w=(Math.max(cw(o.txt),cw(o.sub)*.8)+7)*u;const right=h.cx<W/2;let x=right?h.cx+(h.hw||4)+1.5*u:h.cx-(h.hw||4)-1.5*u-w;x=Math.max(1,Math.min(W-w-1,x));let y=h.cy-hh/2;
    for(let k=0;k<12;k++){const hit=placed.find(b=>x<b.x+b.w+1&&x+w+1>b.x&&y<b.y+b.h+1&&y+hh+1>b.y);if(!hit)break;y=hit.y+hit.h+1.2*u;}placed.push({x,y,w,h:hh});
    const g=lab(o,x,y,w,hh);v+=wrap?wrap(x+w/2,h.cy,g):g;});
  return v;
}
const HZ_GUT=100; // マップの左右に空ける余白（画面のpx）
function hzGut(){return window.matchMedia('(min-width:768px)').matches?HZ_GUT:62;} // スマホ（マップが左の細い列）は余白を小さく
