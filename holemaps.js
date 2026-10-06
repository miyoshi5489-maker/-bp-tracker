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
  1:{c:[[0,0],[0,200],[-5,307]],hz:[{t:'w',x:-40,y:100,rx:14,ry:22},{t:'b',x:18,y:262},{t:'b',x:26,y:250},{t:'b',x:-15,y:270}],t:[[5,190,'5W']],n:'力まずフェアウェイキープ。グリーンはやや高く、2打目のアイアン選びがポイント（公式）。ティー前方の左に池（ショットナビの図）。'},
  2:{c:[[0,0],[8,220],[0,330],[0,485]],hz:[{t:'w',x:-42,y:290,rx:10,ry:40},{t:'w',x:-5,y:300,rx:42,ry:35},{t:'w',x:-38,y:455,rx:10,ry:18},{t:'b',x:-28,y:270},{t:'b',x:-25,y:290}],t:[[8,236,'1W'],[0,412,'4H 池越え']],n:'1打目はやや打ち上げで右寄りが狙い目。2打目は池越えで、距離を残すと木がブラインドになって難しい。3打目のグリーンオーバーは危険（公式）。'},
  3:{c:[[0,0],[5,150],[-5,250],[-25,330]],hz:[{t:'w',x:12,y:95,rx:30,ry:30},{t:'b',x:-32,y:230},{t:'b',x:28,y:255},{t:'b',x:22,y:270}],t:[[10,185,'5W']],n:'池越えの左ドッグレッグ。距離を欲張らず真ん中へ。グリーン奥は危険なので手前から。'},
  4:{c:[[0,0],[0,300],[0,418]],hz:[{t:'w',x:-22,y:25,rx:12,ry:12},{t:'b',x:-32,y:310},{t:'b',x:-25,y:325}],t:[[0,220,'1W'],[0,330,'7I']],n:'1打目はフェアウェイ中央。グリーン手前が狭いので、2打目は無理せず曲げないこと。'},
  5:{c:[[0,0],[0,345]],hz:[{t:'ob',side:'R',from:0,to:345},{t:'b',x:22,y:140}],t:[[0,190,'5W']],n:'真ん中狙い。欲張って左へ落とすと2打目でグリーンを狙えない。右はOB。'},
  6:{c:[[0,0],[0,189]],hz:[{t:'w',x:28,y:110,rx:22,ry:65},{t:'b',x:16,y:170}],t:[],n:'グリーンは大きく、やや右に傾斜。風とピン位置を見て、左側から攻める（公式）。右の池はショットナビの図より。'},
  7:{c:[[0,0],[0,430]],hz:[{t:'b',x:-18,y:410},{t:'b',x:18,y:415}],t:[[0,220,'1W'],[0,340,'7I']],n:'真ん中狙い。左へ曲げると隣のホールでセーフだが、2打目でグリーンを狙えない。'},
  8:{c:[[0,0],[10,210],[-5,340],[0,487]],hz:[{t:'ob',side:'R',from:220,to:487},{t:'w',x:32,y:440,rx:10,ry:35}],t:[[10,205,'5W'],[-8,355,'7I']],n:'1打目は右側、2打目は左側が狙い目。2打目から右はOBが出やすい（公式）。グリーン右の池はショットナビの図より。'},
  9:{c:[[0,0],[0,137]],hz:[{t:'w',x:10,y:65,rx:38,ry:50}],t:[],n:'池越えのショート。グリーン中央が安全。少し大きめのクラブで。'},
  10:{c:[[0,0],[3,200],[-8,360]],hz:[{t:'b',x:-20,y:185},{t:'w',x:36,y:95,rx:8,ry:12},{t:'v',side:'L',from:300,to:370},{t:'b',x:12,y:330}],t:[[6,205,'1W']],n:'1打目はクロスバンカーの右側が狙い目。グリーン左は深い谷。'},
  11:{c:[[0,0],[-5,200],[0,370]],hz:[{t:'b',x:-25,y:250},{t:'w',x:30,y:335,rx:10,ry:18},{t:'b',x:-15,y:355},{t:'b',x:18,y:350}],t:[[-8,190,'5W'],[0,290,'9I']],n:'1打目は左のクロスバンカー方向へ。2打目は打ち下ろし。グリーンオーバーは禁物。'},
  12:{c:[[0,0],[15,150],[22,260],[0,380],[-15,487]],hz:[{t:'w',x:32,y:50,rx:14,ry:16},{t:'w',x:-15,y:170,rx:16,ry:10},{t:'b',x:-15,y:455},{t:'b',x:12,y:470}],t:[[15,195,'5W'],[8,345,'7I']],n:'S字のロング。1打目は中央。2打目はフェアウェイ左側が3打目に有利。'},
  13:{c:[[0,0],[0,350]],hz:[{t:'w',x:-18,y:85,rx:28,ry:30},{t:'ob',side:'R',from:120,to:350}],t:[[-8,190,'5W']],n:'1打目は中央より左。フェアウェイは右に傾いていて、右に曲げるとOB（公式）。ティー前方左の池はショットナビの図より。'},
  14:{c:[[0,0],[0,151]],hz:[{t:'b',x:-14,y:132},{t:'b',x:10,y:140}],t:[],n:'打ち上げでピンは見えない。右側が安全。'},
  15:{c:[[0,0],[10,250],[0,380],[-15,480]],hz:[{t:'w',x:-32,y:95,rx:10,ry:16},{t:'w',x:28,y:100,rx:12,ry:16},{t:'b',x:-18,y:460},{t:'b',x:8,y:470}],t:[[8,205,'5W'],[0,360,'7I']],n:'1打目はフェアウェイ中央。左右に落とし穴がある。3打目は前下がりでグリーンも速いので手前から（公式）。100y付近の池はショットナビの図より。'},
  16:{c:[[0,0],[5,311]],hz:[{t:'b',x:-14,y:290},{t:'b',x:15,y:295}],t:[[8,185,'5W']],n:'やや打ち上げのブラインドホール。フェアウェイ右側が狙い目。2打目をグリーン左に落とすとトラブル。'},
  17:{c:[[0,0],[0,147]],hz:[{t:'b',x:-15,y:130},{t:'b',x:15,y:132}],t:[],n:'風とピン位置で距離が変わる。2段グリーンで傾斜があり、1パット目が大事。'},
  18:{c:[[0,0],[-5,250],[0,414]],hz:[{t:'t',x:0,y:235},{t:'b',x:15,y:400},{t:'b',x:-12,y:395}],t:[[-5,215,'1W'],[-8,330,'8I']],n:'打ち下ろし。正面の楠の木が狙い目。2打目は左側から。グリーン右は要注意。'},
 },
 taka:{
  1:{c:[[0,0],[0,300],[5,420],[8,500]],hz:[{t:'w',x:-48,y:185,rx:12,ry:22},{t:'b',x:-35,y:250},{t:'b',x:22,y:400},{t:'b',x:18,y:445}],t:[[0,205,'5W'],[-5,370,'7I']],n:'打ち下ろしのロング。1打目はセンター。2打目は右のバンカーを避ける。グリーンは右奥から手前に傾いていて、ピンの左手前が狙い目。'},
  2:{c:[[0,0],[0,382]],hz:[{t:'ob',side:'R',from:0,to:382},{t:'t',x:0,y:235},{t:'b',x:-30,y:245},{t:'b',x:30,y:250},{t:'w',x:-45,y:70,rx:8,ry:12},{t:'b',x:-15,y:358},{t:'b',x:18,y:362}],t:[[0,215,'1W'],[0,285,'9I']],n:'フェアウェイ中央に大きな松の木。両サイドのバンカーを避けて松の木狙い。右はグリーンまでずっとOB。左の林はセーフだが出しにくい。'},
  3:{c:[[0,0],[0,375]],hz:[{t:'b',x:25,y:195},{t:'ob',side:'R',from:150,to:375},{t:'w',x:-50,y:285,rx:8,ry:10},{t:'b',x:20,y:340},{t:'b',x:8,y:385}],t:[[-8,220,'1W'],[0,290,'9I']],n:'真っすぐだが難しい。右のバンカーの先はすぐOB。左の林はセーフだが脱出が大変。2段グリーンで距離感が難しい。'},
  4:{c:[[0,0],[0,127]],hz:[{t:'w',x:-8,y:70,rx:48,ry:32},{t:'b',x:0,y:108}],t:[],n:'大きな池越えのショート。風の向きと手前のバンカーに注意。'},
  5:{c:[[0,0],[10,230],[0,380],[0,503]],hz:[{t:'w',x:15,y:140,rx:4,ry:30},{t:'w',x:-22,y:440,rx:8,ry:25},{t:'w',x:22,y:445,rx:8,ry:22}],t:[[12,230,'1W'],[0,380,'7I']],n:'フェアウェイは右から左に傾いているので、1打目は右サイド。グリーン手前の両側に池。左の林はセーフだが出しにくい。'},
  6:{c:[[0,0],[0,169]],hz:[{t:'b',x:-12,y:128}],t:[],n:'見た目は攻めやすい。風に注意。受けグリーンなので手前から（ショットナビ）。グリーン手前にバンカー（じゃらん）。'},
  7:{c:[[0,0],[5,180],[0,280],[-15,384]],hz:[{t:'w',x:-25,y:135,rx:14,ry:14},{t:'w',x:48,y:200,rx:10,ry:25},{t:'w',x:35,y:345,rx:10,ry:22},{t:'b',x:-28,y:230},{t:'t',x:0,y:215}],t:[[8,190,'5W'],[5,300,'8I']],n:'フェアウェイ中央に松の木。左ドッグレッグ。グリーン手前の池が効いている。'},
  8:{c:[[0,0],[-5,190],[-10,332]],hz:[{t:'ob',side:'R',from:0,to:332},{t:'w',x:40,y:125,rx:8,ry:30}],t:[[-8,190,'4H']],n:'短いミドル。右に突き抜けるとOB。フェアウェイは左から右に傾いていて、跳ねて右OBもある。3段グリーンは左から右への傾斜がきついので左狙い。'},
  9:{c:[[0,0],[8,220],[0,383]],hz:[{t:'t',x:-25,y:330},{t:'b',x:-20,y:372},{t:'b',x:10,y:378}],t:[[10,220,'1W'],[5,300,'9I']],n:'打ち下ろし。右フェアウェイが正解。左半分は傾斜がきつく、グリーン手前左のメタセコイアがじゃまになる。'},
  10:{c:[[0,0],[-25,120],[-30,200],[-15,260],[10,330]],hz:[{t:'ob',side:'R',from:0,to:330},{t:'b',x:-5,y:225},{t:'b',x:-5,y:305}],t:[[-25,180,'4H']],n:'右ドッグレッグ。距離を稼ごうと右を狙うと危険。2打目はつま先下がりで右に行きやすく、右はすぐOB。2段グリーンの右もすぐOB。'},
  11:{c:[[0,0],[0,200],[10,352]],hz:[{t:'ob',side:'R',from:0,to:352},{t:'b',x:0,y:228},{t:'b',x:-10,y:335},{t:'b',x:22,y:340}],t:[[-5,190,'5W']],n:'少し右に曲がった打ち上げ。右はすぐOB。2打目はグリーン面が見えないので奥の目印を狙う。グリーンオーバーはOB。'},
  12:{c:[[0,0],[0,398]],hz:[{t:'ob',side:'L',from:0,to:398},{t:'b',x:-22,y:215},{t:'b',x:-20,y:238},{t:'b',x:20,y:225}],t:[[5,200,'5W'],[0,300,'8I']],n:'打ち下ろしで真っすぐ。右に打っても傾斜で戻ってくる。左は狭く、すぐOB（ショットナビ）。2打目は打ち上げ（じゃらん）。'},
  13:{c:[[0,0],[0,530]],hz:[{t:'ob',side:'L',from:0,to:530},{t:'ob',side:'R',from:0,to:530},{t:'b',x:25,y:280},{t:'b',x:-18,y:470}],t:[[0,200,'5W'],[0,350,'7I'],[0,480,'9I']],n:'だんだん狭くなるロング。左右OB。信号で前の組を確認。距離より得意クラブでフェアウェイキープ。'},
  14:{c:[[0,0],[0,148]],hz:[{t:'v',side:'C',from:45,to:105},{t:'b',x:-15,y:118}],t:[],n:'深い谷越え。手前のバンカーは深く、ラフの傾斜もきついので少し大きめが安全。ピンが左でも右から。'},
  15:{c:[[0,0],[0,200],[-5,330]],hz:[{t:'w',x:18,y:300,rx:8,ry:12},{t:'b',x:-15,y:305}],t:[[0,180,'4H'],[0,255,'刻むなら']],n:'短いミドル。信号で前の組を確認。グリーン手前の池に注意。受けグリーンなので手前から。グリーンオーバーはOB。'},
  16:{c:[[0,0],[-30,150],[-30,230],[0,300],[15,353]],hz:[{t:'ob',side:'L',from:150,to:353},{t:'b',x:-5,y:325}],t:[[-28,180,'4H']],n:'右ドッグレッグ。見た目より短い。ドライバーは突き抜けてOBの恐れ。180yで刻んで2打目勝負。左はすぐOB。'},
  17:{c:[[0,0],[0,159]],hz:[{t:'v',side:'C',from:40,to:110},{t:'b',x:-18,y:148},{t:'b',x:15,y:140}],t:[],n:'谷越えのショート。風に注意。グリーン手前のバンカーは深く、ラフの斜面もきつい。'},
  18:{c:[[0,0],[0,250],[8,386]],hz:[{t:'ob',side:'R',from:0,to:386},{t:'b',x:18,y:250},{t:'b',x:-15,y:375},{t:'b',x:15,y:370}],t:[[-10,215,'1W']],n:'少し右に曲がったミドル。右はすぐOB。ティーショットは左サイド。2打目でピンを攻めやすくなる。'},
 },
};

// 左右と奥が OB／セーフ／池 など（ホール解説・口コミから）
const HOLE_SIDES={"tojo": {"1": {"L": "情報なし", "R": "情報なし", "F": "ティー前方に池（公式イラスト）"}, "2": {"L": "情報なし", "R": "情報なし", "F": "2打目が池越え（公式）・横切る池まで約265y（レギュラーティー。実際に回った人の動画のコース図ではバックティー500yから約280y）", "B": "危険（公式）"}, "3": {"L": "情報なし", "R": "情報なし", "F": "池越え（公式）", "B": "危険（公式）"}, "4": {"L": "情報なし", "R": "情報なし", "F": "グリーン手前が狭い（公式）"}, "5": {"L": "OBの記載なし（左だと2打目でグリーンを狙えない・公式）", "R": "OB（公式）"}, "6": {"L": "情報なし（公式は「左側から攻略」）", "R": "池（公式イラスト）"}, "7": {"L": "セーフ（2打目はグリーンを狙えない・公式）", "R": "情報なし"}, "8": {"L": "情報なし", "R": "OB（2打目から・公式）／グリーン右に池（公式イラスト）"}, "9": {"L": "情報なし", "R": "情報なし", "F": "池越え（公式イラスト・じゃらん）"}, "10": {"L": "グリーン左に深い谷（公式）", "R": "情報なし"}, "11": {"L": "情報なし", "R": "グリーン右に池（公式イラスト）", "B": "禁物（公式）"}, "12": {"L": "2打目地点の左に池（公式イラスト）", "R": "ティー右前に池（公式イラスト）"}, "13": {"L": "情報なし", "R": "OB（公式）", "F": "ティー前方に池（公式イラスト・じゃらん）"}, "14": {"L": "情報なし", "R": "安全（公式）"}, "15": {"L": "落とし穴あり（公式・中身の記載なし）", "R": "落とし穴あり（公式・中身の記載なし）", "F": "ティー前方に池（公式イラスト）"}, "16": {"L": "グリーン左はトラブル（公式）", "R": "狙い目（公式）"}, "17": {"L": "情報なし", "R": "情報なし"}, "18": {"L": "2打目は左から攻める（公式）", "R": "グリーン右は要注意（公式）"}}, "taka": {"1": {"L": "情報なし", "R": "2打目は右バンカーに注意（ショットナビ）"}, "2": {"L": "セーフ（林・脱出に苦労）（ショットナビ）", "R": "OB（グリーンまで続く）（ショットナビ）"}, "3": {"L": "セーフ（林・脱出困難）（ショットナビ）", "R": "OB（右バンカーの先）（ショットナビ）"}, "4": {"L": "情報なし", "R": "情報なし", "F": "池越え（じゃらん）"}, "5": {"L": "セーフ（林・脱出に苦労）（ショットナビ）", "R": "狙い目（じゃらん・ショットナビ）"}, "6": {"L": "情報なし", "R": "情報なし", "F": "グリーン手前にバンカー（じゃらん）"}, "7": {"L": "バンカー（ショットナビ）", "R": "情報なし", "F": "グリーン手前に池（ショットナビ）"}, "8": {"L": "情報なし", "R": "OB（突き抜け・跳ね）（ショットナビ）"}, "9": {"L": "隣のホールでセーフ（脱出に苦労）（ショットナビ）", "R": "狙い目（ショットナビ）"}, "10": {"L": "情報なし", "R": "OB（グリーン右も）（ショットナビ）"}, "11": {"L": "情報なし", "R": "OB（ショットナビ）", "B": "OB（ショットナビ）"}, "12": {"L": "OB（ショットナビ）", "R": "傾斜で戻る（ショットナビ）"}, "13": {"L": "OB（じゃらん・ショットナビ）", "R": "OB（じゃらん・ショットナビ）"}, "14": {"L": "情報なし", "R": "情報なし", "F": "谷越え（じゃらん・ショットナビ）"}, "15": {"L": "情報なし", "R": "情報なし", "F": "グリーン手前に池（じゃらん・ショットナビ）", "B": "OB（ショットナビ）"}, "16": {"L": "OB（ショットナビ）", "R": "2打目は右から（ショットナビ）"}, "17": {"L": "情報なし", "R": "情報なし", "F": "谷越え（じゃらん・ショットナビ）"}, "18": {"L": "狙い目（ショットナビ）", "R": "OB（ショットナビ）"}}};
// OBの範囲（ティーからのヤード）…出典に場所が書いてある時だけ
const OB_RANGE={tojo:{8:{R:[200,9999]}},taka:{3:{R:[180,9999]}}};
// GDOスコアアプリ：スコア96〜105のユーザーのデータ（集計 2025年9月〜2026年8月）rank=難易度順位 avg=平均スコア fw=FWキープ率 ob=OB率
const HOLE_STATS={"tojo": {"1": {"rank": 14, "avg": 5.43, "putt": 2.26, "gir": 29.0, "fw": 52.0, "ob": 19.0, "bunker": 29.0}, "2": {"rank": 1, "avg": 7.11, "putt": 2.08, "gir": 8.0, "fw": 51.0, "ob": 26.0, "bunker": 1.0}, "3": {"rank": 12, "avg": 5.45, "putt": 2.08, "gir": 24.0, "fw": 49.0, "ob": 50.0, "bunker": 22.0}, "4": {"rank": 5, "avg": 5.81, "putt": 2.06, "gir": 6.0, "fw": 54.0, "ob": 39.0, "bunker": 19.0}, "5": {"rank": 8, "avg": 5.6, "putt": 2.04, "gir": 16.0, "fw": 53.0, "ob": 57.0, "bunker": 13.0}, "6": {"rank": 16, "avg": 4.36, "putt": 2.14, "gir": 19.0, "fw": 0.0, "ob": 36.0, "bunker": 29.0}, "7": {"rank": 4, "avg": 5.8, "putt": 2.01, "gir": 6.0, "fw": 50.0, "ob": 38.0, "bunker": 18.0}, "8": {"rank": 6, "avg": 6.64, "putt": 2.12, "gir": 17.0, "fw": 52.0, "ob": 42.0, "bunker": 13.0}, "9": {"rank": 18, "avg": 4.03, "putt": 2.07, "gir": 39.0, "fw": 0.0, "ob": 12.0, "bunker": 11.0}, "10": {"rank": 3, "avg": 5.9, "putt": 2.18, "gir": 7.0, "fw": 51.0, "ob": 10.0, "bunker": 7.0}, "11": {"rank": 11, "avg": 5.46, "putt": 2.03, "gir": 14.0, "fw": 52.0, "ob": 22.0, "bunker": 31.0}, "12": {"rank": 2, "avg": 6.89, "putt": 2.17, "gir": 12.0, "fw": 55.0, "ob": 46.0, "bunker": 21.0}, "13": {"rank": 7, "avg": 5.64, "putt": 2.17, "gir": 15.0, "fw": 58.0, "ob": 39.0, "bunker": 18.0}, "14": {"rank": 15, "avg": 4.42, "putt": 2.12, "gir": 15.0, "fw": 0.0, "ob": 23.0, "bunker": 34.0}, "15": {"rank": 13, "avg": 6.46, "putt": 2.08, "gir": 23.0, "fw": 51.0, "ob": 45.0, "bunker": 24.0}, "16": {"rank": 10, "avg": 5.49, "putt": 2.01, "gir": 15.0, "fw": 53.0, "ob": 17.0, "bunker": 23.0}, "17": {"rank": 17, "avg": 4.07, "putt": 2.07, "gir": 29.0, "fw": 0.0, "ob": 16.0, "bunker": 37.0}, "18": {"rank": 9, "avg": 5.55, "putt": 2.1, "gir": 11.0, "fw": 51.0, "ob": 13.0, "bunker": 5.0}}, "taka": {"1": {"rank": 2, "avg": 6.86, "putt": 2.1, "gir": 12.0, "fw": 36.0, "ob": 56.0, "bunker": 19.0}, "2": {"rank": 3, "avg": 5.79, "putt": 2.07, "gir": 6.0, "fw": 52.0, "ob": 20.0, "bunker": 37.0}, "3": {"rank": 1, "avg": 5.87, "putt": 2.05, "gir": 4.0, "fw": 37.0, "ob": 35.0, "bunker": 37.0}, "4": {"rank": 18, "avg": 4.0, "putt": 2.07, "gir": 34.0, "fw": 0.0, "ob": 16.0, "bunker": 19.0}, "5": {"rank": 13, "avg": 6.43, "putt": 2.05, "gir": 24.0, "fw": 37.0, "ob": 22.0, "bunker": 0.0}, "6": {"rank": 16, "avg": 4.24, "putt": 2.09, "gir": 20.0, "fw": 0.0, "ob": 3.0, "bunker": 56.0}, "7": {"rank": 6, "avg": 5.78, "putt": 2.04, "gir": 7.0, "fw": 47.0, "ob": 17.0, "bunker": 23.0}, "8": {"rank": 10, "avg": 5.68, "putt": 2.16, "gir": 12.0, "fw": 41.0, "ob": 21.0, "bunker": 20.0}, "9": {"rank": 12, "avg": 5.51, "putt": 2.06, "gir": 15.0, "fw": 42.0, "ob": 26.0, "bunker": 25.0}, "10": {"rank": 8, "avg": 5.71, "putt": 2.09, "gir": 9.0, "fw": 43.0, "ob": 38.0, "bunker": 16.0}, "11": {"rank": 9, "avg": 5.7, "putt": 2.05, "gir": 11.0, "fw": 51.0, "ob": 37.0, "bunker": 33.0}, "12": {"rank": 5, "avg": 5.76, "putt": 2.06, "gir": 9.0, "fw": 42.0, "ob": 39.0, "bunker": 22.0}, "13": {"rank": 4, "avg": 6.73, "putt": 2.06, "gir": 19.0, "fw": 43.0, "ob": 58.0, "bunker": 20.0}, "14": {"rank": 15, "avg": 4.42, "putt": 2.06, "gir": 16.0, "fw": 0.0, "ob": 41.0, "bunker": 23.0}, "15": {"rank": 14, "avg": 5.4, "putt": 2.07, "gir": 22.0, "fw": 48.0, "ob": 35.0, "bunker": 15.0}, "16": {"rank": 11, "avg": 5.56, "putt": 2.09, "gir": 14.0, "fw": 49.0, "ob": 32.0, "bunker": 15.0}, "17": {"rank": 17, "avg": 4.28, "putt": 2.09, "gir": 20.0, "fw": 0.0, "ob": 35.0, "bunker": 27.0}, "18": {"rank": 7, "avg": 5.74, "putt": 2.04, "gir": 6.0, "fw": 52.0, "ob": 38.0, "bunker": 28.0}}};
function sideKind(t){if(!t||/^情報なし/.test(t))return 'na';if(/記載なし/.test(t))return 'neutral';if(/セーフ|安全|傾斜で戻る/.test(t))return 'good';if(/OB|池|谷|危険|トラブル|禁物|要注意|落とし穴|バンカー/.test(t))return 'bad';return 'neutral';}
function sideCls(t){return {na:'text-muted',neutral:'text-fg',good:'text-accent',bad:'text-warn'}[sideKind(t)];}
function sideMark(t){return {na:'？',neutral:'△',good:'◯',bad:'✕'}[sideKind(t)];}

// 1打目の位置を、トラックマンのトータル距離に合わせる（向きはそのまま）
function tmAdjust(m){const t=m.t||[];if(!t[0]||typeof MYCLUBS==='undefined')return m;const code=clubCode(t[0][2]);const c=code&&MYCLUBS[code];if(!c||c.src==='仮')return m;
  const D=c.total||c.carry,L=Math.hypot(t[0][0],t[0][1]);if(!L)return m;const k=D/L;return {...m,t:[[t[0][0]*k,t[0][1]*k,t[0][2]],...t.slice(1)]};}
// ── 図を描く ──
function holeLen(c){let s=0;for(let i=1;i<c.length;i++)s+=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);return s;}
function alongPt(c,d){ // 中心線上でティーから d ヤードの点
  for(let i=1;i<c.length;i++){const L=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);if(d<=L){const r=d/L;return[c[i-1][0]+(c[i][0]-c[i-1][0])*r,c[i-1][1]+(c[i][1]-c[i-1][1])*r];}d-=L;}
  return c[c.length-1];}
function holeSVG(m,par,yards,opt){m=tmAdjust(m);
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
  // 左右の状態
  if(opt&&opt.sides){const mid=alongPt(c,Math.min(70,holeLen(c)*0.3));const col=t=>sideKind(t)==='bad'?'#ff8a80':sideKind(t)==='good'?'#b9f6ca':'#fff';
    [['L',minX+4,'start'],['R',maxX-4,'end']].forEach(([k,xx,an])=>{const t=opt.sides[k];if(sideKind(t)==='na')return;const short=t.replace(/（.*/,'');s+=`<text x="${xx}" y="${-mid[1]}" font-size="11" font-weight="bold" fill="${col(t)}" text-anchor="${an}" stroke="#123" stroke-width="2.5" paint-order="stroke">${k==='L'?'← 左':'右 →'}</text><text x="${xx}" y="${-mid[1]+13}" font-size="10" font-weight="bold" fill="${col(t)}" text-anchor="${an}" stroke="#123" stroke-width="2.5" paint-order="stroke">${esc(short)}</text>`;});
    if(opt.sides.B){s+=`<text x="${G[0]}" y="${-G[1]-(opt.g?opt.g.d/2:15)-6}" font-size="9.5" font-weight="bold" fill="#ff8a80" text-anchor="middle" stroke="#123" stroke-width="2.5" paint-order="stroke">奥：${esc(opt.sides.B.replace(/（.*/,''))}</text>`;}}
  // グリーン（形・段・傾斜）とピン
  const g=(opt&&opt.g)||{w:26,d:30},pin=(opt&&opt.pin)||{x:0,y:0};const PX=G[0]+pin.x,PY=G[1]+pin.y;
  s+=`<ellipse cx="${G[0]}" cy="${-G[1]}" rx="${g.w/2}" ry="${g.d/2}" fill="#9be07f" stroke="#e8f7df" stroke-width="1.5"/>`;
  if(g.tiers>1)for(let k=1;k<g.tiers;k++){const yy=G[1]-g.d/2+g.d*k/g.tiers;s+=`<line x1="${G[0]-g.w/2+3}" y1="${-yy}" x2="${G[0]+g.w/2-3}" y2="${-yy}" stroke="#5f9e4c" stroke-width="1.5" stroke-dasharray="3 2"/>`;}
  if(g.slope!=null){const a=g.slope*Math.PI/180;const dx=Math.sin(a)*7,dy=Math.cos(a)*7;s+=`<line x1="${G[0]+dx}" y1="${-(G[1]+dy)}" x2="${G[0]-dx}" y2="${-(G[1]-dy)}" stroke="#2e6b2a" stroke-width="2" marker-end="url(#ar)"/>`;}
  s+=`<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2e6b2a"/></marker></defs>`;
  s+=`<line x1="${PX}" y1="${-PY}" x2="${PX}" y2="${-PY-18}" stroke="#fff" stroke-width="1.5"/><path d="M${PX} ${-PY-18} l10 3.5 l-10 3.5z" fill="#e53935"/><circle cx="${PX}" cy="${-PY}" r="1.8" fill="#111"/>`;
  s+=`<rect x="-7" y="-6" width="14" height="10" rx="2" fill="#b7e39c" stroke="#fff"/>`;
  // ボールの集まる範囲（トラックマンのブレ）
  const T=m.t||[];const cl=opt&&opt.club;
  if(cl&&cl.side!=null&&T[0]){const u=[T[0][0],T[0][1]];const L0=Math.hypot(u[0],u[1]);const ux=u[0]/L0,uy=u[1]/L0;const D=cl.total||cl.carry;
    const cx=ux*D+uy*cl.side,cy=uy*D-ux*cl.side;const ang=Math.atan2(ux,uy)*180/Math.PI;
    s+=`<ellipse cx="${cx}" cy="${-cy}" rx="${Math.max(6,1.5*(cl.sdSide||10))}" ry="${Math.max(6,1.5*(cl.sdCarry||8))}" transform="rotate(${ang} ${cx} ${-cy})" fill="#ffd54a" fill-opacity=".18" stroke="#ffd54a" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s+=`<text x="${cx}" y="${-cy+Math.max(6,1.5*(cl.sdCarry||8))+11}" font-size="8.5" fill="#ffd54a" text-anchor="middle" font-weight="bold">あなたの${cl.c}（平均）</text>`;}
  // 狙い
  let prev=[0,0];
  T.forEach((t,i)=>{s+=`<line x1="${prev[0]}" y1="${-prev[1]}" x2="${t[0]}" y2="${-t[1]}" stroke="#ffd54a" stroke-width="2" stroke-dasharray="5 4"/>`;prev=t;});
  s+=`<line x1="${prev[0]}" y1="${-prev[1]}" x2="${PX}" y2="${-PY}" stroke="#ffd54a" stroke-width="2" stroke-dasharray="5 4"/>`;
  prev=[0,0];
  T.forEach((t,i)=>{const d=Math.round(Math.hypot(t[0]-prev[0],t[1]-prev[1]));const rest=Math.round(Math.hypot(PX-t[0],PY-t[1]));prev=t;
    const right=(maxX-t[0])>=(t[0]-minX);const tx=right?t[0]+14:t[0]-14;
    s+=`<circle cx="${t[0]}" cy="${-t[1]}" r="12" fill="#ffd54a" fill-opacity=".25" stroke="#ffd54a" stroke-width="2.5"/><text x="${t[0]}" y="${-t[1]+4}" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">${i+1}</text>`;
    s+=`<g font-size="10" font-weight="bold"><rect x="${right?tx:tx-86}" y="${-t[1]-13}" width="86" height="26" rx="4" fill="#111" fill-opacity=".72"/><text x="${right?tx+5:tx-81}" y="${-t[1]-2}" fill="#ffd54a">${i+1}打目 ${esc(t[2]||'')}</text><text x="${right?tx+5:tx-81}" y="${-t[1]+10}" fill="#fff">${d}y・ピンまで${rest}y</text></g>`;});
  s+='</svg>';return s;
}

// ティーからの距離の一覧
function hazList(m,yards,dt){dt=dt||0;const c=m.c,G=c[c.length-1];const len=Math.round(holeLen(c));const side=h=>{const x0=alongPt(c,h.y||0)[0];const d=(h.x||0)-x0;return d<-6?'左':d>6?'右':'正面';};
  const L=[];
  m.hz.slice().sort((a,b)=>(a.y||a.from||0)-(b.y||b.from||0)).forEach(h=>{
    if(h.t==='b')L.push(`⛱ ${side(h)}バンカー <b>${Math.round(h.y-6-dt)}y</b>（越え${Math.round(h.y+6-dt)}）`);
    else if(h.t==='w')L.push(`💧 ${side(h)}の池 <b>${Math.round(h.y-h.ry-dt)}y</b>（越え${Math.round(h.y+h.ry-dt)}）`);
    else if(h.t==='v')L.push(`⛰ 谷 <b>${h.from-dt}y</b>（越え${h.to-dt}）`);
    else if(h.t==='ob')L.push(`⚠ ${h.side==='L'?'左':'右'}OB ${h.from?h.from+'y〜':''}`);
    else if(h.t==='t')L.push(`🌲 目印の木 <b>${h.y-dt}y</b>`);});
  L.push(`⛳ グリーン中央 <b>${yards||len}y</b>`);return L;}

// ── グリーン（大きさ・段・傾斜）…わかっている所だけ。slope＝ボールが転がる向き（0=手前へ、90=右へ、-90=左へ、180=奥へ）
const GREEN_BASE={tojo:{w:26,d:30},taka:{w:22,d:27}};
const GREEN_INFO={
 tojo:{1:{slope:0,note:'少し高い受けグリーン。2打目は大きめのクラブで'},2:{note:'奥は危険。手前から'},3:{slope:0,note:'奥は危険。手前から攻める'},6:{w:32,d:34,slope:90,note:'大きく、やや右に傾斜。左側から攻める（公式）'},9:{note:'真ん中が安全。少し大きめのクラブで'},11:{note:'2打目は打ち下ろし。奥は禁物'},14:{note:'打ち上げでピンが見えない。右側が安全'},15:{slope:0,note:'前下がりで速い。手前から'},17:{tiers:2,note:'2段グリーン。起伏があり、1パット目が大事'},18:{note:'起伏が大きい。左側から攻める。右は要注意'}},
 taka:{1:{slope:-30,note:'右奥から手前に傾斜。ピンの左手前が狙い目'},2:{slope:40,note:'右手前に速い'},3:{tiers:2,note:'2段グリーン。距離感が難しい'},6:{slope:0,note:'受けグリーン。手前から'},8:{tiers:3,slope:90,note:'3段。左から右への傾斜がきついので左狙い'},10:{tiers:2,note:'2段。上の段を狙いたいが、右はすぐOB'},11:{note:'打ち上げで面が見えない。奥はOB'},14:{note:'手前のバンカーが深い。少し大きめ'},15:{slope:0,note:'受けグリーン。奥はOB。手前から'},17:{note:'手前のバンカーが深い'}},
};
function greenOf(key,no){return {...GREEN_BASE[key],...((GREEN_INFO[key]||{})[no]||{})};}
const pinKey=(d,n)=>`pin:${d}:${n}`;
function pinOf(d,n){try{return JSON.parse(localStorage.getItem(pinKey(d,n))||'null')||{x:0,y:0};}catch{return{x:0,y:0};}}
function setPin(d,n,p){try{localStorage.setItem(pinKey(d,n),JSON.stringify(p));}catch{}}

// キャディのアドバイス
function caddie(x,h,m){
  const G=m.c[m.c.length-1],g=greenOf(x.mapKey,h[0]),pin=pinOf(x.date,h[0]);const P=[G[0]+pin.x,G[1]+pin.y];
  const T=m.t||[];const out=[];
  const sd0=(HOLE_SIDES[x.mapKey]||{})[h[0]];if(sd0){out.push(`<span class="${sideCls(sd0.L)}">左 ${sideMark(sd0.L)} ${esc(sd0.L)}</span>`);out.push(`<span class="${sideCls(sd0.R)}">右 ${sideMark(sd0.R)} ${esc(sd0.R)}</span>`);if(sd0.F)out.push(`<span class="text-warn">前 ✕ ${esc(sd0.F)}</span>`);if(sd0.B)out.push(`<span class="text-warn">奥 ✕ ${esc(sd0.B)}</span>`);}
  const st=(HOLE_STATS[x.mapKey]||{})[h[0]];if(st)out.push(`<span class="text-muted">同じレベル（96〜105）の平均 <b class="text-fg">${st.avg.toFixed(2)}</b>・難易度${st.rank}位・OB率${Math.round(st.ob)}%${h[1]>3?`・FWキープ${Math.round(st.fw)}%`:''}（GDO）</span>`);
  const hasClubs=typeof MYCLUBS!=='undefined'&&Object.keys(MYCLUBS).length;
  if(T[0]&&hasClubs){const code=clubCode(T[0][2])||clubCode(h[5]);const c=code&&MYCLUBS[code];
    if(c){const car=c.carry,tot=c.total||c.carry;out.push(`<b>1打目 ${code}</b>：あなたの平均 キャリー${Math.round(car)}y・トータル${Math.round(tot)}y${c.src==='仮'?'（仮）':''}`);
      const warn=[];m.hz.forEach(z=>{let f,b,nm;if(z.t==='b'){f=z.y-6;b=z.y+6;nm='バンカー';}else if(z.t==='w'){f=z.y-z.ry;b=z.y+z.ry;nm='池';}else if(z.t==='v'){f=z.from;b=z.to;nm='谷';}else return;const dt0=teeShift(x.mapKey,h[0]);f-=dt0;b-=dt0;
        const sd=(c.sdCarry||8)*1.5;if(f<=tot+sd&&b>=car-sd-10){const x0=alongPt(m.c,(f+b)/2+dt0)[0];const sdd=(z.x||0)-x0;warn.push(`${sdd<-6?'左':sdd>6?'右':'正面'}の${nm}（${Math.round(f)}〜${Math.round(b)}y）`);}
        else if(z.t!=='b'&&b<car-sd)out.push(`${nm}（越え${Math.round(b)}y）はキャリーで越える`);});
      if(warn.length)out.push(`<span class="text-warn">⚠ 届く範囲：${warn.join('・')}</span> → 1番手落とすか、反対側を狙う`);
      if(c.side!=null&&Math.abs(c.side)>=6)out.push(`打ち出しが平均で<b>${c.side>0?'右':'左'}に約${Math.abs(Math.round(c.side))}y</b>ずれる${c.date?`（${+c.date.slice(5,7)}/${+c.date.slice(8)}のトラックマン）`:''} → その分${c.side>0?'左':'右'}を向いて構える`);}}
  const last=T.length?T[T.length-1]:[0,teeShift(x.mapKey,h[0])];const dist=Math.round(Math.hypot(P[0]-last[0],P[1]-last[1]));
  const toC=Math.hypot(G[0]-last[0],G[1]-last[1]);const fr=Math.round(toC-g.d/2),bk=Math.round(toC+g.d/2);
  const pc=!T.length&&hasClubs&&teeCodeOf(x,h);const cf=pc&&MYCLUBS[pc]?MYCLUBS[pc]:hasClubs&&clubFor(dist,['1W']);
  out.push(`<b>${T.length?(T.length+1)+'打目':'ティーショット'}</b>：ピンまで<b>${dist}y</b>（手前${fr}y・奥${bk}y）${cf?` → <b class="text-accent">${cf.c}</b>（キャリー${Math.round(cf.carry)}y${cf.carry<dist-3&&(cf.total||0)>=dist-5?`・トータル${Math.round(cf.total)}y＝転がして届く`:''}）`:''}`);
  if(g.note)out.push(`グリーン：${esc(g.note)}`);
  return out;
}

// ── 公式のホールイラスト（東条湖CC公式サイト）… r=ティー→公式の攻略ルートの点→グリーン（画像の座標）、s=1ヤードあたりの画像の長さ
const ILLUS={tojo:[Object.assign({"base": "https://i.gimg.jp/resource/reserve/courseimage/28107_", "w": 200, "credit": "ホール図：GDOゴルフ場予約", "holes": {"1": {"r": [[87.8, 646.7], [89.6, 83.1]], "s": 1.8358, "h": 721}, "2": {"r": [[130.7, 706.8], [98.4, 434.2], [98.4, 184.8], [140.0, 62.8]], "s": 1.346, "h": 769}, "3": {"r": [[62.8, 471.2], [122.9, 240.2], [53.6, 55.4]], "s": 1.3214, "h": 525}, "4": {"r": [[124.3, 614.4], [82.7, 397.3], [138.1, 60.1]], "s": 1.3463, "h": 671}, "5": {"r": [[79.5, 637.5], [88.7, 351.1], [134.9, 60.1]], "s": 1.6846, "h": 727}, "6": {"r": [[90.1, 512.7], [90.1, 134.0]], "s": 2.0037, "h": 624}, "7": {"r": [[106.2, 948.8], [101.6, 277.2], [98.9, 97.0]], "s": 1.981, "h": 1056}, "8": {"r": [[84.5, 739.1], [112.3, 443.5], [66.1, 166.3], [70.7, 83.1]], "s": 1.3578, "h": 830}, "9": {"r": [[99.8, 531.2], [99.8, 97.0]], "s": 3.1693, "h": 611}, "10": {"r": [[68.8, 702.1], [115.0, 351.1], [59.6, 60.1]], "s": 1.8063, "h": 766}, "11": {"r": [[102.5, 489.7], [70.2, 258.7], [121.0, 50.8]], "s": 1.2088, "h": 547}, "12": {"r": [[62.4, 494.3], [131.7, 304.9], [76.2, 147.8], [67.0, 55.4]], "s": 0.9469, "h": 525}, "13": {"r": [[143.2, 526.6], [73.9, 277.2], [134.0, 64.7]], "s": 1.3705, "h": 598}, "14": {"r": [[89.2, 545.1], [79.9, 120.1]], "s": 2.8152, "h": 650}, "15": {"r": [[53.6, 545.1], [141.4, 388.0], [95.2, 184.8], [53.6, 50.8]], "s": 1.1014, "h": 579}, "16": {"r": [[82.7, 628.2], [115.0, 351.1], [78.1, 64.7]], "s": 1.8255, "h": 703}, "17": {"r": [[97.9, 434.2], [97.9, 110.9]], "s": 2.1993, "h": 544}, "18": {"r": [[76.2, 877.7], [108.6, 415.7], [71.6, 78.5]], "s": 1.9381, "h": 899}}},{name:'GDO図',ext:n=>n+'.jpg',note:'図は縮図のため、距離は目安'}),{name:'公式図',base:'https://www.tojoko-cc.com/course/images/',w:161,h:350,credit:'イラスト：東条湖カントリー倶楽部 公式サイト',ext:n=>String(n).padStart(2,'0')+'.gif',note:'公式の200y・220y線に合わせています',holes:{"1": {"r": [[79.5, 322.6], [79.5, 113.4], [68.1, 59.1]], "s": 0.906}, "2": {"r": [[97.4, 322.6], [54.5, 65.5], [62.3, 31.0]], "s": 0.5962}, "3": {"r": [[60.8, 317.8], [100.3, 134.5], [65.3, 50.5]], "s": 0.8653}, "4": {"r": [[111.9, 314.8], [63.3, 158.7], [83.7, 29.3]], "s": 0.7344}, "5": {"r": [[84.4, 320.0], [73.0, 141.4], [83.7, 41.0]], "s": 0.8212}, "6": {"r": [[88.0, 301.9], [74.4, 78.5]], "s": 1.1842}, "7": {"r": [[86.0, 320.0], [74.6, 174.6], [75.3, 40.1]], "s": 0.6688}, "8": {"r": [[96.4, 323.4], [101.3, 183.3], [71.1, 64.7], [49.7, 31.0]], "s": 0.6474}, "9": {"r": [[69.5, 274.7], [78.6, 67.7]], "s": 1.5124}, "10": {"r": [[86.9, 307.5], [91.5, 126.3], [49.6, 38.8]], "s": 0.7723}, "11": {"r": [[101.3, 319.1], [64.9, 165.2], [93.8, 61.2]], "s": 0.7135}, "12": {"r": [[58.2, 322.6], [118.8, 181.1], [51.0, 68.1], [53.9, 38.8]], "s": 0.664}, "13": {"r": [[109.7, 318.2], [59.4, 142.3], [92.5, 50.9]], "s": 0.7995}, "14": {"r": [[94.1, 297.5], [65.6, 98.3]], "s": 1.3326}, "15": {"r": [[54.3, 316.9], [108.4, 178.1], [60.8, 58.2], [48.8, 39.7]], "s": 0.6363}, "16": {"r": [[51.3, 300.6], [74.9, 115.6], [72.0, 44.4]], "s": 0.8374}, "17": {"r": [[84.7, 291.5], [80.2, 56.1]], "s": 1.6017}, "18": {"r": [[80.2, 326.9], [87.7, 244.9], [94.5, 169.0], [64.0, 33.2]], "s": 0.7171}}}],
 taka:[Object.assign({"base": "https://i.gimg.jp/resource/reserve/courseimage/28077_", "w": 200, "credit": "ホール図：GDOゴルフ場予約", "holes": {"1": {"r": [[124.7, 688.3], [101.6, 369.5], [129.3, 83.1]], "s": 1.2147, "h": 746}, "2": {"r": [[84.5, 660.6], [98.4, 369.5], [84.5, 73.9]], "s": 1.5376, "h": 791}, "3": {"r": [[118.3, 683.7], [90.5, 369.5], [113.6, 87.8]], "s": 1.5949, "h": 773}, "4": {"r": [[101.2, 351.1], [105.8, 83.1]], "s": 2.1105, "h": 423}, "5": {"r": [[93.3, 739.1], [102.5, 369.5], [93.3, 64.7]], "s": 1.3413, "h": 818}, "6": {"r": [[103.9, 480.4], [103.9, 110.9]], "s": 2.1864, "h": 566}, "7": {"r": [[73.9, 480.4], [115.5, 258.7], [73.9, 60.1]], "s": 1.1158, "h": 547}, "8": {"r": [[75.3, 554.3], [112.3, 258.7], [70.7, 73.9]], "s": 1.4679, "h": 626}, "9": {"r": [[81.3, 591.3], [113.6, 231.0], [76.7, 60.1]], "s": 1.401, "h": 662}, "10": {"r": [[142.7, 378.8], [68.8, 212.5], [142.7, 55.4]], "s": 1.0776, "h": 426}, "11": {"r": [[125.6, 452.7], [70.2, 249.4], [134.9, 60.1]], "s": 1.1669, "h": 564}, "12": {"r": [[122.4, 628.2], [113.2, 277.2], [122.4, 60.1]], "s": 1.4282, "h": 733}, "13": {"r": [[101.6, 923.9], [97.0, 461.9], [110.9, 83.1]], "s": 1.5869, "h": 965}, "14": {"r": [[79.9, 426.8], [103.0, 110.9]], "s": 2.1402, "h": 599}, "15": {"r": [[81.3, 748.3], [90.5, 415.7], [90.5, 115.5]], "s": 1.918, "h": 851}, "16": {"r": [[142.7, 498.9], [73.4, 277.2], [142.7, 55.4]], "s": 1.3163, "h": 560}, "17": {"r": [[102.5, 415.7], [102.5, 110.9]], "s": 1.917, "h": 510}, "18": {"r": [[127.0, 582.0], [71.6, 304.9], [127.0, 78.5]], "s": 1.3359, "h": 640}}},{name:'GDO図',ext:n=>n+'.jpg',note:'図は縮図のため、距離は目安'})]};
// 宝塚クラシックGC 公式サイトのホール写真（1・3・5・7・8番）
const PHOTOS={taka:{1:'https://www.takarazuka-cgc.com/_src/96801238/photo01.jpg',3:'https://www.takarazuka-cgc.com/_src/96801240/photo02.jpg',5:'https://www.takarazuka-cgc.com/_src/96801242/photo03.jpg',7:'https://www.takarazuka-cgc.com/_src/96801244/photo04.jpg',8:'https://www.takarazuka-cgc.com/_src/96801246/photo05.jpg'}};
function routeAt(r,d){for(let i=1;i<r.length;i++){const L=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);if(d<=L||i===r.length-1){const k=Math.min(1,d/L);const ux=(r[i][0]-r[i-1][0])/L,uy=(r[i][1]-r[i-1][1])/L;return{p:[r[i-1][0]+(r[i][0]-r[i-1][0])*k,r[i-1][1]+(r[i][1]-r[i-1][1])*k],u:[ux,uy]};}d-=L;}}
// 公式イラストの上に狙いを重ねる
function illusView(I,hi,m,opt){m=tmAdjust(m);const L=(opt&&opt.L)||1;const DT=(opt&&opt.dt)||0;const SC=(x,y)=>`translate(${x} ${y}) scale(${L}) translate(${-x} ${-y})`;
  const r=hi.r,s=hi.s,G=r[r.length-1];const T=m.t||[];const T0=(()=>{if(DT>=0)return routeAt(r,DT*s).p;const u=routeAt(r,0).u;return [r[0][0]-u[0]*(-DT)*s,r[0][1]-u[1]*(-DT)*s];})();
  const toPx=(x,y)=>{const a=routeAt(r,y*s);return [a.p[0]-a.u[1]*x*s,a.p[1]+a.u[0]*x*s];}; // 右＝進行方向の右
  const last=routeAt(r,1e9).u;const pin=(opt&&opt.pin)||{x:0,y:0};const P=[G[0]-last[1]*pin.x*s+last[0]*pin.y*s,G[1]+last[0]*pin.x*s+last[1]*pin.y*s];
  const IH=hi.h||I.h;let v=`<svg viewBox="0 0 ${I.w} ${IH}" class="absolute inset-0 h-full w-full" style="overflow:visible" font-family="sans-serif">`;
  const cl=opt&&opt.club;
  if(cl&&cl.side!=null&&T[0]){const a=routeAt(r,(cl.total||cl.carry)*s);const c=[a.p[0]-a.u[1]*cl.side*s,a.p[1]+a.u[0]*cl.side*s];const ang=Math.atan2(a.u[0],-a.u[1])*180/Math.PI;
    v+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${Math.max(3,1.5*(cl.sdSide||10)*s)}" ry="${Math.max(3,1.5*(cl.sdCarry||8)*s)}" transform="rotate(${ang} ${c[0]} ${c[1]})" fill="#ffb300" fill-opacity=".22" stroke="#e65100" stroke-width=".7" stroke-dasharray="2 1.5"/>`;}
  let prev=T0;const pts=T.map(t=>toPx(t[0],t[1]));v+=`<circle cx="${T0[0]}" cy="${T0[1]}" r="${3*L}" fill="#fff" stroke="#111" stroke-width=".8"/>`;
  [...pts,P].forEach(q=>{v+=`<line x1="${prev[0]}" y1="${prev[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#e65100" stroke-width="1" stroke-dasharray="2.5 1.5"/>`;prev=q;});
  v+=`<line x1="${P[0]}" y1="${P[1]}" x2="${P[0]}" y2="${P[1]-9}" stroke="#111" stroke-width=".6"/><path d="M${P[0]} ${P[1]-9} l5 1.8 l-5 1.8z" fill="#e53935"/>`;
  let pv=[0,0];
  T.forEach((t,i)=>{const q=pts[i];const d=i===0?Math.round(Math.hypot(q[0]-T0[0],q[1]-T0[1])/s):Math.round(Math.hypot(t[0]-pv[0],t[1]-pv[1]));pv=t;const rest=Math.round(Math.hypot(P[0]-q[0],P[1]-q[1])/s);
    const right=q[0]<I.w/2;const bx=right?Math.min(q[0]+7,I.w-55):Math.max(1,q[0]-7-54);
    v+=`<g transform="${SC(q[0],q[1])}"><circle cx="${q[0]}" cy="${q[1]}" r="5.5" fill="#ffb300" fill-opacity=".35" stroke="#e65100" stroke-width="1.2"/><text x="${q[0]}" y="${q[1]+2.2}" font-size="6" font-weight="bold" fill="#111" text-anchor="middle">${i+1}</text>`;
    v+=`<rect x="${bx}" y="${q[1]-7}" width="54" height="14" rx="2" fill="#111" fill-opacity=".78"/><text x="${bx+2.5}" y="${q[1]-1.2}" font-size="5.2" font-weight="bold" fill="#ffd54a">${i+1}打目 ${esc(t[2]||'')}</text><text x="${bx+2.5}" y="${q[1]+5}" font-size="5.2" font-weight="bold" fill="#fff">${d}y・ピン${rest}y</text></g>`;});
  // OBライン（出典に「OB」とある側だけ。範囲の指定がない時はホール全体）
  if(opt&&opt.sides){const sd=opt.sides;const Lr=r.reduce((t,q,i)=>i?t+Math.hypot(q[0]-r[i-1][0],q[1]-r[i-1][1]):0,0);const rg=(opt.obr||{});
    ['L','R'].forEach(k=>{const t=sd[k]||'';if(!/^OB(?!の記載)/.test(t))return;const sg=k==='R'?1:-1;const [f,e]=rg[k]||[0,9999];const pts=[];
      for(let d=Math.max(0,f*s);d<=Math.min(Lr,e*s)+0.1;d+=4){const a=routeAt(r,Math.min(d,Lr));let px=a.p[0]-a.u[1]*sg*36*s,py=a.p[1]+a.u[0]*sg*36*s;px=Math.max(2,Math.min(I.w-2,px));pts.push([px,py]);}
      if(pts.length<2)return;v+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#fff" stroke-width="${1.6*L}" stroke-dasharray="${4*L} ${3*L}"/><polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#d32f2f" stroke-width="${0.8*L}" stroke-dasharray="${4*L} ${3*L}"/>`;
      [0.3,0.75].forEach(fr=>{const q=pts[Math.floor((pts.length-1)*fr)];v+=`<g transform="${SC(q[0],q[1])}"><rect x="${q[0]-8}" y="${q[1]-5}" width="16" height="10" rx="2" fill="#d32f2f" stroke="#fff" stroke-width=".6"/><text x="${q[0]}" y="${q[1]+2.6}" font-size="6.5" font-weight="bold" fill="#fff" text-anchor="middle">OB</text></g>`;});});
    if(/^OB(?!の記載)/.test(sd.B||'')){const a=routeAt(r,1e9);const bx=G[0]+a.u[0]*22*s,by=G[1]+a.u[1]*22*s;const px=-a.u[1],py=a.u[0];const w=30*s;
      v+=`<line x1="${bx-px*w}" y1="${by-py*w}" x2="${bx+px*w}" y2="${by+py*w}" stroke="#fff" stroke-width="${1.6*L}" stroke-dasharray="${4*L} ${3*L}"/><line x1="${bx-px*w}" y1="${by-py*w}" x2="${bx+px*w}" y2="${by+py*w}" stroke="#d32f2f" stroke-width="${0.8*L}" stroke-dasharray="${4*L} ${3*L}"/>`;}}
  if(opt&&opt.sides){const sd=opt.sides;const L=r.reduce((t,q,i)=>i?t+Math.hypot(q[0]-r[i-1][0],q[1]-r[i-1][1]):0,0);const a=routeAt(r,L*0.2);
    const bad=t=>sideKind(t)==='bad';const lab=t=>t.replace(/（.*/,'');
    [['L',2,'start','← 左'],['R',I.w-2,'end','右 →']].forEach(([k,xx,an,hd])=>{const t=sd[k];if(sideKind(t)==='na')return;const c=bad(t)?'#c62828':sideKind(t)==='good'?'#2e7d32':'#555';const w=Math.max(30,lab(t).length*5.4+6);const bx=an==='start'?xx:xx-w;
      v+=`<g transform="${SC(xx,a.p[1])}"><rect x="${bx}" y="${a.p[1]-9}" width="${w}" height="17" rx="2.5" fill="#fff" fill-opacity=".92" stroke="${c}" stroke-width=".8"/><text x="${bx+3}" y="${a.p[1]-2.2}" font-size="5" font-weight="bold" fill="${c}">${hd}</text><text x="${bx+3}" y="${a.p[1]+5.2}" font-size="5.6" font-weight="bold" fill="${c}">${sideMark(t)} ${esc(lab(t))}</text></g>`;});
    if(sd.B){const w=Math.max(34,sd.B.length*5.4+14);v+=`<g transform="${SC(G[0],Math.max(1,G[1]-24))}"><rect x="${G[0]-w/2}" y="${Math.max(1,G[1]-24)}" width="${w}" height="10" rx="2" fill="#c62828"/><text x="${G[0]}" y="${Math.max(1,G[1]-24)+7.2}" font-size="5.6" font-weight="bold" fill="#fff" text-anchor="middle">奥 ✕ ${esc(sd.B.replace(/（.*/,''))}</text></g>`;}}
  if(HM&&HM.tap){const q=HM.tap;const ft=Math.round(Math.hypot(q[0]-T0[0],q[1]-T0[1])/s),tp=Math.round(Math.hypot(P[0]-q[0],P[1]-q[1])/s);const bx=q[0]<I.w/2?q[0]+5:q[0]-5-50;
    v+=`<line x1="${T0[0]}" y1="${T0[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#1565c0" stroke-width=".7"/><line x1="${q[0]}" y1="${q[1]}" x2="${P[0]}" y2="${P[1]}" stroke="#1565c0" stroke-width=".7" stroke-dasharray="1.5 1"/><circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#1565c0" stroke="#fff" stroke-width=".8"/>`;
    v+=`<g transform="${SC(q[0],q[1])}"><rect x="${bx}" y="${q[1]-7}" width="50" height="14" rx="2" fill="#1565c0"/><text x="${bx+2.5}" y="${q[1]-1.2}" font-size="5.2" font-weight="bold" fill="#fff">ティーから ${ft}y</text><text x="${bx+2.5}" y="${q[1]+5}" font-size="5.2" font-weight="bold" fill="#fff">ピンまで ${tp}y</text></g>`;}
  return v+'</svg>';
}

// ティー別のヤード（東条湖：公式／GDO、宝塚：公式スコアカード）
const TEES={
 tojo:[['バック',[317,500,355,430,365,200,445,510,153,375,395,497,370,163,491,330,158,428]],['レギュラー',[307,485,330,418,345,189,430,487,137,360,370,487,350,151,480,311,147,414]],['レディース',[277,440,298,324,320,157,310,385,103,318,324,380,337,119,428,247,123,328]]],
 taka:[['バック',[519,421,390,147,519,200,401,347,397,341,387,440,551,176,350,363,169,396]],['レギュラー',[500,382,375,127,503,169,384,332,383,330,352,398,530,148,330,353,159,386]],['フロント',[481,368,362,118,487,158,368,315,327,309,328,345,509,142,313,343,145,376]],['レディース',[478,360,352,112,473,147,353,310,321,289,301,343,491,136,295,340,135,374]],['レディース（前）',[418,298,264,112,407,100,311,250,278,289,260,248,449,60,295,310,77,301]]]};
const teeIdx=k=>{try{const v=parseInt(localStorage.getItem('tee:'+k));const T=TEES[k]||[];return v>=0&&v<T.length?v:T.findIndex(t=>t[0]==='レギュラー');}catch{return 1;}};
function setTee(k,i){try{localStorage.setItem('tee:'+k,String(i));}catch{}HM.L=0;HM.tap=null;drawHoleMap();}
// レギュラーとの差（前に出る分がプラス）
function teeShift(k,n){const T=TEES[k];if(!T)return 0;const reg=T.find(t=>t[0]==='レギュラー')[1][n-1];return reg-T[teeIdx(k)][1][n-1];}

// ── 全画面で開く ──
let HM=null;
function openHoleMap(date,no){
  const x=ROUND_BASE(date);if(!x||!x.mapKey)return;
  const order=(x.order||['out','in']).flatMap(k=>x.holes.filter(h=>k==='out'?h[0]<=9:h[0]>=10)).map(h=>h[0]);
  HM={date,no,order,z:1,view:'hole',tap:null,src:0,L:0};
  if(typeof buildClubs==='function')getRecs().then(r=>{buildClubs(r);if(HM)drawHoleMap();});
  drawHoleMap();
}
function greenSVG(g,pin){ // グリーンを上から大きく
  const W=g.w+16,H=g.d+16;let s=`<svg id="gsvg" xmlns="http://www.w3.org/2000/svg" viewBox="${-W/2} ${-H/2} ${W} ${H}" class="block h-auto w-full touch-none" font-family="sans-serif">`;
  s+=`<rect x="${-W/2}" y="${-H/2}" width="${W}" height="${H}" fill="#4d8a43"/><ellipse cx="0" cy="0" rx="${g.w/2}" ry="${g.d/2}" fill="#9be07f" stroke="#e8f7df" stroke-width=".5"/>`;
  for(let v=-Math.floor(g.d/2/5)*5;v<=g.d/2;v+=5)s+=`<line x1="${-g.w/2}" y1="${-v}" x2="${g.w/2}" y2="${-v}" stroke="#fff" stroke-opacity=".25" stroke-width=".2"/>`;
  if(g.tiers>1)for(let k=1;k<g.tiers;k++){const yy=-g.d/2+g.d*k/g.tiers;s+=`<line x1="${-g.w/2+1}" y1="${-yy}" x2="${g.w/2-1}" y2="${-yy}" stroke="#3f7f35" stroke-width=".6" stroke-dasharray="1.5 1"/><text x="${g.w/2-1}" y="${-yy-1}" font-size="2.2" fill="#2e6b2a" text-anchor="end">段</text>`;}
  if(g.slope!=null){const a=g.slope*Math.PI/180;for(const [ox,oy] of [[-g.w/4,0],[g.w/4,0],[0,g.d/4],[0,-g.d/4]]){const dx=Math.sin(a)*2.5,dy=Math.cos(a)*2.5;s+=`<line x1="${ox+dx}" y1="${-(oy+dy)}" x2="${ox-dx}" y2="${-(oy-dy)}" stroke="#2e6b2a" stroke-width=".5" marker-end="url(#ar2)"/>`;}
    s+=`<defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2e6b2a"/></marker></defs>`;}
  s+=`<text x="0" y="${H/2-1.5}" font-size="2.6" fill="#fff" text-anchor="middle">▼ 手前（ティー側）</text>`;
  s+=`<line x1="${pin.x}" y1="${-pin.y}" x2="${pin.x}" y2="${-pin.y-5}" stroke="#fff" stroke-width=".4"/><path d="M${pin.x} ${-pin.y-5} l3 1 l-3 1z" fill="#e53935"/><circle cx="${pin.x}" cy="${-pin.y}" r=".7" fill="#111"/>`;
  return s+'</svg>';}
// 作戦で決めた1打目のクラブ（プランのteeBy → ホールのクラブ欄の先頭）
function teeCodeOf(x,h){const v=(x.teeBy&&x.teeBy[h[0]])||(x.teeClub&&h[1]>3?x.teeClub:null)||String(h[5]||'').split(/[ \/／]/)[0];return v==='ドライバー'?'1W':(typeof clubCode==='function'&&clubCode(v))||null;}
function drawHoleMap(){
  const x=ROUND_BASE(HM.date);const h=x.holes.find(r=>r[0]===HM.no);let m=HOLE_MAPS[x.mapKey][HM.no];{const tc=teeCodeOf(x,h);if(tc&&h[1]>3&&m.t&&m.t[0])m={...m,t:[[m.t[0][0],m.t[0][1],tc],...m.t.slice(1)]};}
  const g=greenOf(x.mapKey,h[0]),pin=pinOf(HM.date,h[0]);
  m=tmAdjust(m);const code=m.t&&m.t[0]?(clubCode(m.t[0][2])||clubCode(h[5])):null;const club=typeof MYCLUBS!=='undefined'&&code&&MYCLUBS[code]&&MYCLUBS[code].src!=='仮'?MYCLUBS[code]:null;
  const VW=(ILLUS[x.mapKey]||[]).filter(v=>v.holes[h[0]]);if(HM.src>=VW.length)HM.src=0;const IL=VW[HM.src||0]||null;const IH=IL?(IL.holes[h[0]].h||IL.h):0;const PH=(PHOTOS[x.mapKey]||{})[h[0]];
  const i=HM.order.indexOf(HM.no);const pv=HM.order[i-1],nx=HM.order[i+1];
  let el=$('holemap');if(!el){el=document.createElement('div');el.id='holemap';el.className='fixed inset-0 z-40 flex flex-col bg-bg';document.body.appendChild(el);document.body.style.overflow='hidden';}
  const col=h[7]==='hard'?'bg-warn':h[7]==='mid'?'bg-sand':'bg-accent';const gv=HM.view==='green';
  el.innerHTML=`
   <div class="flex items-center gap-2 border-b border-line bg-surface px-3 py-2" style="padding-top:calc(env(safe-area-inset-top,0px) + 8px)">
    <span class="grid h-10 w-10 place-items-center rounded-lg ${col} font-mono text-lg font-bold text-surface">${h[0]}</span>
    <div class="min-w-0 flex-1"><div class="font-bold leading-tight">Par${h[1]}・${TEES[x.mapKey]?TEES[x.mapKey][teeIdx(x.mapKey)][1][h[0]-1]:h[2]}y <span class="text-[11px] font-normal text-muted">${TEES[x.mapKey]?TEES[x.mapKey][teeIdx(x.mapKey)][0]:''}</span></div><div class="text-[12px] text-muted">目標 <b class="text-accent">${h[4]}</b>　ティー ${esc(h[5])}</div></div>
    <div class="seg !p-0.5 text-[12px]"><button class="${gv?'':'on'} !min-h-[36px] !px-2" onclick="HM.view='hole';drawHoleMap()">ホール</button><button class="${gv?'on':''} !min-h-[36px] !px-2" onclick="HM.view='green';drawHoleMap()">グリーン</button></div>
    <button class="btn-sm !px-2" onclick="closeHoleMap()">✕</button>
   </div>
   <div class="flex min-h-0 flex-1 flex-col lg:flex-row-reverse">
   <div class="relative min-h-0 flex-1">
    <div id="hm-scroll" class="absolute inset-0 overflow-auto bg-[#2f5d31]" style="touch-action:pan-x pan-y;overscroll-behavior:contain">
     ${gv?`<div class="mx-auto grid max-w-md gap-2 p-3"><div class="text-center text-[12px] font-bold text-white">グリーンをタップすると、今日のピンの位置になります（ピンシートを見て）</div>${greenSVG(g,pin)}
       <div class="text-center text-[12px] text-white">ピン：${pin.y===0?'真ん中':pin.y>0?`中心から奥へ${Math.round(pin.y)}y`:`中心から手前へ${Math.round(-pin.y)}y`}${pin.x?`・${pin.x>0?'右':'左'}${Math.abs(Math.round(pin.x))}y`:''}（手前から${Math.round(g.d/2+pin.y)}y）　大きさの目安 ${g.w}×${g.d}y</div>
       <div class="flex justify-center"><button class="btn-sm !border-white !text-white" onclick="setPin(HM.date,HM.no,{x:0,y:0});drawHoleMap()">ピンを真ん中に戻す</button></div></div>`
      :(IL?`<div id="hm-in" class="relative mx-auto my-1 bg-white" style="aspect-ratio:${IL.w}/${IH}"><img src="${IL.base}${IL.ext(h[0])}" alt="${h[0]}番ホールの公式イラスト" class="absolute inset-0 h-full w-full" referrerpolicy="no-referrer">${illusView(IL,IL.holes[h[0]],m,{pin,club,sides:(HOLE_SIDES[x.mapKey]||{})[h[0]]})}</div>`
       :`<div id="hm-in" class="mx-auto py-1">${holeSVG(m,h[1],h[2],{g,pin,club,sides:(HOLE_SIDES[x.mapKey]||{})[h[0]]})}</div>`)}
    </div>
    ${gv||!IL?'':`<div class="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-2 pb-1 text-center text-[10px] leading-tight" style="color:#fff;text-shadow:0 1px 2px #000">${IL.credit}（${IL.note}）・図をタップで距離／ドラッグで移動／2本指で拡大縮小</div>`}
    ${gv||!IL?'':`${VW.length>1?`<div class="absolute left-3 top-3 z-10 flex gap-1">${VW.map((v,k)=>`<button class="rounded-full px-3 py-1 text-[12px] font-bold " style="${k===(HM.src||0)?'background:#fff;color:#111':'background:rgba(0,0,0,.45);color:#fff'}" onclick="HM.src=${k};HM.tap=null;HM.L=0;drawHoleMap()">${v.name}</button>`).join('')}</div>`:''}`}
    ${gv?'':`<div class="absolute right-3 top-3 z-10 grid gap-2">
     <button class="grid h-11 w-11 place-items-center rounded-full bg-surface text-xl font-bold shadow-lg" onclick="zoomHoleMap(1)" aria-label="拡大">＋</button>
     <button class="grid h-11 w-11 place-items-center rounded-full bg-surface text-xl font-bold shadow-lg" onclick="zoomHoleMap(-1)" aria-label="縮小">－</button>
    </div>`}
   </div>
   <div class="grid max-h-[34vh] content-start gap-2 overflow-y-auto border-t border-line bg-surface p-3 lg:max-h-none lg:w-[420px] lg:border-r lg:border-t-0" style="padding-bottom:calc(env(safe-area-inset-bottom,0px) + 12px)">
    ${x.plans?`<div class="grid grid-cols-2 gap-1 rounded-xl bg-line p-1">${[['','100切り',ROUND_DEFS.find(r=>r.date===x.date).target],...Object.entries(x.plans).map(([k,P])=>[k,P.name,P.target])].map(([k,n,t])=>`<button class="min-h-[40px] rounded-lg text-[13px] font-bold" style="${(x.planKey||'')===k?'background:var(--surface);color:var(--fg);box-shadow:0 1px 2px rgba(0,0,0,.1)':'color:var(--muted)'}" onclick="setPlan('${x.date}','${k}')">${n}プラン（目標${t}）</button>`).join('')}</div>`:''}
    ${TEES[x.mapKey]?`<div class="flex flex-wrap items-center gap-1"><span class="text-[11px] font-bold text-muted">ティー</span>${TEES[x.mapKey].map((t,k)=>`<button class="rounded-full px-2.5 py-1 text-[12px] font-bold" style="${k===teeIdx(x.mapKey)?'background:var(--fg);color:var(--bg)':'border:1px solid var(--line);color:var(--muted)'}" onclick="setTee('${x.mapKey}',${k})">${t[0]} ${t[1][h[0]-1]}y</button>`).join('')}</div>`:''}
    <div class="grid grid-cols-9 gap-1">${HM.order.map(n=>{const hh=x.holes.find(r=>r[0]===n);const c=hh[7]==='hard'?'var(--warn)':hh[7]==='mid'?'var(--sand)':'var(--accent)';const on=n===HM.no;return `<button class="grid h-10 place-items-center rounded-lg font-mono text-[14px] font-bold" style="${on?`background:${c};color:var(--surface)`:`border:1.5px solid ${c};color:${c}`}" onclick="HM.no=${n};HM.z=1;HM.tap=null;HM.L=0;drawHoleMap()" aria-label="${n}番ホール">${n}</button>`;}).join('')}</div>
    <div class="rounded-lg bg-accent-soft px-2.5 py-2 text-[13px] leading-snug"><div class="mb-0.5 font-bold text-accent">🧢 キャディ</div><ul class="grid gap-1">${caddie(x,h,m).map(t=>`<li>${t}</li>`).join('')}</ul></div>
    ${PH?`<figure class="grid gap-1"><img src="${PH}" alt="${h[0]}番ホールの写真" class="w-full rounded-lg" loading="lazy" referrerpolicy="no-referrer"><figcaption class="text-[10px] text-muted">写真：宝塚クラシックゴルフ倶楽部 公式サイト</figcaption></figure>`:''}
    <div class="text-[13px] leading-snug"><b class="text-accent">狙い</b>　${esc(h[6])}</div>
    ${m.n?`<div class="text-[12px] leading-snug text-muted"><b>コース</b>　${esc(m.n)}</div>`:''}
    ${IL?'<div class="text-[11px] text-muted">下の距離はショットナビの図からの目安。公式イラストをタップして測る方が正確です。</div>':''}
    <div class="flex flex-wrap gap-1">${hazList(m,TEES[x.mapKey]?TEES[x.mapKey][teeIdx(x.mapKey)][1][h[0]-1]:h[2],teeShift(x.mapKey,h[0])).map(t=>`<span class="rounded-md bg-field px-1.5 py-0.5 text-[11px] ring-1 ring-line">${t}</span>`).join('')}</div>
    <div class="flex gap-2"><button class="btn-sub flex-1 !py-2" ${pv?`onclick="HM.no=${pv};HM.z=1;HM.tap=null;HM.L=0;drawHoleMap()"`:'disabled style="opacity:.4"'}>‹ ${pv?pv+'番':''}</button><button class="btn-sub flex-1 !py-2" ${nx?`onclick="HM.no=${nx};HM.z=1;HM.tap=null;HM.L=0;drawHoleMap()"`:'disabled style="opacity:.4"'}>${nx?nx+'番':''} ›</button></div>
   </div>
   </div>`;
  if(gv){const sv=$('gsvg');sv.addEventListener('click',e=>{const pt=sv.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(sv.getScreenCTM().inverse());
      let px=q.x,py=-q.y;const k=(px/(g.w/2))**2+(py/(g.d/2))**2;if(k>1){px/=Math.sqrt(k);py/=Math.sqrt(k);}setPin(HM.date,HM.no,{x:Math.round(px*2)/2,y:Math.round(py*2)/2});drawHoleMap();});return;}
  const sc=$('hm-scroll');const vb=IL?{width:IL.w,height:IH}:sc.querySelector('svg').viewBox.baseVal;HM.base=Math.min(sc.clientWidth,(sc.clientHeight-10)*vb.width/vb.height);
  const inn0=$('hm-in');inn0.classList.remove('mx-auto','my-1');const pad=document.createElement('div');pad.id='hm-pad';pad.style.cssText=`display:inline-block;vertical-align:top;padding:${Math.max(0,sc.clientHeight-60)}px ${Math.max(0,sc.clientWidth-60)}px`;inn0.replaceWith(pad);pad.appendChild(inn0);
  inn0.style.width=HM.base*HM.z+'px';hmGestures(sc);hmDrag(sc);if(IL){HM.L=0;HM.IL=IL;HM.ctx={IL,hi:IL.holes[h[0]],m,opt:{pin,club,sides:(HOLE_SIDES[x.mapKey]||{})[h[0]],obr:(OB_RANGE[x.mapKey]||{})[h[0]],dt:teeShift(x.mapKey,h[0])}};hmOverlay();}
  if(HM.pos){const p=HM.pos;HM.pos=null;requestAnimationFrame(()=>{sc.scrollLeft=p[0];sc.scrollTop=p[1];});}
  else if(!HM.tap)requestAnimationFrame(()=>{const i=$('hm-in'),pd=$('hm-pad');sc.scrollTop=pd.offsetTop+i.offsetTop+i.offsetHeight-sc.clientHeight+8;sc.scrollLeft=pd.offsetLeft+i.offsetLeft+i.offsetWidth/2-sc.clientWidth/2;});
}
// 拡大縮小：（px,py）＝画面上の基準点（その点が動かないように拡大する）
function hmZoomTo(z,px,py){const sc=$('hm-scroll');const inn=$('hm-in');if(!sc||!inn)return;const r=sc.getBoundingClientRect();
  if(px==null){px=r.left+sc.clientWidth/2;py=r.top+sc.clientHeight/2;}
  const ir=inn.getBoundingClientRect();const fx=(px-ir.left)/ir.width,fy=(py-ir.top)/ir.height;
  HM.z=Math.max(1,Math.min(6,z));inn.style.width=HM.base*HM.z+'px';
  const nr=inn.getBoundingClientRect();sc.scrollLeft+=(nr.left+fx*nr.width)-px;sc.scrollTop+=(nr.top+fy*nr.height)-py;
  cancelAnimationFrame(HM_RAF);HM_RAF=requestAnimationFrame(hmOverlay);}
function hmOverlay(){const c=HM&&HM.ctx;const inn=$('hm-in');if(!c||!inn)return;const L=Math.max(0.8,Math.min(3.2,2.3/(inn.offsetWidth/c.IL.w)));if(HM.L&&Math.abs(HM.L-L)<0.05&&inn.querySelector('svg'))return;HM.L=L;
  const old=inn.querySelector('svg');const tmp=document.createElement('div');tmp.innerHTML=illusView(c.IL,c.hi,c.m,{...c.opt,L});const nv=tmp.firstElementChild;old.replaceWith(nv);
  nv.addEventListener('click',e=>{if(HM.pinchAt&&Date.now()-HM.pinchAt<400)return;if(HM.dragAt&&Date.now()-HM.dragAt<300)return;const pt=nv.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(nv.getScreenCTM().inverse());HM.tap=[q.x,q.y];HM.L=0;hmOverlay();});}
let HM_RAF=0;
function zoomHoleMap(d){hmZoomTo(HM.z*(d>0?1.5:1/1.5));}
function hmGestures(sc){let d0=0,z0=1;const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);const mid=t=>[(t[0].clientX+t[1].clientX)/2,(t[0].clientY+t[1].clientY)/2];
  sc.addEventListener('touchstart',e=>{if(e.touches.length===2){d0=dist(e.touches);z0=HM.z;e.preventDefault();}},{passive:false});
  sc.addEventListener('touchmove',e=>{if(e.touches.length===2&&d0){e.preventDefault();const m=mid(e.touches);hmZoomTo(z0*dist(e.touches)/d0,m[0],m[1]);HM.pinchAt=Date.now();}},{passive:false});
  sc.addEventListener('touchend',e=>{if(e.touches.length<2)d0=0;});
  sc.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();hmZoomTo(HM.z*Math.exp(-e.deltaY*0.01),e.clientX,e.clientY);}},{passive:false});
  sc.addEventListener('dblclick',e=>{e.preventDefault();hmZoomTo(HM.z>=2.5?1:HM.z*2,e.clientX,e.clientY);});}
// PC：マウスでつかんで好きな位置へ動かす（動かした時は距離タップにしない）
function hmDrag(sc){let st=null;sc.style.cursor='grab';
  sc.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button'))return;st={x:e.clientX,y:e.clientY,l:sc.scrollLeft,t:sc.scrollTop,mv:false};});
  sc.addEventListener('pointermove',e=>{if(!st)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(!st.mv&&Math.hypot(dx,dy)<5)return;if(!st.mv){st.mv=true;try{sc.setPointerCapture(e.pointerId);}catch(_){}sc.style.cursor='grabbing';document.body.style.userSelect='none';}sc.scrollLeft=st.l-dx;sc.scrollTop=st.t-dy;e.preventDefault();});
  const up=()=>{if(!st)return;if(st.mv){HM.dragAt=Date.now();sc.style.cursor='grab';document.body.style.userSelect='';}st=null;};sc.addEventListener('pointerup',up);sc.addEventListener('pointercancel',up);
  sc.addEventListener('dragstart',e=>e.preventDefault());}
function closeHoleMap(){const el=$('holemap');if(el)el.remove();document.body.style.overflow='';HM=null;}
