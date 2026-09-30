// ─────────────────────────────────────────────
// ログイン（Supabase Auth：メールアドレス＋パスワード）
//   ログインすると、記録は本人のアカウントにだけ保存・表示される
// ─────────────────────────────────────────────
(function(){
const URL_='https://nuqhddzwjknoxrykfcrb.supabase.co';
const KEY='sb_publishable_6nSJ-7MfHwr4e2p2Esgp8A_0BTGPODN';
const SKEY='yohei_auth';
const base={'Content-Type':'application/json','apikey':KEY};
const load=()=>{try{return JSON.parse(localStorage.getItem(SKEY)||'null');}catch{return null;}};
const save=s=>{try{s?localStorage.setItem(SKEY,JSON.stringify(s)):localStorage.removeItem(SKEY);}catch{}};
function fromToken(j){return{access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Math.floor(Date.now()/1000)+(j.expires_in||3600),user:{id:j.user&&j.user.id,email:j.user&&j.user.email}};}
let REFRESHING=null;
async function refresh(s){
  if(REFRESHING)return REFRESHING;
  REFRESHING=(async()=>{
    try{const r=await fetch(URL_+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:base,body:JSON.stringify({refresh_token:s.refresh_token})});
      if(r.ok){const n=fromToken(await r.json());save(n);return n;}
      if(r.status>=400&&r.status<500){
        const now=load();if(now&&now.refresh_token!==s.refresh_token)return now; // 別のタブが先に更新していた
        if(r.status===429)return s; // 混み合っている時は今のまま
        save(null);showGate();return null; // 本当にログインし直しが必要な時だけ
      }
    }catch(e){}
    return s; // 通信できない時は今のまま
  })();
  try{return await REFRESHING;}finally{REFRESHING=null;}
}
async function headers(){
  let s=load();
  if(s&&s.expires_at-60<Date.now()/1000)s=await refresh(s);
  return {...base,'Authorization':'Bearer '+(s&&s.access_token?s.access_token:KEY)};
}
async function call(path,body){
  const r=await fetch(URL_+path,{method:'POST',headers:base,body:JSON.stringify(body)});
  let j={};try{j=await r.json();}catch{}
  return{ok:r.ok,status:r.status,j};
}
const MSG={'Invalid login credentials':'メールアドレスかパスワードが違います','Email not confirmed':'確認メールのリンクをまだ押していません。メールを確認してください','User already registered':'このメールアドレスは登録済みです。「ログイン」を押してください'};
const jmsg=j=>MSG[j.msg||j.error_description||j.message]||j.msg||j.error_description||j.message||'うまくいきませんでした。もう一度お試しください';
async function signIn(email,password){
  const r=await call('/auth/v1/token?grant_type=password',{email,password});
  if(!r.ok)return jmsg(r.j);
  save(fromToken(r.j));return null;
}
async function signUp(email,password){
  const r=await call('/auth/v1/signup',{email,password});
  if(!r.ok)return jmsg(r.j);
  if(r.j.access_token){save(fromToken(r.j));return null;}
  return 'CONFIRM';
}
async function recover(email){
  const r=await fetch(URL_+'/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',headers:base,body:JSON.stringify({email})});
  if(r.ok)return null;let j={};try{j=await r.json();}catch{}return jmsg(j);
}
async function setPassword(password){
  const h=await headers();
  const r=await fetch(URL_+'/auth/v1/user',{method:'PUT',headers:h,body:JSON.stringify({password})});
  if(r.ok)return null;let j={};try{j=await r.json();}catch{}return jmsg(j);
}
// メールのリンクから戻ってきた時（#access_token=...&type=recovery）
let RECOVERY=false,LINK_ERR='';
(function(){const h=location.hash.slice(1);if(!/access_token=|error=/.test(h))return;
  const q=new URLSearchParams(h);
  if(q.get('access_token')){save(fromToken({access_token:q.get('access_token'),refresh_token:q.get('refresh_token'),expires_in:parseInt(q.get('expires_in'))||3600,user:{}}));RECOVERY=q.get('type')==='recovery';}
  else LINK_ERR='メールのリンクの期限が切れています。もう一度「パスワードを忘れた」を押してください';
  history.replaceState(null,'',location.pathname+'#today');})();
function signOut(){save(null);try{localStorage.removeItem('yohei_bp_cache');}catch{}location.reload();}

// ── ログイン画面 ──
function gateHtml(){return `
  <div id="auth-gate" class="fixed inset-0 z-50 grid place-items-center bg-bg px-5" style="padding-top:env(safe-area-inset-top,0px)">
    <form id="auth-form" class="card grid w-full max-w-sm gap-3 p-6" onsubmit="event.preventDefault()">
      <div class="font-display text-2xl">洋平トレーニング</div>
      <p class="text-[14px] text-muted">記録を守るためにログインしてください。初めての時は「新しく登録」を押します。</p>
      <label class="grid gap-1"><span class="lbl">メールアドレス</span><input id="auth-email" type="email" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" class="inp" required></label>
      <label class="grid gap-1"><span class="lbl">パスワード（8文字以上）</span><input id="auth-pass" type="password" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" minlength="8" class="inp" required></label>
      <label class="flex items-center gap-2 text-[13px] text-muted"><input type="checkbox" id="auth-show" class="h-4 w-4 accent-[var(--accent)]">パスワードを表示する</label>
      <div id="auth-msg" class="hidden rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"></div>
      <button type="button" id="auth-in" class="btn-main">ログイン</button>
      <button type="button" id="auth-up" class="btn-sub">新しく登録</button>
      <button type="button" id="auth-forgot" class="text-[13px] font-bold text-accent">パスワードを忘れた</button>
    </form>
  </div>`;}
function showGate(){
  if(document.getElementById('auth-gate'))return;
  document.body.insertAdjacentHTML('beforeend',gateHtml());
  const msg=(t,ok)=>{const m=document.getElementById('auth-msg');m.textContent=t;m.classList.remove('hidden');m.className=`rounded-lg px-3 py-2 text-[13px] ${ok?'bg-accent-soft text-accent':'bg-warn-soft text-warn'}`;};
  const vals=()=>({e:document.getElementById('auth-email').value.trim(),p:document.getElementById('auth-pass').value});
  const run=async(btn,fn)=>{const{e,p}=vals();if(!e||p.length<8){msg('メールアドレスと8文字以上のパスワードを入れてください');return;}
    btn.disabled=true;btn.classList.add('opacity-60');const err=await fn(e,p);btn.disabled=false;btn.classList.remove('opacity-60');
    if(err==='CONFIRM'){msg('確認メールを送りました。メールのリンクを押したあと、ここで「ログイン」を押してください。',true);return;}
    if(err){msg(err);return;}
    document.getElementById('auth-gate').remove();try{CACHE=null;}catch{}if(typeof show==='function')show(CUR||'today');};
  document.getElementById('auth-in').onclick=e=>run(e.currentTarget,signIn);
  document.getElementById('auth-up').onclick=e=>run(e.currentTarget,signUp);
  document.getElementById('auth-show').onchange=e=>{document.getElementById('auth-pass').type=e.target.checked?'text':'password';};
  document.getElementById('auth-forgot').onclick=async e=>{const em=document.getElementById('auth-email').value.trim();if(!em){msg('先にメールアドレスを入れてください');return;}
    const btn=e.currentTarget;btn.disabled=true;const err=await recover(em);btn.disabled=false;
    msg(err||'パスワードを決め直すメールを送りました。メールのリンクを押すと、新しいパスワードを決める画面が開きます。',!err);};
  if(LINK_ERR)msg(LINK_ERR);
}
function showNewPass(){
  document.body.insertAdjacentHTML('beforeend',`<div id="auth-gate" class="fixed inset-0 z-50 grid place-items-center bg-bg px-5">
    <form class="card grid w-full max-w-sm gap-3 p-6" onsubmit="event.preventDefault()">
      <div class="font-display text-2xl">新しいパスワード</div>
      <p class="text-[14px] text-muted">これから使うパスワードを決めてください（8文字以上）。</p>
      <input id="np-pass" type="text" autocomplete="new-password" autocapitalize="none" autocorrect="off" spellcheck="false" minlength="8" class="inp">
      <div id="auth-msg" class="hidden rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"></div>
      <button type="button" id="np-save" class="btn-main">このパスワードにする</button>
    </form></div>`);
  document.getElementById('np-save').onclick=async e=>{const p=document.getElementById('np-pass').value;const m=document.getElementById('auth-msg');
    if(p.length<8){m.textContent='8文字以上にしてください';m.classList.remove('hidden');return;}
    const btn=e.currentTarget;btn.disabled=true;const err=await setPassword(p);btn.disabled=false;
    if(err){m.textContent=err;m.classList.remove('hidden');return;}
    document.getElementById('auth-gate').remove();if(typeof show==='function')show('today');};
}
window.AUTH={headers,signOut,session:load,showGate,user:()=>{const s=load();return s&&s.user;}};
// 開くたび・戻ってくるたびにログインを新しくしておく（ずっとログインしたままにする）
function keepAlive(){const s=load();if(s&&s.refresh_token&&s.expires_at-600<Date.now()/1000)refresh(s);}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')keepAlive();});
setInterval(keepAlive,10*60*1000);keepAlive();
if(RECOVERY)document.addEventListener('DOMContentLoaded',showNewPass);
else if(!load())document.addEventListener('DOMContentLoaded',showGate);
})();
