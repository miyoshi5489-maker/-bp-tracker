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
      if(r.status>=400&&r.status<500){save(null);showGate();return null;} // ログインし直しが必要
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
function signOut(){save(null);try{localStorage.removeItem('yohei_bp_cache');}catch{}location.reload();}

// ── ログイン画面 ──
function gateHtml(){return `
  <div id="auth-gate" class="fixed inset-0 z-50 grid place-items-center bg-bg px-5" style="padding-top:env(safe-area-inset-top,0px)">
    <form id="auth-form" class="card grid w-full max-w-sm gap-3 p-6" onsubmit="event.preventDefault()">
      <div class="font-display text-2xl">洋平トレーニング</div>
      <p class="text-[14px] text-muted">記録を守るためにログインしてください。初めての時は「新しく登録」を押します。</p>
      <label class="grid gap-1"><span class="lbl">メールアドレス</span><input id="auth-email" type="email" autocomplete="username" class="inp" required></label>
      <label class="grid gap-1"><span class="lbl">パスワード（8文字以上）</span><input id="auth-pass" type="password" autocomplete="current-password" minlength="8" class="inp" required></label>
      <div id="auth-msg" class="hidden rounded-lg bg-warn-soft px-3 py-2 text-[13px] text-warn"></div>
      <button type="button" id="auth-in" class="btn-main">ログイン</button>
      <button type="button" id="auth-up" class="btn-sub">新しく登録</button>
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
}
window.AUTH={headers,signOut,session:load,showGate,user:()=>{const s=load();return s&&s.user;}};
if(!load())document.addEventListener('DOMContentLoaded',showGate);
})();
