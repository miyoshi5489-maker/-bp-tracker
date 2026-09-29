// ─────────────────────────────────────────────
// カラーテーマ（30色）… 画面全体の色を切り替える
// ─────────────────────────────────────────────
(function(){
const THEMES=[
  ['フェアウェイ',152,55],['若葉',100,50],['抹茶',78,38],['深緑',160,45],['ミント',168,50],
  ['ターコイズ',180,60],['浅葱',192,62],['空',205,65],['瑠璃',218,62],['藍',225,48],
  ['紺',232,40],['ラベンダー',255,45],['藤',268,40],['菫',282,42],['葡萄',300,35],
  ['牡丹',322,52],['桜',340,55],['珊瑚',8,65],['朱',14,72],['紅',352,62],
  ['茜',2,55],['柿',24,70],['蜜柑',32,82],['山吹',42,80],['芥子',50,60],
  ['琥珀',36,55],['砂',38,28],['胡桃',25,30],['銀鼠',210,8],['墨',150,4],
];
const hsl=(h,s,l)=>`hsl(${h} ${s}% ${l}%)`;
function tokens(i,dark){
  const[,h,s]=THEMES[i];const ns=Math.min(s,14)*(s<10?0.4:1); // 背景に少しだけ色味
  const acc=s<10?(dark?72:28):(dark?66:34);
  return dark?{
    '--bg':hsl(h,ns*0.9,7),'--surface':hsl(h,ns*0.9,11),'--field':hsl(h,ns*0.9,14),'--fg':hsl(h,ns*0.6,91),'--muted':hsl(h,ns*0.6,64),'--line':hsl(h,ns*0.8,20),
    '--accent':hsl(h,Math.max(s,8),acc),'--accent-soft':hsl(h,Math.min(s,45)*0.7,17),'--photo':'#070908',
    '--sand':hsl(40,58,64),'--sand-soft':hsl(40,32,15),'--sky':hsl(206,62,69),'--sky-soft':hsl(206,32,16),
    '--plum':hsl(275,42,74),'--plum-soft':hsl(275,20,17),'--warn':hsl(12,62,66),'--warn-soft':hsl(12,32,16),
  }:{
    '--bg':hsl(h,ns*1.2,95),'--surface':'#FFFFFF','--field':'#FFFFFF','--fg':hsl(h,ns*1.2,11),'--muted':hsl(h,ns*0.7,39),'--line':hsl(h,ns*1.1,85),
    '--accent':hsl(h,Math.max(s,8),acc),'--accent-soft':hsl(h,Math.min(s,60)*0.8,91),'--photo':'#0D100E',
    '--sand':hsl(40,64,37),'--sand-soft':hsl(40,62,91),'--sky':hsl(206,64,34),'--sky-soft':hsl(206,52,92),
    '--plum':hsl(275,30,41),'--plum-soft':hsl(275,34,93),'--warn':hsl(12,56,42),'--warn-soft':hsl(12,58,92),
  };
}
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:v;}catch{return d;}};
const set=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
const mq=window.matchMedia('(prefers-color-scheme: dark)');
function apply(){
  const i=Math.min(THEMES.length-1,Math.max(0,parseInt(get('theme_i','0'))||0));
  const mode=get('theme_mode','auto');
  const dark=mode==='dark'||(mode==='auto'&&mq.matches);
  const t=tokens(i,dark);const r=document.documentElement;
  Object.entries(t).forEach(([k,v])=>r.style.setProperty(k,v));
  r.style.colorScheme=dark?'dark':'light';
  document.querySelectorAll('meta[name=theme-color]').forEach(m=>m.setAttribute('content',t['--bg']));
}
mq.addEventListener&&mq.addEventListener('change',apply);
apply();
window.THEME={THEMES,apply,tokens,
  pick(i){set('theme_i',String(i));apply();},
  mode(m){set('theme_mode',m);apply();},
  current(){return{i:parseInt(get('theme_i','0'))||0,mode:get('theme_mode','auto')};}};
})();
