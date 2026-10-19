// ── 続きから再開：最後に見ていた画面（ページ・ゴルフのタブ・開いていたラウンド・ホールマップ・ヤーデージブック・スクロール位置）を覚えて、
//    アプリを開き直した時や戻るボタンでアプリから出てしまった時に、同じ画面から始める。
//    戻るボタン（スマホ）は、マップやヤーデージブックを閉じる／前のページに戻る動きにする。
(function(){
  const KEY='resume:v1';let restoring=false,T=0;
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch{return null;}};
  const st=()=>({p:typeof CUR!=='undefined'?CUR:'today',golfR:typeof GOLF_R!=='undefined'?GOLF_R:null,golfPart:typeof GOLF_PART!=='undefined'?GOLF_PART:'',
    roundOpen:typeof ROUND_OPEN!=='undefined'?ROUND_OPEN:null,
    hm:(typeof HM!=='undefined'&&HM&&document.getElementById('holemap'))?{date:HM.date,no:HM.no,view:HM.view,src:HM.src||0,z:HM.z||1,pos:(()=>{const s=document.getElementById('hm-scroll');return s?[s.scrollLeft,s.scrollTop]:null;})()}:null,
    yb:(typeof YB!=='undefined'&&YB&&document.getElementById('yb'))?{date:YB.date,plan:YB.plan||'',top:(document.getElementById('yb')||{}).scrollTop||0}:null,
    y:window.scrollY||0,t:Date.now()});
  const save=()=>{if(restoring)return;try{localStorage.setItem(KEY,JSON.stringify(st()));}catch{}};
  const later=()=>{clearTimeout(T);T=setTimeout(save,250);};
  window.resumeSave=later;

  // 画面が切り替わる関数を包んで、そのたびに保存する
  const wrap=(name,after)=>{const f=window[name];if(typeof f!=='function')return;window[name]=function(...a){const r=f.apply(this,a);try{after&&after(a);}catch{}later();return r;};};
  // ページ移動は履歴に積む（戻るボタンで前のページへ。アプリから出ない）
  const _show=window.show;
  window.show=function(p,opt){const prev=typeof CUR!=='undefined'?CUR:null;
    if(!restoring&&prev&&p&&p!==prev&&history.pushState&&location.hash!=='#'+p)history.pushState({p},'','#'+p);
    const r=_show.call(this,p,opt);later();return r;};
  // マップ・ヤーデージブックを開いたら履歴に1つ積む（戻るボタン＝閉じる）
  const pushOv=k=>{if(!restoring&&history.pushState&&!(history.state&&history.state.ov===k))history.pushState({ov:k,p:typeof CUR!=='undefined'?CUR:''},'',location.hash);};
  wrap('openHoleMap',()=>pushOv('hm'));
  wrap('drawHoleMap',()=>{const s=document.getElementById('hm-scroll');if(s&&!s.__rs){s.__rs=1;s.addEventListener('scroll',later,{passive:true});}});
  wrap('openYardageBook',()=>pushOv('yb'));
  wrap('drawYardageBook',()=>{const e=document.getElementById('yb');if(e&&!e.__rs){e.__rs=1;e.addEventListener('scroll',later,{passive:true});}});
  const _closeHM=window.closeHoleMap,_closeYB=window.closeYardageBook;
  window.closeHoleMap=function(){const r=_closeHM.apply(this,arguments);later();if(!window.__fromPop&&history.state&&history.state.ov==='hm')history.back();return r;};
  window.closeYardageBook=function(){const r=_closeYB.apply(this,arguments);later();if(!window.__fromPop&&history.state&&history.state.ov==='yb')history.back();return r;};
  ['renderGolf','roundToggle','setPlan'].forEach(n=>wrap(n));
  window.addEventListener('popstate',()=>{window.__fromPop=true;try{
    if(document.getElementById('holemap')){_closeHM();}
    else if(document.getElementById('yb')){_closeYB();}
  }finally{window.__fromPop=false;}later();});
  window.addEventListener('scroll',later,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});
  window.addEventListener('pagehide',save);

  // 起動時：前回の画面を復元（ホームの「#today」で開いた時・URLに画面の指定がない時）
  const s=load();const h=(location.hash||'').slice(1);
  if(s&&s.p&&(Date.now()-(s.t||0)<7*864e5)&&(!h||h==='today'||h===s.p)&&!(s.p==='today'&&!s.hm&&!s.yb)){
    restoring=true;
    try{
      if(s.golfR&&typeof GOLF_R!=='undefined'){GOLF_R=s.golfR;GOLF_PART=s.golfPart||'';}
      if(s.roundOpen!=null&&typeof ROUND_OPEN!=='undefined')ROUND_OPEN=s.roundOpen;
      _show(s.p,s.p==='golf'&&s.golfR?{routine:s.golfR+(s.golfPart?':'+s.golfPart:'')}:undefined);
    }catch(e){}
    const fin=()=>{restoring=false;later();};
    setTimeout(()=>{try{
      if(s.hm&&typeof openHoleMap==='function'){
        openHoleMap(s.hm.date,s.hm.no);
        if(HM){HM.view=s.hm.view||'hole';HM.src=s.hm.src||0;HM.z=s.hm.z||1;if(s.hm.pos)HM.pos=s.hm.pos;drawHoleMap();if(s.hm.pos)setTimeout(()=>{const sc=document.getElementById('hm-scroll');if(sc){sc.scrollLeft=s.hm.pos[0];sc.scrollTop=s.hm.pos[1];}},800);}
        history.pushState&&history.pushState({ov:'hm',p:s.p},'',location.hash);
      }else if(s.yb&&typeof openYardageBook==='function'){
        openYardageBook(s.yb.date);if(YB){YB.plan=s.yb.plan||'';drawYardageBook();}
        history.pushState&&history.pushState({ov:'yb',p:s.p},'',location.hash);
        setTimeout(()=>{const e=document.getElementById('yb');if(e)e.scrollTop=s.yb.top||0;},400);
      }
      if(s.y)setTimeout(()=>window.scrollTo({top:s.y}),300);
    }catch(e){}setTimeout(fin,900);},500);
  }
})();
