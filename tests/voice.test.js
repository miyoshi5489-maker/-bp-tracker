// 音声入力パーサのテスト：node tests/voice.test.js
const fs=require('fs');const path=require('path');const assert=require('assert');
global.window={};require('../exercises.js');
global.PRESETS_BY_CAT={push:['ベンチプレス','DBインクラインプレス','DBサイドレイズ','ケーブルオーバーヘッドトライセプス'],pull:['デッドリフト','ラットプルダウン','チンニング（懸垂）'],legs:['スクワット','ブルガリアンスプリットスクワット','DBランジ','ルーマニアンデッドリフト']};
PRESETS_BY_CAT.full=[...PRESETS_BY_CAT.push,...PRESETS_BY_CAT.pull,...PRESETS_BY_CAT.legs];
global.GOLF_PRESETS=[...window.EX_G,...window.EX_Y].flatMap(b=>b.ex.map(e=>e.n));
eval(fs.readFileSync(path.join(__dirname,'../voice.js'),'utf8')+';global.parseVoice=parseVoice');
const sets=v=>v.ex.map(e=>[e.name,e.sets.map(s=>`${s.weight}x${s.reps}`).join(',')]);
const cases=[
 ['ベンチプレス80キロ5回3セットインクラインダンベル24キロ10回3セット',v=>assert.deepStrictEqual(sets(v),[['ベンチプレス','80x5,80x5,80x5'],['DBインクラインプレス','24x10,24x10,24x10']])],
 ['ベンチ62.5キロ5回3セット',v=>assert.deepStrictEqual(sets(v),[['ベンチプレス','62.5x5,62.5x5,62.5x5']])],
 ['ベンチ62キロ半5回',v=>assert.deepStrictEqual(sets(v),[['ベンチプレス','62.5x5']])],
 ['ベンチ 80キロ5回、85キロ3回、90キロ1回',v=>assert.deepStrictEqual(sets(v),[['ベンチプレス','80x5,85x3,90x1']])],
 ['ベンチ80キロで5回、それを3セット',v=>assert.deepStrictEqual(sets(v),[['ベンチプレス','80x5,80x5,80x5']])],
 ['デッドリフト百キロ五回三セット ラットプル60×10×3',v=>assert.deepStrictEqual(sets(v),[['デッドリフト','100x5,100x5,100x5'],['ラットプルダウン','60x10,60x10,60x10']])],
 ['ブルガリアンスクワット20キロ8回3セット',v=>assert.strictEqual(v.ex[0].name,'ブルガリアンスプリットスクワット')],
 ['5キロ走った',v=>{assert.strictEqual(v.run.km,5);assert.strictEqual(v.ex.length,0);}],
 ['1キロ5分で5キロ走った',v=>{assert.strictEqual(v.run.km,5);assert.strictEqual(v.run.pmin,5);assert.strictEqual(v.ex.length,0);}],
 ['ランニング5キロ32分心拍140',v=>assert.deepStrictEqual(v.run,{km:5,min:32,sec:0,hr:140})],
 ['バランスボール',v=>assert.strictEqual(v.run,null)],
];
let ok=0;for(const[t,f]of cases){try{f(parseVoice(t));ok++;}catch(e){console.error('NG:',t,JSON.stringify(parseVoice(t)));process.exitCode=1;}}
console.log(`${ok}/${cases.length} OK`);
