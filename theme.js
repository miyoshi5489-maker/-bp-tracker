// ─────────────────────────────────────────────
// カラーパレット … 画面全体の色を切り替える
// プリセット（メイン・サブ・ポイントの3色）か、自分で3色を選んで作る
// ─────────────────────────────────────────────
(function(){
const PRESETS=[
  ['マスターズ','#1d6a47','#0e7490','#f2b632'],
  ['サンセット','#e8590c','#c2255c','#fcc419'],
  ['オーシャン','#0b6fb8','#0891b2','#ffb703'],
  ['ネオン','#7c3aed','#db2777','#a3e635'],
  ['ファイア','#d9480f','#c92a2a','#ffd43b'],
  ['ミッドナイト','#3b5bdb','#7048e8','#22d3ee'],
  ['桜','#d6336c','#ae3ec9','#ffa94d'],
  ['フォレスト','#2b8a3e','#5c940d','#fd7e14'],
  ['ロイヤル','#4c3ccf','#1c7ed6','#fab005'],
  ['キャンディ','#e64980','#7950f2','#15aabf'],
  ['侍ブルー','#1c4fd8','#0b7285','#f03e3e'],
  ['カーボン','#343a40','#495057','#40c057'],
];
const hex2hsl=x=>{x=x.replace('#','');if(x.length===3)x=x.split('').map(c=>c+c).join('');
  const r=parseInt(x.slice(0,2),16)/255,g=parseInt(x.slice(2,4),16)/255,b=parseInt(x.slice(4,6),16)/255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}
  return [Math.round(h),Math.round(s*100),Math.round(l*100)];};
const hsl=(h,s,l)=>`hsl(${h} ${Math.round(s)}% ${Math.round(l)}%)`;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// 文字に使う色は読みやすい明るさに寄せる（ライトは暗め・ダークは明るめ）
const ink=([h,s,l],dark)=>hsl(h,s,dark?clamp(l,62,78):clamp(l,22,40));
const fill=([h,s,l],dark)=>hsl(h,s,dark?clamp(l,38,55):clamp(l,30,48)); // 白い文字を乗せる面
function tokens(p,dark){
  const A=hex2hsl(p[1]),B=hex2hsl(p[2]),C=hex2hsl(p[3]);const h=A[0],ns=Math.min(A[1],40)*0.35;
  const base=dark?{
    '--bg':hsl(h,ns*0.8,7),'--surface':hsl(h,ns*0.8,11),'--field':hsl(h,ns*0.8,14),'--fg':hsl(h,ns*0.5,92),'--muted':hsl(h,ns*0.5,66),'--line':hsl(h,ns*0.7,20),
    '--accent-soft':hsl(h,A[1]*0.5,17),'--accent2-soft':hsl(B[0],B[1]*0.5,17),'--pop-soft':hsl(C[0],C[1]*0.5,17),'--photo':'#070908',
    '--sand':hsl(40,58,64),'--sand-soft':hsl(40,32,15),'--sky':hsl(206,62,69),'--sky-soft':hsl(206,32,16),
    '--plum':hsl(275,42,74),'--plum-soft':hsl(275,20,17),'--warn':hsl(12,62,66),'--warn-soft':hsl(12,32,16),
  }:{
    '--bg':hsl(h,ns,96),'--surface':'#FFFFFF','--field':'#FFFFFF','--fg':hsl(h,ns*0.8,11),'--muted':hsl(h,ns*0.6,40),'--line':hsl(h,ns,88),
    '--accent-soft':hsl(h,clamp(A[1],20,80)*0.8,93),'--accent2-soft':hsl(B[0],clamp(B[1],20,80)*0.8,93),'--pop-soft':hsl(C[0],clamp(C[1],20,90)*0.9,91),'--photo':'#0D100E',
    '--sand':hsl(40,64,37),'--sand-soft':hsl(40,62,91),'--sky':hsl(206,64,34),'--sky-soft':hsl(206,52,92),
    '--plum':hsl(275,30,41),'--plum-soft':hsl(275,34,93),'--warn':hsl(12,56,42),'--warn-soft':hsl(12,58,92),
  };
  return {...base,'--accent':ink(A,dark),'--accent2':ink(B,dark),'--pop':ink(C,dark),
    '--grad-a':fill(A,dark),'--grad-b':fill(B,dark),'--pop-fill':hsl(C[0],C[1],clamp(C[2],50,62)),
    '--glow-a':hsl(A[0],A[1],dark?30:80),'--glow-b':hsl(B[0],B[1],dark?28:82)};
}
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:v;}catch{return d;}};
const set=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
const mq=window.matchMedia('(prefers-color-scheme: dark)');
function custom(){try{const c=JSON.parse(get('pal_custom','null'));if(c&&c.length===3)return ['自分の色',...c];}catch{}return ['自分の色','#1d6a47','#0e7490','#f2b632'];}
function curPal(){const k=get('pal','0');return k==='c'?custom():PRESETS[Math.min(PRESETS.length-1,Math.max(0,parseInt(k)||0))];}
function isDark(){const m=get('theme_mode','auto');return m==='dark'||(m==='auto'&&mq.matches);}
function apply(){
  const dark=isDark();const t=tokens(curPal(),dark);const r=document.documentElement;
  Object.entries(t).forEach(([k,v])=>r.style.setProperty(k,v));
  r.style.colorScheme=dark?'dark':'light';
  document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.setAttribute('content',t['--bg']));
}
mq.addEventListener&&mq.addEventListener('change',apply);
apply();
window.THEME={PRESETS,apply,tokens,custom,isDark,
  pick(i){set('pal',String(i));apply();},
  setCustom(c){set('pal_custom',JSON.stringify(c));set('pal','c');apply();},
  mode(m){set('theme_mode',m);apply();},
  current(){return{pal:get('pal','0'),mode:get('theme_mode','auto'),colors:curPal().slice(1)};}};
})();
