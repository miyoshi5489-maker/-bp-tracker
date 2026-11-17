// ── ハザードまでの距離（ティーから）を、ホール図の画像から自動で測る ──
// バンカー（白）と池（青）のかたまりを見つけて、ルート（ティー→グリーン）に沿って
// 「手前まで」「越えるまで」の距離と左右を出す。図は縮図なので距離は目安。
// 新しいコースも ILLUS（図とルート）を入れるだけで自動で出る。結果は端末に保存して2回目から速くする。
const HZ_VER=4;
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
    out.push({t:t===1?'b':'w',f:Math.round(a0/s),c:Math.round(a1/s),x:Math.round(lat/s),g:a1>=Lr-28*s,cx:Math.round((Math.min(...xs)+Math.max(...xs))/2*k),cy:Math.round((Math.min(...ys)+Math.max(...ys))/2*k),hw:Math.round(bw/2)});}
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
function hzLines(key,n,dt){
  const L=HZ_CACHE[hzKey(key,n)];if(!L)return null;dt=dt||0;
  // 出典のある距離（HOLE_MAPS）を優先し、図から測ったものは重ならない分だけ足す
  const src=hzSrc(key,n);
  const all=[...src,...L.filter(h=>h.g||!src.some(z=>z.t===h.t&&z.c>=h.f-20&&z.f<=h.c+20))];
  const tee=[],grn=[];
  all.sort((a,b)=>a.f-b.f).forEach(h=>{const f=Math.max(0,Math.round(h.f-dt)),cc=Math.round(h.c-dt);if(cc<=0)return;const nm=(h.t==='b'?'バンカー':'池');
    if(h.g)grn.push(`${hzSide(h.x)}${nm}`);
    else if(f<=320)tee.push({t:h.t,txt:`${h.t==='b'?'⛱':'💧'}${hzSide(h.x)}の${nm} <b>${f}</b>〜<b>${cc}</b>y`});});
  return {tee,grn:[...new Set(grn)]};
}

// 図の上のラベル：バンカー・池の横に「手前〜越える」ヤード（グリーン周りは除く）
function hzSvg(key,n,dt,u,wrap,W,mode){
  // mode 'out'：図の外の余白にラベルを出して、線でバンカー・池を指す（図が隠れない）
  const L=HZ_CACHE[hzKey(key,n)];if(!L)return '';dt=dt||0;u=u||1;W=W||200;const out=mode==='out';
  const src=hzSrc(key,n);const items=[];
  L.forEach(h0=>{if(h0.g||h0.cx==null)return;const z=src.filter(z=>z.t===h0.t&&z.c>=h0.f-20&&z.f<=h0.c+20).sort((a,b)=>Math.abs(a.f+a.c-h0.f-h0.c)+Math.abs(a.x-h0.x)/2-Math.abs(b.f+b.c-h0.f-h0.c)-Math.abs(b.x-h0.x)/2)[0];const h=z?{...h0,f:z.f,c:z.c}:h0;const f=Math.max(0,Math.round(h.f-dt)),c=Math.round(h.c-dt);if(c<=0||f>330)return;
    items.push({h,txt:`${f}〜${c}`,col:h.t==='b'?'#8d6e00':'#1565c0'});});
  const hh=6.4*u;let v='';
  if(out){
    ['L','R'].forEach(sd=>{const it=items.filter(o=>(o.h.cx<W/2)===(sd==='L')).sort((a,b)=>a.h.cy-b.h.cy);let last=-1e9;
      it.forEach(o=>{const w=o.txt.length*2.9*u+3*u;let y=Math.max(o.h.cy-hh/2,last+hh+1.2*u);last=y;
        const x=sd==='L'?-w-3*u:W+3*u;const ax=sd==='L'?x+w:x;const bx=sd==='L'?Math.max(0,o.h.cx-(o.h.hw||4)):Math.min(W,o.h.cx+(o.h.hw||4));
        v+=`<line x1="${ax}" y1="${y+hh/2}" x2="${bx}" y2="${o.h.cy}" stroke="#fff" stroke-width="${1.1*u}"/><line x1="${ax}" y1="${y+hh/2}" x2="${bx}" y2="${o.h.cy}" stroke="${o.col}" stroke-width="${.55*u}"/><circle cx="${bx}" cy="${o.h.cy}" r="${.9*u}" fill="${o.col}" stroke="#fff" stroke-width="${.3*u}"/>`
          +`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${1.2*u}" fill="#fff" stroke="${o.col}" stroke-width="${.5*u}"/><text x="${x+w/2}" y="${y+hh*.74}" font-size="${4.6*u}" font-weight="bold" fill="${o.col}" text-anchor="middle">${o.txt}</text>`;});});
    return v;}
  items.forEach(o=>{const h=o.h;const w=o.txt.length*2.9*u+3*u;const right=h.cx<W/2;let x=right?h.cx+(h.hw||4)+1.5*u:h.cx-(h.hw||4)-1.5*u-w;x=Math.max(1,Math.min(W-w-1,x));const y=h.cy-hh/2;
    const g=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${1.2*u}" fill="#fff" fill-opacity=".93" stroke="${o.col}" stroke-width="${.5*u}"/><text x="${x+w/2}" y="${y+hh*.74}" font-size="${4.6*u}" font-weight="bold" fill="${o.col}" text-anchor="middle">${o.txt}</text>`;
    v+=wrap?wrap(x+w/2,h.cy,g):g;});
  return v;
}
const HZ_GUT=30; // マップの左右に空ける余白（図の座標で）
