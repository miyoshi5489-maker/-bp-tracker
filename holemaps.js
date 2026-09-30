// ─────────────────────────────────────────────
// ホールマップ（ヤーデージブック風の図）
//   座標はヤード。y＝レギュラーティーからの前方向の距離、x＝左右（右がプラス）。
//   c：フェアウェイの中心線（ティー→グリーン）
//   hz：障害物 w=池 b=バンカー ob=OB(サイド) t=目印の木 v=谷
//   t：狙い [x, y, 'クラブ']（1打目、2打目、3打目…）
//   n：ホールの特徴（ショットナビのホール解説などを要約）
// ─────────────────────────────────────────────
const HOLE_MAPS={
 tojo:{
  1:{c:[[0,0],[0,200],[-5,307]],hz:[{t:'w',x:-40,y:100,rx:14,ry:22},{t:'b',x:18,y:262},{t:'b',x:26,y:250},{t:'b',x:-15,y:270}],t:[[5,190,'UT']],n:'左ドッグレッグ気味。ティー前方の左に池（80〜120y）。グリーンは少し高い受けグリーンで、2打目のクラブ選びがポイント。'},
  2:{c:[[0,0],[8,220],[0,330],[0,485]],hz:[{t:'w',x:-42,y:290,rx:10,ry:40},{t:'w',x:-5,y:340,rx:42,ry:16},{t:'w',x:-38,y:455,rx:10,ry:18},{t:'b',x:-28,y:270},{t:'b',x:-25,y:290}],t:[[8,220,'1W'],[0,305,'8I 刻む'],[0,455,'UT 池越え']],n:'1打目はやや打ち上げで右寄りが狙い目。2打目の先に池が横切る。距離を残すと木がじゃまになる。グリーン奥は危険。'},
  3:{c:[[0,0],[5,150],[-5,250],[-25,330]],hz:[{t:'w',x:12,y:95,rx:30,ry:30},{t:'b',x:-32,y:230},{t:'b',x:28,y:255},{t:'b',x:22,y:270}],t:[[10,185,'UT']],n:'池越えの左ドッグレッグ。距離を欲張らず真ん中へ。グリーン奥は危険なので手前から。'},
  4:{c:[[0,0],[0,300],[0,418]],hz:[{t:'w',x:-22,y:25,rx:12,ry:12},{t:'b',x:-32,y:310},{t:'b',x:-25,y:325}],t:[[0,220,'1W'],[0,330,'7I']],n:'1打目はフェアウェイ中央。グリーン手前が狭いので、2打目は無理せず曲げないこと。'},
  5:{c:[[0,0],[0,345]],hz:[{t:'ob',side:'R',from:0,to:345},{t:'b',x:22,y:140}],t:[[0,190,'UT']],n:'真ん中狙い。欲張って左へ落とすと2打目でグリーンを狙えない。右はOB。'},
  6:{c:[[0,0],[0,189]],hz:[{t:'w',x:28,y:110,rx:22,ry:65},{t:'b',x:16,y:170}],t:[],n:'グリーンは大きく右に傾斜。風とピン位置を見て、左側から攻める。'},
  7:{c:[[0,0],[0,430]],hz:[{t:'b',x:-18,y:410},{t:'b',x:18,y:415}],t:[[0,220,'1W'],[0,340,'7I']],n:'真ん中狙い。左へ曲げると隣のホールでセーフだが、2打目でグリーンを狙えない。'},
  8:{c:[[0,0],[10,210],[-5,340],[0,487]],hz:[{t:'ob',side:'R',from:220,to:487},{t:'w',x:32,y:440,rx:10,ry:35}],t:[[10,215,'1W'],[-8,360,'7I'],],n:'S字のロング。1打目は右側、2打目は左側が狙い目。2打目から右はOBが出やすい。'},
  9:{c:[[0,0],[0,137]],hz:[{t:'w',x:10,y:65,rx:38,ry:50}],t:[],n:'池越えのショート。グリーン中央が安全。少し大きめのクラブで。'},
  10:{c:[[0,0],[3,200],[-8,360]],hz:[{t:'b',x:-20,y:185},{t:'w',x:36,y:95,rx:8,ry:12},{t:'v',side:'L',from:300,to:370},{t:'b',x:12,y:330}],t:[[6,205,'1W']],n:'1打目はクロスバンカーの右側が狙い目。グリーン左は深い谷。'},
  11:{c:[[0,0],[-5,200],[0,370]],hz:[{t:'b',x:-25,y:250},{t:'w',x:30,y:335,rx:10,ry:18},{t:'b',x:-15,y:355},{t:'b',x:18,y:350}],t:[[-8,190,'UT'],[0,290,'9I']],n:'1打目は左のクロスバンカー方向へ。2打目は打ち下ろし。グリーンオーバーは禁物。'},
  12:{c:[[0,0],[15,150],[22,260],[0,380],[-15,487]],hz:[{t:'w',x:32,y:50,rx:14,ry:16},{t:'w',x:-15,y:170,rx:16,ry:10},{t:'b',x:-15,y:455},{t:'b',x:12,y:470}],t:[[15,200,'1W'],[8,350,'7I']],n:'S字のロング。1打目は中央。2打目はフェアウェイ左側が3打目に有利。'},
  13:{c:[[0,0],[0,350]],hz:[{t:'w',x:-18,y:85,rx:28,ry:30},{t:'ob',side:'R',from:120,to:350}],t:[[-8,190,'UT']],n:'1打目は中央より左。フェアウェイは右に傾いていて、右に曲げるとOB。'},
  14:{c:[[0,0],[0,151]],hz:[{t:'b',x:-14,y:132},{t:'b',x:10,y:140}],t:[],n:'打ち上げでピンは見えない。右側が安全。'},
  15:{c:[[0,0],[10,250],[0,380],[-15,480]],hz:[{t:'w',x:-32,y:95,rx:10,ry:16},{t:'w',x:28,y:100,rx:12,ry:16},{t:'b',x:-18,y:460},{t:'b',x:8,y:470}],t:[[8,220,'1W'],[0,370,'7I']],n:'1打目はフェアウェイ中央。3打目は前下がりでグリーンも速い。手前から攻めればパーは固い。'},
  16:{c:[[0,0],[5,311]],hz:[{t:'b',x:-14,y:290},{t:'b',x:15,y:295}],t:[[8,185,'UT']],n:'やや打ち上げのブラインドホール。フェアウェイ右側が狙い目。2打目をグリーン左に落とすとトラブル。'},
  17:{c:[[0,0],[0,147]],hz:[{t:'b',x:-15,y:130},{t:'b',x:15,y:132}],t:[],n:'風とピン位置で距離が変わる。2段グリーンで傾斜があり、1パット目が大事。'},
  18:{c:[[0,0],[-5,250],[0,414]],hz:[{t:'t',x:0,y:235},{t:'b',x:15,y:400},{t:'b',x:-12,y:395}],t:[[-5,215,'1W'],[-8,330,'8I']],n:'打ち下ろし。正面の楠の木が狙い目。2打目は左側から。グリーン右は要注意。'},
 },
 taka:{
  1:{c:[[0,0],[0,300],[5,420],[8,500]],hz:[{t:'w',x:-48,y:185,rx:12,ry:22},{t:'b',x:-35,y:250},{t:'b',x:22,y:400},{t:'b',x:18,y:445}],t:[[0,230,'1W'],[-5,390,'7I']],n:'打ち下ろしのロング。1打目はセンター。2打目は右のバンカーを避ける。グリーンは右奥から手前に傾いていて、ピンの左手前が狙い目。'},
  2:{c:[[0,0],[0,382]],hz:[{t:'ob',side:'R',from:0,to:382},{t:'t',x:0,y:235},{t:'b',x:-30,y:245},{t:'b',x:30,y:250},{t:'w',x:-45,y:70,rx:8,ry:12},{t:'b',x:-15,y:358},{t:'b',x:18,y:362}],t:[[0,215,'1W'],[0,285,'9I']],n:'フェアウェイ中央に大きな松の木。両サイドのバンカーを避けて松の木狙い。右はグリーンまでずっとOB。左の林はセーフだが出しにくい。'},
  3:{c:[[0,0],[0,375]],hz:[{t:'b',x:25,y:195},{t:'ob',side:'R',from:150,to:375},{t:'w',x:-50,y:285,rx:8,ry:10},{t:'b',x:20,y:340},{t:'b',x:8,y:385}],t:[[-8,220,'1W'],[0,290,'9I']],n:'真っすぐだが難しい。右のバンカーの先はすぐOB。左の林はセーフだが脱出が大変。2段グリーンで距離感が難しい。'},
  4:{c:[[0,0],[0,127]],hz:[{t:'w',x:-8,y:70,rx:48,ry:32},{t:'b',x:0,y:108}],t:[],n:'大きな池越えのショート。風の向きと手前のバンカーに注意。'},
  5:{c:[[0,0],[10,230],[0,380],[0,503]],hz:[{t:'w',x:15,y:140,rx:4,ry:30},{t:'w',x:-22,y:440,rx:8,ry:25},{t:'w',x:22,y:445,rx:8,ry:22}],t:[[12,230,'1W'],[0,380,'7I']],n:'フェアウェイは右から左に傾いているので、1打目は右サイド。グリーン手前の両側に池。左の林はセーフだが出しにくい。'},
  6:{c:[[0,0],[0,169]],hz:[{t:'b',x:-12,y:128}],t:[],n:'見た目は攻めやすい。風に注意。受けグリーンなので手前から。'},
  7:{c:[[0,0],[5,180],[0,280],[-15,384]],hz:[{t:'w',x:-25,y:135,rx:14,ry:14},{t:'w',x:48,y:200,rx:10,ry:25},{t:'w',x:35,y:345,rx:10,ry:22},{t:'b',x:-28,y:230},{t:'t',x:0,y:215}],t:[[8,190,'5W'],[5,300,'8I']],n:'フェアウェイ中央に松の木。左ドッグレッグ。グリーン手前の池が効いている。'},
  8:{c:[[0,0],[-5,190],[-10,332]],hz:[{t:'ob',side:'R',from:0,to:332},{t:'w',x:40,y:125,rx:8,ry:30}],t:[[-8,190,'UT']],n:'短いミドル。右に突き抜けるとOB。フェアウェイは左から右に傾いていて、跳ねて右OBもある。3段グリーンは左から右への傾斜がきついので左狙い。'},
  9:{c:[[0,0],[8,220],[0,383]],hz:[{t:'t',x:-25,y:330},{t:'b',x:-20,y:372},{t:'b',x:10,y:378}],t:[[10,220,'1W'],[5,300,'9I']],n:'打ち下ろし。右フェアウェイが正解。左半分は傾斜がきつく、グリーン手前左のメタセコイアがじゃまになる。'},
  10:{c:[[0,0],[-25,120],[-30,200],[-15,260],[10,330]],hz:[{t:'ob',side:'R',from:0,to:330},{t:'b',x:-5,y:225},{t:'b',x:-5,y:305}],t:[[-25,180,'UT']],n:'右ドッグレッグ。距離を稼ごうと右を狙うと危険。2打目はつま先下がりで右に行きやすく、右はすぐOB。2段グリーンの右もすぐOB。'},
  11:{c:[[0,0],[0,200],[10,352]],hz:[{t:'ob',side:'R',from:0,to:352},{t:'b',x:0,y:228},{t:'b',x:-10,y:335},{t:'b',x:22,y:340}],t:[[-5,190,'5W']],n:'少し右に曲がった打ち上げ。右はすぐOB。2打目はグリーン面が見えないので奥の目印を狙う。グリーンオーバーはOB。'},
  12:{c:[[0,0],[0,398]],hz:[{t:'ob',side:'L',from:0,to:398},{t:'b',x:-22,y:215},{t:'b',x:-20,y:238},{t:'b',x:20,y:225}],t:[[5,200,'5W'],[0,300,'8I']],n:'打ち下ろしで真っすぐ。右に打っても傾斜で戻ってくる。左は狭く、すぐOB。'},
  13:{c:[[0,0],[0,530]],hz:[{t:'ob',side:'L',from:0,to:530},{t:'ob',side:'R',from:0,to:530},{t:'b',x:25,y:280},{t:'b',x:-18,y:470}],t:[[0,200,'5W'],[0,350,'7I'],[0,480,'9I']],n:'だんだん狭くなるロング。左右OB。信号で前の組を確認。距離より得意クラブでフェアウェイキープ。'},
  14:{c:[[0,0],[0,148]],hz:[{t:'v',side:'C',from:45,to:105},{t:'b',x:-15,y:118}],t:[],n:'深い谷越え。手前のバンカーは深く、ラフの傾斜もきついので少し大きめが安全。ピンが左でも右から。'},
  15:{c:[[0,0],[0,200],[-5,330]],hz:[{t:'w',x:18,y:300,rx:8,ry:12},{t:'b',x:-15,y:305}],t:[[0,180,'UT'],[0,255,'刻むなら']],n:'短いミドル。信号で前の組を確認。グリーン手前の池に注意。受けグリーンなので手前から。グリーンオーバーはOB。'},
  16:{c:[[0,0],[-30,150],[-30,230],[0,300],[15,353]],hz:[{t:'ob',side:'L',from:150,to:353},{t:'b',x:-5,y:325}],t:[[-28,180,'UT']],n:'右ドッグレッグ。見た目より短い。ドライバーは突き抜けてOBの恐れ。180yで刻んで2打目勝負。左はすぐOB。'},
  17:{c:[[0,0],[0,159]],hz:[{t:'v',side:'C',from:40,to:110},{t:'b',x:-18,y:148},{t:'b',x:15,y:140}],t:[],n:'谷越えのショート。風に注意。グリーン手前のバンカーは深く、ラフの斜面もきつい。'},
  18:{c:[[0,0],[0,250],[8,386]],hz:[{t:'ob',side:'R',from:0,to:386},{t:'b',x:18,y:250},{t:'b',x:-15,y:375},{t:'b',x:15,y:370}],t:[[-10,215,'1W']],n:'少し右に曲がったミドル。右はすぐOB。ティーショットは左サイド。2打目でピンを攻めやすくなる。'},
 },
};

// ── 図を描く ──
function holeLen(c){let s=0;for(let i=1;i<c.length;i++)s+=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);return s;}
function alongPt(c,d){ // 中心線上でティーから d ヤードの点
  for(let i=1;i<c.length;i++){const L=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);if(d<=L){const r=d/L;return[c[i-1][0]+(c[i][0]-c[i-1][0])*r,c[i-1][1]+(c[i][1]-c[i-1][1])*r];}d-=L;}
  return c[c.length-1];}
function holeSVG(m,par,yards){
  const c=m.c,G=c[c.length-1];const P=([x,y])=>`${x},${-y}`;
  const xs=[...c.map(p=>p[0]),...m.hz.map(h=>h.x||0)];let minX=Math.min(...xs)-72,maxX=Math.max(...xs)+72;if(maxX-minX<230){const e=(230-(maxX-minX))/2;minX-=e;maxX+=e;}
  const top=G[1]+34;const W=maxX-minX,H=top+30;
  const line=c.map(P).join(' ');
  const off=(dx,from,to)=>{const pts=[];for(let d=from;d<=to;d+=10){const p=alongPt(c,d);pts.push([p[0]+dx,p[1]]);}return pts.map(P).join(' ');};
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${-top} ${W} ${H}" class="block h-auto w-full" font-family="sans-serif">`;
  s+=`<rect x="${minX}" y="${-top}" width="${W}" height="${H}" fill="#2f5d31"/>`;
  s+=`<polyline points="${line}" fill="none" stroke="#4d8a43" stroke-width="86" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(par>3)s+=`<polyline points="${off(0,Math.min(120,yards*0.35),Math.max(0,holeLen(c)-25))}" fill="none" stroke="#7cc160" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 谷
  m.hz.filter(h=>h.t==='v').forEach(h=>{const a=alongPt(c,h.from),b=alongPt(c,h.to);const w=h.side==='C'?W:Math.max(10,a[0]-20-minX);s+=`<rect x="${minX}" y="${-b[1]}" width="${w}" height="${b[1]-a[1]}" fill="#6b5a3a" opacity=".8"/><text x="${h.side==='C'?a[0]+30:minX+6}" y="${-(a[1]+b[1])/2+4}" font-size="11" fill="#f5e9c8">谷</text>`;});
  // 池
  m.hz.filter(h=>h.t==='w').forEach(h=>{s+=`<ellipse cx="${h.x}" cy="${-h.y}" rx="${h.rx}" ry="${h.ry}" fill="#3d8fd6" stroke="#2a6fae" stroke-width="1.5"/>`;});
  // バンカー
  m.hz.filter(h=>h.t==='b').forEach(h=>{s+=`<ellipse cx="${h.x}" cy="${-h.y}" rx="8" ry="6" fill="#efe2b8" stroke="#cdb983" stroke-width="1"/>`;});
  // 障害物までの距離（ティーから）
  m.hz.filter(h=>h.t==='w'||h.t==='b').forEach(h=>{const ry=h.t==='w'?h.ry:6,rx=h.t==='w'?h.rx:8;const f=Math.round(h.y-ry),k=Math.round(h.y+ry);
    const cx0=alongPt(c,h.y)[0];const left=h.x<cx0;const tx=left?h.x-rx-3:h.x+rx+3;
    s+=`<text x="${tx}" y="${-h.y+3}" font-size="8.5" font-weight="bold" fill="#fff" stroke="#123" stroke-width="2.2" paint-order="stroke" text-anchor="${left?'end':'start'}">${h.t==='w'?`${f}〜${k}y`:`${f}y/越え${k}`}</text>`;});
  // 目印の木
  m.hz.filter(h=>h.t==='t').forEach(h=>{s+=`<circle cx="${h.x}" cy="${-h.y}" r="7" fill="#1d3f1e" stroke="#0f2a10"/><text x="${h.x+10}" y="${-h.y+4}" font-size="10" fill="#fff">目印の木</text>`;});
  // OB
  m.hz.filter(h=>h.t==='ob').forEach(h=>{const dx=h.side==='L'?-47:47;s+=`<polyline points="${off(dx,h.from,h.to)}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5"/>`;const p=alongPt(c,(h.from+h.to)/2);s+=`<text x="${p[0]+dx+(h.side==='L'?-4:4)}" y="${-p[1]}" font-size="11" font-weight="bold" fill="#fff" text-anchor="${h.side==='L'?'end':'start'}">OB</text>`;});
  // 残り距離の目盛り
  const len=holeLen(c);
  if(par>3)[250,200,150,100,50].forEach(r=>{const d=len-r;if(d<30)return;const p=alongPt(c,d);s+=`<line x1="${p[0]-17}" y1="${-p[1]}" x2="${p[0]+17}" y2="${-p[1]}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/><text x="${p[0]-20}" y="${-p[1]+3.5}" font-size="9" fill="#fff" fill-opacity=".8" text-anchor="end">${r}</text>`;});
  // グリーンとティー
  s+=`<circle cx="${G[0]}" cy="${-G[1]}" r="15" fill="#9be07f" stroke="#e8f7df" stroke-width="1.5"/><line x1="${G[0]}" y1="${-G[1]}" x2="${G[0]}" y2="${-G[1]-18}" stroke="#fff" stroke-width="1.5"/><path d="M${G[0]} ${-G[1]-18} l10 3.5 l-10 3.5z" fill="#e53935"/>`;
  s+=`<rect x="-7" y="-6" width="14" height="10" rx="2" fill="#b7e39c" stroke="#fff"/>`;
  // 狙い
  let prev=[0,0];const T=m.t||[];
  T.forEach((t,i)=>{s+=`<line x1="${prev[0]}" y1="${-prev[1]}" x2="${t[0]}" y2="${-t[1]}" stroke="#ffd54a" stroke-width="2" stroke-dasharray="5 4"/>`;prev=t;});
  s+=`<line x1="${prev[0]}" y1="${-prev[1]}" x2="${G[0]}" y2="${-G[1]}" stroke="#ffd54a" stroke-width="2" stroke-dasharray="5 4"/>`;
  prev=[0,0];
  T.forEach((t,i)=>{const d=Math.round(Math.hypot(t[0]-prev[0],t[1]-prev[1]));const rest=Math.round(Math.hypot(G[0]-t[0],G[1]-t[1]));prev=t;
    const right=(maxX-t[0])>=(t[0]-minX);const tx=right?t[0]+14:t[0]-14;
    s+=`<circle cx="${t[0]}" cy="${-t[1]}" r="12" fill="#ffd54a" fill-opacity=".25" stroke="#ffd54a" stroke-width="2.5"/><text x="${t[0]}" y="${-t[1]+4}" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">${i+1}</text>`;
    s+=`<g font-size="10" font-weight="bold"><rect x="${right?tx:tx-86}" y="${-t[1]-13}" width="86" height="26" rx="4" fill="#111" fill-opacity=".72"/><text x="${right?tx+5:tx-81}" y="${-t[1]-2}" fill="#ffd54a">${i+1}打目 ${esc(t[2]||'')}</text><text x="${right?tx+5:tx-81}" y="${-t[1]+10}" fill="#fff">${d}y・残り${rest}y</text></g>`;});
  s+='</svg>';return s;
}

// ティーからの距離の一覧
function hazList(m,yards){const c=m.c,G=c[c.length-1];const len=Math.round(holeLen(c));const side=h=>{const x0=alongPt(c,h.y||0)[0];const d=(h.x||0)-x0;return d<-6?'左':d>6?'右':'正面';};
  const L=[];
  m.hz.slice().sort((a,b)=>(a.y||a.from||0)-(b.y||b.from||0)).forEach(h=>{
    if(h.t==='b')L.push(`⛱ ${side(h)}バンカー <b>${Math.round(h.y-6)}y</b>（越え${Math.round(h.y+6)}）`);
    else if(h.t==='w')L.push(`💧 ${side(h)}の池 <b>${Math.round(h.y-h.ry)}y</b>（越え${Math.round(h.y+h.ry)}）`);
    else if(h.t==='v')L.push(`⛰ 谷 <b>${h.from}y</b>（越え${h.to}）`);
    else if(h.t==='ob')L.push(`⚠ ${h.side==='L'?'左':'右'}OB ${h.from?h.from+'y〜':''}`);
    else if(h.t==='t')L.push(`🌲 目印の木 <b>${h.y}y</b>`);});
  L.push(`⛳ グリーン中央 <b>${yards||len}y</b>`);return L;}

// ── 全画面で開く ──
let HM=null;
function openHoleMap(date,no){
  const x=ROUND_BASE(date);if(!x||!x.mapKey)return;const M=HOLE_MAPS[x.mapKey];
  const order=(x.order||['out','in']).flatMap(k=>x.holes.filter(h=>k==='out'?h[0]<=9:h[0]>=10)).map(h=>h[0]);
  HM={date,no,order,z:1};drawHoleMap();
}
function drawHoleMap(){
  const x=ROUND_BASE(HM.date);const h=x.holes.find(r=>r[0]===HM.no);const m=HOLE_MAPS[x.mapKey][HM.no];
  const i=HM.order.indexOf(HM.no);const pv=HM.order[i-1],nx=HM.order[i+1];
  let el=$('holemap');if(!el){el=document.createElement('div');el.id='holemap';el.className='fixed inset-0 z-40 flex flex-col bg-bg';document.body.appendChild(el);document.body.style.overflow='hidden';}
  const col=h[7]==='hard'?'bg-warn':h[7]==='mid'?'bg-sand':'bg-accent';
  el.innerHTML=`
   <div class="flex items-center gap-2 border-b border-line bg-surface px-3 py-2" style="padding-top:calc(env(safe-area-inset-top,0px) + 8px)">
    <span class="grid h-10 w-10 place-items-center rounded-lg ${col} font-mono text-lg font-bold text-surface">${h[0]}</span>
    <div class="min-w-0 flex-1"><div class="font-bold leading-tight">Par${h[1]}・${h[2]}y</div><div class="text-[12px] text-muted">目標 <b class="text-accent">${h[4]}</b>　ティー ${esc(h[5])}</div></div>
    <button class="btn-sm" onclick="closeHoleMap()">閉じる</button>
   </div>
   <div class="relative min-h-0 flex-1">
    <div id="hm-scroll" class="absolute inset-0 overflow-auto bg-[#2f5d31]" style="touch-action:pan-x pan-y">
     <div id="hm-in" class="mx-auto py-1">${holeSVG(m,h[1],h[2])}</div>
    </div>
    <div class="absolute right-3 top-3 z-10 grid gap-2">
     <button class="grid h-11 w-11 place-items-center rounded-full bg-surface text-xl font-bold shadow-lg" onclick="zoomHoleMap(1)" aria-label="拡大">＋</button>
     <button class="grid h-11 w-11 place-items-center rounded-full bg-surface text-xl font-bold shadow-lg" onclick="zoomHoleMap(-1)" aria-label="縮小">－</button>
    </div>
   </div>
   <div class="grid gap-2 border-t border-line bg-surface p-3" style="padding-bottom:calc(env(safe-area-inset-bottom,0px) + 12px)">
    <div class="text-[13px] leading-snug"><b class="text-accent">狙い</b>　${esc(h[6])}</div>
    ${m.n?`<div class="text-[12px] leading-snug text-muted"><b>コース</b>　${esc(m.n)}</div>`:''}
    <div class="flex flex-wrap gap-1">${hazList(m,h[2]).map(t=>`<span class="rounded-md bg-field px-1.5 py-0.5 text-[11px] ring-1 ring-line">${t}</span>`).join('')}</div>
    <div class="flex gap-2"><button class="btn-sub flex-1 !py-2" ${pv?`onclick="HM.no=${pv};HM.z=1;drawHoleMap()"`:'disabled style="opacity:.4"'}>‹ ${pv?pv+'番':''}</button><button class="btn-sub flex-1 !py-2" ${nx?`onclick="HM.no=${nx};HM.z=1;drawHoleMap()"`:'disabled style="opacity:.4"'}>${nx?nx+'番':''} ›</button></div>
   </div>`;
  const sc=$('hm-scroll');const vb=sc.querySelector('svg').viewBox.baseVal;HM.base=Math.min(sc.clientWidth,(sc.clientHeight-8)*vb.width/vb.height);
  $('hm-in').style.width=HM.base*HM.z+'px';
  requestAnimationFrame(()=>{sc.scrollTop=sc.scrollHeight;sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2;});
}
function zoomHoleMap(d){
  const sc=$('hm-scroll');const cx=(sc.scrollLeft+sc.clientWidth/2)/sc.scrollWidth,cy=(sc.scrollTop+sc.clientHeight/2)/sc.scrollHeight;
  HM.z=Math.max(1,Math.min(5,HM.z+d));$('hm-in').style.width=HM.base*HM.z+'px';
  requestAnimationFrame(()=>{sc.scrollLeft=cx*sc.scrollWidth-sc.clientWidth/2;sc.scrollTop=cy*sc.scrollHeight-sc.clientHeight/2;});
}
function closeHoleMap(){const el=$('holemap');if(el)el.remove();document.body.style.overflow='';HM=null;}
