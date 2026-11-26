// ─────────────────────────────────────────────
// ラウンド：ゴルフの予定・作戦・結果
//   決まっている作戦はここ（ROUND_DEFS）に書く。
//   アプリから追加したラウンドは記録（kind:'roundplan'）として保存される。
// ─────────────────────────────────────────────
// ホール：[番, Par, ヤード, ハンデ, 目標, ティーのクラブ, 狙い, 難しさ(easy/mid/hard)]
const ROUND_DEFS=[
 {date:'2026-09-22',course:'三田ゴルフクラブ',time:'',tee:'レギュラー 6,261y・Par72',members:'',plan:'',result:{score:118,putts:0},sources:[['公式 コース','https://sanda-golf.com/course/'],['GDO コース情報','https://reserve.golfdigest.co.jp/golf-course/642105/course-info/']],
  diff:{stars:4,cr:71.6,par:72,yards:6261,bunkers:76,water:5,green:'姫高麗グリーン（秋は8フィート前後）',terrain:'丘陵（坂あり）',why:['コースレートがParに近い（3つの中で一番難しい）','バンカー76個','姫高麗グリーンは芝目が強く、読みにくい']},
 },
 {date:'2026-10-20',course:'東条湖カントリー倶楽部',time:'OUT 7:08',tee:'レギュラー 6,198y・Par72',members:'3名',result:{score:112,putts:0,out:61,in:51,holes:[6,7,5,6,8,7,7,10,5,5,6,7,6,3,6,7,5,6]},plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 5,100円',
  plans:{p90:{"name": "90切り", "target": 87, "limit": 89, "tee": "5W", "summary": "全ホールボギーなら90。<b>パーを4つ（1・9・16・17番）</b>取り、ダブルボギーを10番の1つだけにすると87。予備2打で89以内。前提は「ティーショットは5W中心（1Wは1・2・8・10・11・12・15・18番＋4・7番は当日の様子次第）・OB0・3パット0」。", "holes": {"1": [4, "パーを取るホール。ドライバー（トータル236y）→残り約70y。58°（キャリー74y）でグリーン真ん中、2パットでパー。朝の練習で当たらなければ5W→残り約110yをPWで。"], "2": [6, "横切る池まで約265y（実際に回った人の動画：バックティーから約280y）で、新ドライバーのフルスイング（トータル251y・最大269y・10/10は15球中3球が265y超え）だと届くことがあるので、ドライバーはハーフスイング（トータル218y）。1W→4H（キャリー161y）で池越え（公式：2打目は池越え）→残り約70yを58°で3オン。2パットのボギーでOK、寄ればパーチャンス。奥は危険（公式）。"], "3": [5, "池越えの左ドッグレッグ（公式）。5Wで池を越えて右寄りの真ん中→残り約130y。8I（キャリー119y）で手前から。ボギーでOK、乗ればパーチャンス。"], "4": [5, "基本は5W（狭そうならドライバーは持たない）：5W→残り約220y→6I→残り約60yを58°で3オン、ボギー。ドライバーでも打数は同じ。広く見えて1・2番のドライバーが良ければ1W→9I→58°。グリーン手前が狭い（公式）。"], "5": [5, "右はOB（公式）。一番曲がらない4Hでフェアウェイの左寄りへ→残り約170y→5Iで手前から。5Wが当たっていれば5W→残り約145y→6Iでも可。ボギー確保、乗ればパー。"], "6": [4, "右に池。4Hで左を向いて打つ。170y前後までなら届く、180y以上なら左手前に止まるので寄せて2パットのボギー。右に外すと池なので、グリーンの左半分を狙う。"], "7": [5, "狭いホール（OB率38%・GDO）。基本は刻む：4H→残り約255y→5W→残り約55yを58°で3オン、ボギー。5Wが当たっていて広く見えたら5W→7I→残り約85yを52°。1・2番のドライバーが2回ともOB・大きなミスなしなら1W（左はセーフ・公式）→残り約195y→7I→残り約45yの3オン。"], "8": [6, "ドライバーを使うホール：2打目地点（約200y〜）から右はOB（公式）なので、フェアウェイ左側を向く（左は情報なし）。1W→残り約235y→5Wで左側→残り約35y。ボギー、乗ればパーチャンス。朝からドライバーが当たっていなければ5W→7I→残り約140y。"], "9": [3, "パーを取るホール。7I（キャリー140y・ブレ±3y）で真ん中。2パットでパー。"], "10": [6, "ドライバーを使うホール：OB率10%で一番低い（GDO）。1Wでクロスバンカーの右（公式）→残り約130yを8Iで右寄りへ（グリーン左は深い谷・公式）。ダブルボギーまでOKなのはここだけ。"], "11": [5, "ドライバーを使うホール：左のクロスバンカー（公式・図の目安で約250y）にちょうど届くので、フェアウェイ中央〜やや右を向く。1W→残り約120y。2打目は打ち下ろし（公式）なので9IかPWで手前から。奥は禁物（公式）。ボギー、乗ればパーチャンス。"], "12": [6, "ドライバーを使うホール：2打目地点の左の池（約160〜180y・公式イラスト）に5Wがちょうど届くので、キャリーで越える1W。中央へ→残り約250y→5W（2打目はフェアウェイ左が有利・公式）→残り約50y。4オンでもボギー。朝からドライバーが当たっていなければ5Wで右側を向く。"], "13": [5, "右はOB（公式）。一番曲がらない4Hで中央より左（公式）へ→残り約175y→5Iで手前から。5Wが当たっていれば5W→残り約150yでも可。ボギー、乗ればパー。"], "14": [4, "打ち上げでピンが見えない。5Iで右側へ（公式：右側が安全）。ボギーでOK。"], "15": [6, "ドライバーを使うホール：左右に落とし穴（公式）なので左寄りを向いてフェアウェイ中央（公式）へ。1W→残り約245y→5W→残り約45y。3打目は前下がりでグリーンも速いので手前から（公式）。ボギー。朝からドライバーが当たっていなければ5W→7I→残り約135y。"], "16": [4, "パーを取るホール。5Wでフェアウェイ右側（公式の狙い目）→残り約110y。9I（キャリー117y）でグリーン右寄りへ（左はトラブル・公式）。"], "17": [3, "パーを取るホール。6I（キャリー148y）で真ん中。2段グリーン（公式）なので1パット目は手前から丁寧に。"], "18": [5, "ドライバーで締めるホール：打ち下ろし・OB率13%（GDO）。正面の楠の木（公式）を狙う。1W→残り約180y→7Iで刻み、左側から3オン。グリーン右は要注意（公式）。"]}, "rules": [["ドライバーは1・2・8・10・11・12・15・18番の8回＋4・7番は様子次第", "10/10のトラックマン（新ドライバー Qi35・15球）で1Wはキャリー217y・トータル251y（当たった球）、大きなミス2球。5Wより約35y前に行く。選んだのは、OB率19%の短いミドルの1番（残り約70y）、池まで約265yでドライバーをハーフスイングで打つ2番（2打目の池越えが短くなる）、OB率が低い10番（10%）と18番（13%・GDO）。7番は狭くOB率38%（GDO）なので基本は4Hで刻み（5Wも可）、1・2番のドライバーが2回ともOB・大きなミスなしなら1W。8番は1W：2打目地点（約200y〜）から右OB（公式）なので、フェアウェイ左側を向く。右OBの5・13番は一番曲がらない4H（5Wも可）、OB率が高い3番は5W。15番は左右に落とし穴（公式）でOB率45%（GDO）だが、ティー前の池（越え約115y）はキャリーで越えて、1Wなら3打目が約45yになるので1W。12番は2打目地点の左の池（約160〜180y・公式イラスト）に5Wがちょうど届くので、キャリーで越える1W。ドライバーで2回ミスしたら残りは5W。"], ["パーは1・9・16・17番で取る", "短いミドル2つ（1番は1W→58°、16番は5W→9I）と、易しいショート2つ（9番7I・17番6I）。ここだけはピンを見てよい。"], ["3パットを0に", "90切りの一番の近道。1パット目は「カップの周り1mに止める」距離感で打つ。"], ["100y以内は3打で上がる", "寄せ1打＋2パット。迷ったら転がす。"], ["ドライバーを増やすのは7番だけ", "ドライバーを増やすのは<b>7番だけ</b>（1・2番のドライバーが2回ともOB・大きなミスなしの時）。<b>3番（OB率50%）、5・13番（右OB）、16番（パーを取る短いミドル・5Wで十分）は、調子が良くてもドライバーを使わない</b>（今は全番手が右に打ち出すので、右OBのホールが一番危険）。"], ["ダブルボギーは10番だけ", "OBと池さえなければ届く。池が絡む3・6番は無理に狙わない選択も正解。"]], "checks": ["9番を終えて<b>43以内</b>なら予定どおり。", "<b>44〜45</b>なら、INは16・17番のパーだけ狙い、残りは確実にボギー（IN44で89）。", "<b>46以上</b>なら、その場で100切りプランに切り替えて守る。"], "teeBy": {"1": "1W", "2": "1W", "4": "5W（広く見えたら1W）", "5": "4H（5Wも可）", "7": "4H（5Wも可・調子が良ければ1W）", "13": "4H（5Wも可）", "8": "1W", "12": "1W", "15": "1W", "10": "1W", "11": "1W", "18": "1W"}}},
  target:95,limit:99,link:'https://claude.ai/artifact/Cq7XPSVNLmbx1azX5LmUY4',mapKey:'tojo',
  diff:{stars:3,cr:69.2,par:72,yards:6198,bunkers:65,water:9,green:'ベントグリーン（秋は8.5フィート前後）',terrain:'丘陵（ブラインドは2・14・16番）',why:['コースレートはやさしめ（GORA 69.2・GDO 69.1）','池が絡むホールが9つ（天然の池を生かしたコース）','フェアウェイが狭いという口コミが多い']},
  summary:'全ホールをボギーで回ると90。難しい4ホールはダブルボギーでよしとして、目標は95。予備が4打あるので、大叩きが1〜2回あっても100を切れる計算です。',
  info:['コースレート 69.2（楽天GORA・レギュラー）。GDOでは69.1。ベントのワングリーン（秋は速さ8.5フィート前後）','バンカー65個・池が絡むホール9つ（GDO）。ブラインドは2番（2打目で木がじゃま）・14番（ピンが見えない）・16番（公式）','カートは5人乗り・自走式で、フェアウェイには入れない（GDO）'],
  rules:[
   ['OBを0にする','ドライバーは1・2・8・10・11・12・15・18番の8回＋4・7番は様子次第（12番は池をキャリーで越えるため・1番は残り約70yになる短いミドル・2番は池まで約265yで届かない・OB率が低いホール）。7番は狭いので基本は4Hで刻み（5Wも可）、1・2番のドライバーが2回ともOB・大きなミスなしなら1W。8番は1Wで、右OB（約200y〜・公式）があるのでフェアウェイ左側を向く。12番は2打目地点の左の池（約160〜180y・公式イラスト）に5Wが届くので、キャリーで越える1W。15番は左右に落とし穴（公式）でOB率45%（GDO）だが、ティー前の池（越え約115y）はキャリーで越えて、1Wなら3打目が約45yになるので1W。それ以外は5W。5Wは右に打ち出しやすい（10/6の打ち出し平均6°右）。足元にクラブを置いて、目標と平行に構える。ドライバーで2回ミスしたら、残りは5Wに切り替える。'],
   ['ドライバーを増やすのは7番だけ','ドライバーを増やすのは<b>7番だけ</b>（1・2番のドライバーが2回ともOB・大きなミスなしの時）。<b>3番（OB率50%）、5・13番（右OB）、16番（パーを取る短いミドル・5Wで十分）は、調子が良くてもドライバーを使わない</b>（今は全番手が右に打ち出すので、右OBのホールが一番危険）。'],
   ['短いミドルは5番ウッドか4H','フェアウェイが狭いという口コミが多い。距離より、次を打ちやすい場所が大事。'],
   ['グリーンは真ん中を狙う','ピンは見ない。バンカーが深いので、ピンがバンカーの近くなら反対側へ。'],
   ['林やラフからは1打で出す','フェアウェイに横へ出すのが正解。無理に狙うのが大叩きの原因。'],
   ['パットは1m以内に寄せる','デコボコと傾斜があるグリーン。3パットを減らすことを優先。'],
  ],
  order:['out','in'],
  holes:[
   [1,4,307,13,5,'ドライバー','ドライバーを使うホール：OB率19%（GDO）・左右にOBの記載なし。1W（トータル236y）→残り約70yを58°で。朝一番なので4分の3のトップで振る。ティー前に池（公式イラスト）があるが、普通に当たれば越える。朝の練習で当たらなければ5W。グリーンはやや高いので、2打目は大きめで真ん中へ。','easy'],
   [2,5,485,1,7,'ドライバー','ドライバーを使うホール：横切る池まで約265y（実際に回った人の動画：バックティーから約280y）なので、新ドライバーのフルスイング（平均トータル251y・一番飛んだ球269y、10/10は15球中3球が265y超え・10/9）だと、当たりが良いと池に届く。なので<b>ドライバーはハーフスイング</b>（10/9：キャリー192y・トータル218y、方向も安定）で打つ。1打目はやや打ち上げ（公式）。1打目はやや打ち上げで右寄りが狙い目（公式）。2打目は池越え（公式）なので、池の奥までしっかり越える4H（キャリー161y）。1W→4H（キャリー161y）で池越え→残り約70yを58°で3オン。5Wで打つと2打目の池越えが長くなる。グリーン奥は危険（公式）。一番難しいホール（平均7点台）なので7でOK。','hard'],
   [3,4,330,11,5,'5W / 4H','ティー前方に池（65〜125y）。4Hで池を越えて右寄りの真ん中へ。左ドッグレッグだが角は狙わない。グリーン奥は危険なので手前から。','mid'],
   [4,4,418,3,6,'5W（広く見えたら1W）','基本は5W：ティーから見て狭そうなら無理にドライバーを持たない。5W（トータル199y）→残り約220y→6I（トータル161y）→残り約60yを58°で3オン。ドライバーでも2打で乗せないので、打数は同じ（1W→残り約170y→9I→残り約50y）。公式にOBの記載はないが、GDOのOB率は39%と低くない。広く見えて1・2番のドライバーが良ければ1W。グリーン手前が狭い（公式）。','hard'],
   [5,4,345,9,5,'4H（5Wも可）','真っすぐのミドル。右はOB（公式）。一番曲がらない4H（10/16：キャリー159y・ブレ±3y）でフェアウェイの左寄りへ→残り約170y→5Iで手前から。当日5Wが当たっていれば5W→残り約145y→6Iでも可。左に行きすぎると2打目でグリーンを狙えない（公式）。','mid'],
   [6,3,189,15,4,'4H','右側に池があるショート（池はティー前方からグリーン横まで右側に続く・図の目安）。4H（キャリー161y・トータル176y）で打つ。レギュラーティーの公式距離は189yだが、当日のティー位置とピン位置で160y台になることもある。170y前後までなら4Hでグリーンに届く。180y以上ならグリーン左手前に止まるので、寄せて2パットのボギーでOK。4Hの左右のずれは10/16の練習で左右10y以内に収まってきたが、右に外すと池なので、グリーンの左半分を狙う。グリーンはやや右に傾いているので、左側から攻める（公式）。右に外すのが一番のミス。','easy'],
   [7,4,430,5,6,'4H（5Wも可・調子が良ければ1W）','狭いホール（OB率38%・GDO）。基本は刻む：一番曲がらない4H（トータル177y）→残り約255y→5W→残り約55yを58°で3オン。当日5Wが当たっていて広く見えたら、5W→7I→残り約85yを52°で3オンでも可。1・2番のドライバーが2回ともOB・大きなミスなしなら1W：左に曲げてもセーフ（公式）。1W→残り約195y→7I→残り約45yの3オン。','hard'],
   [8,5,487,7,6,'ドライバー','ドライバーを使うホール：OB率42%（GDO・同じレベル）。2打目地点（約200y〜）から右はOB（公式）で、ドライバーはその場所まで届き、今は右に約30yずれるので、フェアウェイ左側を向いて構える（左は情報なし）。公式の「1打目は右側」は短いクラブで打つ場合の狙い。1W→残り約235y→5W（2打目は左側・公式）→残り約35yの3打目。朝からドライバーが当たっていなければ5Wで右側→7I→残り約140y。','hard'],
   [9,3,137,17,4,'7I','池越えの短いショート。9I（キャリー117y）では届かないので、ブレの小さい7I（キャリー140y・ブレ±3y）で真ん中へ。','easy'],
   [10,4,360,4,6,'ドライバー','ドライバーを使うホール：GDOのOB率10%で18ホール中いちばん低い。1Wでクロスバンカーの右（公式）へ→残り約130yを8Iで。グリーン左は深い谷（公式）なので右寄りに。ボギーなら上出来。','hard'],
   [11,4,370,12,5,'ドライバー','ドライバーを使うホール：OB率22%（GDO）・左右にOBの記載なし。左のクロスバンカー（公式）は図の目安で約250yで、ドライバーのトータル（約251y）がちょうど届く距離なので、フェアウェイ中央〜やや右を向く（右に出やすい今の球すじならバンカーから遠ざかる）。1W→残り約120y。2打目は打ち下ろし（公式）なので9IかPWで手前から。グリーン奥は禁物（公式）、右手前に池（公式イラスト）。','mid'],
   [12,5,487,2,7,'ドライバー','ドライバーを使うホール：2打目地点の左の池（約160〜180y・公式イラスト）に5W（キャリー177y・トータル199y）がちょうど届くので、キャリー217yで越える1W。中央へ（公式は「第1打中央」）。池は左なので、右に出やすい今の球すじなら池から遠ざかる。1W→残り約250y→5W→残り約50yの3打目。2打目はフェアウェイ左側（公式）。OBの位置は情報なし。朝からドライバーが当たっていなければ、5Wでフェアウェイ右側を向いて池を避ける。','hard'],
   [13,4,350,10,5,'4H（5Wも可）','ティー前方の左に大きな池。フェアウェイは右に傾いていて、右はOB（公式）。一番曲がらない4Hで中央より左（公式）へ→残り約175y→5Iで手前から。当日5Wが当たっていれば5W→残り約150yでも可。','mid'],
   [14,3,151,14,4,'5I','打ち上げでピンが見えない。右側が安全（公式）。打ち上げなので1番手大きく、5I（キャリー152y）で真ん中〜右へ。','easy'],
   [15,5,480,8,6,'ドライバー','ドライバーを使うホール：1打目はフェアウェイ中央（公式）。左右に落とし穴あり（公式・中身の記載なし）、OB率45%（GDO・同じレベル）なので、右に出やすい分フェアウェイ左寄りを向いて構える。1W→残り約245y→5W→残り約45yの3打目。3打目は前下がりでグリーンも速いので、手前から（公式）。朝からドライバーが当たっていなければ5W→7I→残り約135y。','easy'],
   [16,4,311,16,5,'5W / 4H','やや打ち上げのブラインド。ドライバーは我慢してフェアウェイ右側に置く。2打目はグリーン左に外さない。','mid'],
   [17,3,147,18,4,'6I','一番易しいホール。6I（キャリー148y）で真ん中に乗せる。2段グリーンなので1パット目を丁寧に。','easy'],
   [18,4,414,6,5,'ドライバー','ドライバーで締めるホール：打ち下ろしでOB率13%（GDO）。正面の楠の木を狙う（公式）。1W→残り約185y→7Iで刻み、2打目は左側から（公式）。グリーン右は要注意（公式）。','mid'],
  ],
  checks:['9番を終えて<b>50以内</b>なら予定どおり。INも同じ回り方でOK。','<b>51〜54</b>なら、INの短いミドル（11・13・16番）は全部5番ウッドか4Hにして、ボギーを確実に取る。','<b>55以上</b>でも、INで44なら99。ロング（12・15番）で無理をせず、3打目までにグリーン近くに運ぶ。'],
  prep:['スタート前：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回。','練習場（10/19まで）：5Wのティーショットを毎回20球。右寄りに構えて、左に戻る球で真ん中に落とす（今の5Wは平均13y左）。','シャンク対策：ハーフスイングで、かかと寄りに体重を乗せたまま10球。本番で出たら次の1打はハーフスイング。','アプローチ：50y・30y・10yを、クラブ1本（PWか52°）で打ち分ける。'],
  note:'ホールの形と狙いは、ショットナビのホール解説をもとにしています。マップは図なので、当日はカートのナビでも確認してください。',
 },
 {date:'2026-12-15',course:'有馬カンツリー倶楽部',time:'8:42',tee:'レギュラー（Green）6,442y・Par72',members:'2〜4名',
  plan:'firstee.jp：セルフ・スループレー・GPSナビ付きカート　8,000円（前払い・カード可・昼食別）。休場日プランのためクラブハウス・ロッカー・風呂・レストランは使えない→着替えて来場。折り返しで待ち時間あり。',
  target:95,limit:99,link:'',mapKey:'arima',note:'ハンデはGDO／楽天GORAでINの7ホールが違うので「GDO/GORA」で両方載せています。ヤード・パーはGDO・楽天GORAで一致（レギュラー＝Greenティー 6,442y）。',sources:[['YouTube ゴリゴルチャンネル（2021・全18H解説）','https://www.youtube.com/watch?v=ZKDZsCEVdtQ'],['YouTube サンテレビ 必死のパッチ 前篇（2024）','https://www.youtube.com/watch?v=kSmqorFrT94'],['YouTube サンテレビ 必死のパッチ 後篇（2024）','https://www.youtube.com/watch?v=n3ccfA8TxSM'],['GDO コース情報','https://reserve.golfdigest.co.jp/golf-course/640112/course-info/'],['じゃらんゴルフ','https://golf-jalan.net/gc01933/detail/'],['楽天GORA','https://booking.gora.golf.rakuten.co.jp/guide/course_info/disp/c_id/280016']],
  diff:{stars:3,cr:71.1,par:72,yards:6442,bunkers:60,water:6,green:'ベント（9〜11月の晴天時9.0フィート）',terrain:'丘陵・適度なアップダウン',why:['コースレート71.1（レギュラー）・Par72','バンカー60・池が絡むホール6（GDO）','ほぼ全ホールでOB（左右OBが11ホール）・上りのホールが多い（ゴリゴル動画）']},
  rules:[
   ['OBを0にする','左右OBのホールが多い（ゴリゴル動画）。ドライバーは<b>1・2・9・10・12・13・16・18番</b>、OBの反対側か広い側を向く。突き抜けOBが届く7・8番、バンカーを越えられない3・11番、短い5・15番は5W。11番はカートナビでバンカーまでの距離を見て決める。'],
   ['上りは長く・打ち下ろしは短く','8番の2打目＋10y・9番の2打目＋15y・17番＋5y、14番は−15y（ゴリゴル動画のプロの判断）。'],
   ['動画の注意','ゴリゴル動画（2021）はOUTのホール順が今のスコアカードと違う（動画の2番＝今の7番など）。アプリでは今の番号に並べ替え済み。白ティーなので距離は当日のティーで確認。'],
   ['バンカーに入れない（堅実に）','有馬はバンカー60個（GDO）。3・11番は真ん中のバンカー（越え220y）の手前に5Wで置く。12・18番は越えるのに240yのバンカーの反対側を向く。グリーン周りのバンカーが多いので、ピンではなくグリーンの真ん中へ。バンカーに入ったら、まず1回で出す。'],
   ['ティーショットは力感7〜8割・3点チェック','①始動はボールから真っすぐ後ろ ②手首はゆるく ③右足の内側で踏んでかかとを浮かせない。'],
   ['アイアンはコントロールショットで番手表どおり','58°〜90y・52°90〜110y・PW110〜120y・9I120〜130y・8I130〜140y・7I140〜150y・6I150〜160y・4H160〜180y。'],
   ['12月の寒さ対策','8:42スタートで寒い。クラブハウスが使えないので、車の中で着替え・ストレッチ（ジーニー①）を済ませておく。重ね着・カイロ。'],
  ],
  holes:[
   [1,4,383,11,5,'ドライバー','ドライバーを使うホール：右OB・左セーフ（ゴリゴル動画）。左サイドを向いて構える→残り約133y→8I（コントロールショット）。グリーンは右手前と左奥にバンカーなので真ん中へ。','mid'],
   [2,4,446,3,6,'ドライバー','ドライバーを使うホール：左ドッグレッグ。左右OBだが広め（ゴリゴル動画）。真ん中へ→残り約196y→2打目は無理に乗せず4Hで約170y→残り約25y→58°で3オン。グリーンは右手前・左手前にバンカー。','hard'],
   [3,5,460,17,6,'5W','5Wのホール：左右OB・ずっと上り。真ん中のバンカーは越えるのに220y（ゴリゴル動画）。5Wでバンカー手前へ（約200y）→4Hで約170y→残り約90y→52°（上りなので1番手大きめ）で3オン。','mid'],
   [4,3,165,7,4,'4H','165yのショート。4H（コントロールショット）でグリーンの真ん中へ。右手前・左手前と右に大きなバンカー（ゴリゴル動画）。','easy'],
   [5,4,325,15,5,'5W','5Wのホール：ブラインドの打ち下ろし。右OB、左は一部セーフ（ゴリゴル動画）。5Wで左寄りへ→残り約100y→52°。グリーン左横に池・右にバンカーなので真ん中へ。','mid'],
   [6,3,158,5,5,'6I','158yのショート。目の前は谷。左手前に大きなバンカー、右に外すと難しい（ゴリゴル動画）。6I（コントロールショット）でグリーンの少し左（バンカーの右）へ。短いのが一番のミス。乗らなくても無理に寄せず、ダブルボギーまでOK（HC5の難しいショート）。','mid'],
   [7,4,369,9,5,'5W','5Wのホール：右ドッグレッグ。右OB、左はセーフだが突き抜けるとOB（聞き取りで約260y・ゴリゴル動画）。ドライバーのトータル261y（11/16）は届くので5Wで正面の鉄塔の少し左へ→残り約147y→7I。2打目は前の木がじゃまになることがある。','mid'],
   [8,5,479,13,6,'5W','5Wのホール：S字のロング。左右OB、左に突き抜けるOBが約240y（ゴリゴル動画）。5W（222y）で右寄りへ→4Hで約170y→残り約87y・上りで約10y長い→52°で3オン。グリーン奥にバンカー。','mid'],
   [9,4,400,1,6,'ドライバー','ドライバーを使うホール：一番難しいホール（HC1）。左セーフ・右OB。正面のバンカーは160yで越える（ゴリゴル動画）。バンカーの少し右〜真ん中を向き、曲がるなら左→残り約150y・きつい上りで約15y長い（グリーンは見えない）→約165y→4H。グリーン手前に大きなバンカー。ライが悪ければ9Iで手前に刻んで寄せワンのボギー狙い。','hard'],
   [10,4,370,'6/8',5,'ドライバー','ドライバーを使うホール：左右OBだが右は浅い、左は山までセーフ（ゴリゴル動画）。右が狭く見える・安全は左（サンテレビ）。左を向く→残り約120y→9I。グリーンは砲台で止まりにくい（サンテレビ）ので手前から。','mid'],
   [11,5,481,'16/12',6,'5W','5Wのホール（条件つき）：まっすぐのロング。左右OB、真ん中のバンカー2つは越えるのに220y（ゴリゴル動画）。5W軽め（約200y）でバンカー手前→4Hで約170y→残り約110y・グリーンへは上り→PW〜9Iで3オン。バンカーまでの距離はカートナビで確認。2打目地点からはグリーン周りのバンカーが見えにくい（サンテレビ）。','easy'],
   [12,4,413,'8/6',5,'ドライバー','ドライバーを使うホール：軽い打ち下ろし。左右OB。右のバンカーは越えるのに240y、飛ばない人は左（ゴリゴル動画）。キャリー227y（11/16）では越えないので左サイドへ→残り約163y→4H。バンカー越えは欲張らず左でOK（サンテレビのプロ野球OBも同じ判断）。','mid'],
   [13,4,425,2,6,'ドライバー','ドライバーを使うホール（HC2）：左ドッグレッグ。左右OBだが広め、鉄塔方向を狙う（ゴリゴル動画）。左に傾斜があり落とし所が大事、右は少し行くとすぐOB（サンテレビ）→残り約175y→4H。グリーンは右手前（見えない）・左手前にバンカー。無理ならボギーでOK。','hard'],
   [14,3,158,'12/18',4,'7I','158yのショート。大きな打ち下ろしで約15y短い（ゴリゴル動画）→約143y→7I（コントロールショット）。右に池、周りにバンカーなので真ん中〜左寄りへ。','easy'],
   [15,4,300,'18/14',5,'5W','5Wのホール：300yと短い。左右OBだがかなり広い（ゴリゴル動画）。5Wで真ん中→残り約78y→58°。グリーン右手前・左手前に大きなバンカーなので、ピンより奥目でOK。左に曲げると林の中（サンテレビ）なので、5Wで真ん中から右寄り。','easy'],
   [16,4,425,4,6,'ドライバー','ドライバーを使うホール（HC4）：右がいい・左はOB（ゴリゴル動画）、フェアウェイが広く思い切り打てる（サンテレビ）。右寄りへ→残り約175y→4H。グリーンは左手前と右にバンカー。','hard'],
   [17,3,170,'10/16',4,'4H','170yのショート。約5y長く見る（ゴリゴル動画）→約175y→4H。左手前に大きなバンカー、グリーン右側が安全なので右寄りへ。','easy'],
   [18,5,515,'14/10',6,'ドライバー','ドライバーを使うホール：左ドッグレッグ。左のバンカーは越えるのに240y、飛ばない人は右（ゴリゴル動画）。右寄りへ→4Hで約170y→残り約95y→52°で3オン。グリーンは右手前・左手前にバンカー。左の木越えのショートカットは300y級の人の打ち方（サンテレビ）なのでやらない。2打目で無理にグリーンを狙うと手前のバンカーに入りやすい。','mid'],
  ]},
 {date:'2026-11-29',course:'宝塚クラシックゴルフ倶楽部',time:'IN 7:32',tee:'レギュラー 6,141y・Par71',members:'3名',
  plan:'セルフ・4人乗りカート付き（昼食は別料金）　1人 16,810円',
  target:95,limit:99,link:'',mapKey:'taka',sources:[['公式 コースガイド（スコアカード）','https://www.takarazuka-cgc.com/course.html'],['GDO コース情報','https://reserve.golfdigest.co.jp/golf-course/642302/course-info/'],['楽天GORA コース情報','https://booking.gora.golf.rakuten.co.jp/guide/course_info/disp/c_id/280079'],['じゃらんゴルフ（ホール解説）','https://golf-jalan.net/gc01901/detail/'],['ショットナビ（ホール図・解説）','https://shotnavi.jp/gcguide/cdata/cdata_1961_560.htm']],
  diff:{stars:3,cr:69.2,par:71,yards:6141,bunkers:47,water:4,green:'ベントグリーン（秋は9フィート前後・11月は硬め）',terrain:'丘陵（INの坂がきつい）',why:['コースレートは中くらい（GDO 69.2・GORA 69.5）','INの打ち上げ・打ち下ろし・谷越え','小さめのグリーンと深いバンカー']},
  summary:'Par71なので、全部ボギーで89。難しいホールはダブルボギーでよしとして、目標は95（IN 46・OUT 49）。予備が4打あります。<b>スタートはIN（10番）から</b>です。',
  info:['ベントのワングリーン（小さめで、深いバンカー）。秋の速さは9フィート前後で、東条湖より少し速い','アップダウンが大きく、特にINは打ち上げ・打ち下ろしと谷越えが多い','池・谷が絡むのは4・14・15・17番。13番は左右OBで見えないホール','カートはフェアウェイに入れない。2打目には4H・7I・8I・PW／AWとパターを持って歩く'],
  rules:[
   ['ティーショットは力感7〜8割・3点チェック','11/6の練習の気づき：力を抜いた方がヘッドが走って曲がらない。毎ホール、構える前に①始動はボールから真っすぐ後ろ ②手首はゆるく ③右足の内側で踏んでかかとを浮かせない、を1回素振りで確認。飛ばそうとして力むのが一番のOBの元。'],
   ['アイアンはコントロールショットで番手表どおり','番手表（11/23のトラックマンの当たりの良い球で更新。7Iは良かった160yぐらいの球：58°〜85y・52°85〜100y・PW100〜120y・9I120〜135y・8I135〜150y・7I150〜165y・6I165〜180y・4H180y〜。5Wは調子が悪いので使わない）は、フルではなくハーフショットの気持ちでコントロールして打つ距離。届かせようと強く振らず、いつもの力感で番手を上げる。11/23はアイアンの当たりが良かった（洋平さん）ので、番手表を信じて打つ。'],
   ['OBを0にする','10/20の東条湖はティーショットのOBが1回だけ・スライスも減った。なのでOBが片側だけのホールはドライバーで、OBと反対側のフェアウェイ半分を狙う：<b>1・2・5・9・10・11・12・15・18番</b>。<b>ドライバーを使わないホールは、5Wの調子が悪いので4H（11/23の当たりの良い球でトータル約193y）</b>：<b>3番</b>は前のホールのドライバーが良ければ1W（基本は4H）。左右OBの13番と、右OBの8番は4H（8番は左を向く）。突き抜けOBの16番も4H。7番も4H。ただし11/23のドライバーは引っ掛け（左）が多く、スライスは1球もなかった（洋平さん）。なので<b>左を向きすぎない（左のラフは向かない）</b>。左がOBの12番はフェアウェイの右端を向く。ドライバーで2回ミスしたら残りは4Hに切り替える。'],
   ['打ち上げは1番手大きく、打ち下ろしは1番手小さく','INは坂がきつい。表示の距離のまま打つと、打ち上げで短く、打ち下ろしで大きくなる。'],
   ['池越え・谷越えは「届く番手」で奥を狙う','4番は9I（11/23の番手表どおり）、14番は7I・17番は6I（どちらも番手表より1番手大きめ）。15番の2打目も池越え。短いのが一番のミス。グリーンの奥の真ん中でOK。'],
   ['バンカーに入れない（堅実に）','宝塚はバンカーが深い。ピンではなくグリーンの真ん中を狙い、バンカー越えのピンは無理に攻めない。14・17番はグリーン手前のバンカーが深いので1番手大きめで奥の真ん中。11番はフェアウェイ中央のバンカー（約220〜235y）の左を向く。2番は松の木の両側のバンカーを避けて松の木狙い。バンカーに入ったら、まず1回で出すことだけ考える。'],
   ['グリーンは手前から','11月はグリーンが硬くなり、上から落とすと止まらない。花道から転がして乗せる。'],
   ['寒さ対策で最初の2ホールを守る','7:32スタートの11月末は5℃前後。重ね着・カイロ。1ホール目の10番からドライバー。スタート前に素振りとジーニー①で体を温めておく。'],
  ],
  order:['in','out'],
  holes:[
   [10,4,330,'11/16',5,'ドライバー','ドライバーを使うホール（1ホール目）：右ドッグレッグで右はすぐOB（グリーン右も・ショットナビ）。ドライバーでフェアウェイの真ん中を狙う（11/23は引っ掛けが多く、スライスは1球もなかったので、左のラフは向かない）。11/23の当たりの良い球はトータル約243y→ピンまで約95y（図の目安）→52°（85〜100y）。右の角を近道しようとしない。1ホール目なので、スタート前に素振りとジーニー①で体をしっかり温める。2打目はつま先下がりで右に行きやすいので、グリーンの左半分へ。','mid'],
   [11,4,352,'7/6',5,'ドライバー','ドライバーを使うホール：少し右に曲がった打ち上げ。右はOB、グリーンオーバーもOB（ショットナビ）。フェアウェイ中央、ティーから約220〜235y（図からの目安）にバンカーがあり、11/23の当たりの良い球はキャリー約198y・トータル約243yなので、バンカーに転がり込みやすい。なのでバンカーの左のふちを向いて構える（右のOBからも離れる）。11/23は引っ掛けが多かったので、それより左は向かない→残り約110y（図の目安）→PW（100〜120y）だが打ち上げなので1番手大きく9I。2打目はグリーンが見えないので、奥より少し手前を狙う。','mid'],
   [12,4,398,'1/2',6,'ドライバー','ドライバーを使うホール：一番難しいホール。打ち下ろしで左は狭く崖でOB（ショットナビ・GDOの記事）、右は打っても傾斜で戻る（ショットナビ）。右なら助かるので、ドライバーで右半分に打つ。11/23は引っ掛け（左）が多く、スライスは1球もなかったので、構えはフェアウェイの右端を向く。左は絶対に向かない。1W→残り約155y。朝の練習や10・11番で引っ掛けが出ていたら、4H（約193y）で右端へ→残り約205y→もう一度4Hでグリーン手前へ（3オンでボギーなら上出来）。2打目は打ち上げなので、7I（150〜165y）より1番手大きく6I（165〜180y）。乗らなくても手前でOK、ボギーなら上出来。','hard'],
   [13,5,530,'3/14',7,'4H','左右OBの見えないホール（OB率58%・GDO）。信号で前の組を確認。ドライバーは使わず、4Hでフェアウェイに置く（11/23の当たりの良い球でトータル約193y）→2打目も4H→残り約144y、3打目は8I（135〜150y）で手前から。','hard'],
   [14,3,148,'13/12',4,'7I','谷越えのショート。11/23の番手表では148yは8I（135〜150y）。谷越えなので1番手大きく、7I（11/23の良かった球でキャリー約142y・トータル約158y）で奥の真ん中へ。谷（ティーから約45〜105y・図の目安）と手前の深いバンカー（約118y）はキャリーで越える。','easy'],
   [15,4,330,'17/8',5,'ドライバー','ドライバーを使うホール：330yと短い。ドライバー（11/23の当たりの良い球でトータル約243y）→残り約87y→52°（85〜100y）。グリーン手前に池（じゃらん・ショットナビ）があるが、ティーから約290y（ショットナビの図からの目安）で、平均のドライバーでは届かない。ただし最高は276y（11/5）なので、会心の当たりで転がると近づく。力感7〜8割で打つ。11/23は引っ掛けが多かったので、構えはフェアウェイの真ん中（左は向かない）。2打目は池越えなので、ピンが手前でもグリーンの真ん中へ。奥はOB（ショットナビ）。','easy'],
   [16,4,353,'5/4',5,'4H','右ドッグレッグ。ドライバーは突き抜けてOBの恐れ。4H（11/23の当たりの良い球でトータル約193y）で刻む。左はすぐOB。2打目は右から、残り約160y→7I（150〜165y）。','mid'],
   [17,3,159,'15/18',4,'6I','谷越えのショート（公式159y・じゃらんは145y）。11/23の番手表では159yは7I（150〜165y）だが、谷越えなので1番手大きく6I（160〜180y・キャリー約155y）で奥の真ん中へ。145yなら8I（135〜150y）より1番手大きい7I（キャリー約142y）。','easy'],
   [18,4,386,'9/10',5,'ドライバー','ドライバーを使うホール：少し右に曲がったミドル。右は松林でOB（ショットナビ・プレー記）、左が狙い目（ショットナビ）。ドライバーでフェアウェイの左半分を狙う（11/23は引っ掛けが多かったので、左のラフは向かない）→残り約144y→8I（135〜150y）だが、やや打ち上げなので7I。グリーン右手前のバンカーは深い（プレー記）ので、グリーンの左半分へ。','mid'],
   [1,5,500,'14/13',7,'ドライバー','ドライバーを使うホール：INスタートなので10ホール目で体は温まっている。打ち下ろし（じゃらん）。OB率55%（GDO）だが、OBの位置はどの出典にも記載なし。ドライバーでフェアウェイ中央→残り約257y。左の池（ティーから約165〜205y・図からの目安）は、11/23の当たりの良い球でもキャリー約198y（190〜211y）で、池の奥側に届かないことがある（低い球が多かった）ので、池から離れたフェアウェイ中央〜右へ。11/23は引っ掛けが多かったので、構えはフェアウェイの右半分。2打目は右のバンカー（約400〜445y）の手前に8Iで刻む（7Iは11/23の良かった球で約158y転がり、バンカーの入り口まで届くので使わない）→残り約112y→PW（100〜120y）。グリーンは右奥から手前に傾いている（GORA）のでピンの左手前へ。7で上出来。','hard'],
   [2,4,382,'6/5',6,'ドライバー','ドライバーを使うホール：右はグリーンまでずっとOB、左の林はセーフ（ショットナビ）。ドライバーでフェアウェイ中央の松の木（じゃらん）を向いて構える（11/23は引っ掛けが多かったので、それより左は向かない）→残り約139y→8I（135〜150y）でグリーン左半分へ。左の林に入ったら、1打で横に出す。','hard'],
   [3,4,375,'2/3',6,'4H（調子が良ければ1W）','難易度1位（GDO）。右のバンカーの先はすぐOB、左の林はセーフだが脱出困難（ショットナビ）。林で崩れないよう、基本は4H（約193y）で中央〜やや左（右のバンカーは図の目安でティーから約195y）→残り約182y→4H（180y〜）で手前から。2番のドライバーが良ければ1Wでフェアウェイ中央→残り約132y→9I（120〜135y）。2段グリーンは距離感重視。','hard'],
   [4,3,127,'18/17',4,'9I','池越えの短いショート。11/23の番手表で127yは9I（120〜135y）。9Iは11/23の当たりの良い球でキャリー約121y・トータル約131y。池はグリーンの手前（図の目安でティーから約40〜100y）なので、9Iでしっかり振れば越える。グリーンの真ん中へ。短く当たりやすいトップだけ注意（右かかとを我慢）。','easy'],
   [5,5,503,'16/15',6,'ドライバー','ドライバーを使うホール：OBの記載なし・OB率23%（GDO）。フェアウェイが左に傾いているので右サイドを狙う（じゃらん）。1W→残り約260y。グリーン手前の両側に池がある（2020年3月の動画のティーからの景色で確認）ので、2打目は無理に狙わず7I（約158y）で刻み→残り約102yをPW（100〜120y）で3オン。','easy'],
   [6,3,169,'12/11',4,'6I','グリーン手前にバンカー。11/23の番手表で169yは6I（165〜180y）。6I（キャリー約155y・トータル約171y）で、手前から転がして乗せる。','easy'],
   [7,4,384,'4/1',6,'4H','左ドッグレッグ。フェアウェイ中央の松の木の右を狙う（じゃらん・プレー記）。グリーン右手前に池（ショットナビ・プレー記）があるので、2打で乗せようとしない：4H（約193y）→残り約191y→2打目は池の手前（ティーから約300y）まで約107yをPW（100〜120y）で刻む→残り約84yを58°（〜85y）で3オン。','hard'],
   [8,4,332,'8/9',5,'4H','短いミドル。右は突き抜けても、跳ねてもOB（ショットナビ）。フェアウェイは左から右に傾いているので、4H（約193y）でフェアウェイの左を向いて構える→残り約139y→8I（135〜150y）。3段グリーン（じゃらん）は左から右への傾斜がきついので左狙い。','mid'],
   [9,4,383,'10/7',5,'ドライバー','ドライバーを使うホール：OBの記載なし・OB率25%（GDO）。右のフェアウェイから攻めるのがベスト（じゃらん）。ドライバーで右寄り→残り約142y→8I（135〜150y）。左は隣のホールでセーフだが脱出に苦労（ショットナビ）。','mid'],
  ],
  checks:['前半（IN）を終えて<b>48以内</b>なら予定どおり。OUTも同じ回り方でOK。','<b>49〜52</b>なら、OUTの1・3・7番（難易度2・1・6位）は3打で乗せる計画を守り、ダブルボギーまでで止める。','<b>53以上</b>でも、OUTで46なら99。1番は4H、5番のロングも無理をせずボギーを取る。'],
  prep:['受付をしたら、スタート室やカートでピン位置表（ピンシート）とグリーンの速さの掲示を探して写真を撮り、Claudeに送る（ヤーデージブックとマップがその日のピン位置・速さで作り直されます。アプリのホールマップの「ピンシート入力」で自分で入れてもOK）','当日の早朝（11/29）：4:15起床 → 4:20〜4:40 軽い筋トレ（可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回＋ジーニー①・汗をかかない程度）→ 4:40〜5:00 朝ごはん → 5:30〜5:55 アコーディア・ガーデン神戸三田でドライバー（52°ハーフ10球→4H 5球→ドライバー20球、最後の5球は10番のつもりでフェアウェイの真ん中を向いて1球ずつ。引っ掛けが何球出たか数えて、5球中2球以上なら12番は4H）→ 6:30 宝塚クラシック着 → 6:45〜7:05 アプローチ・バンカー → 7:05〜7:20 パター → 7:32 10番スタート。','11/23のトラックマンの注意：52°で右への大きなミス（シャンク・トップ）が30球中6球。アプローチ練習は52°のハーフショットで、手でヘッドをほどかない（コーチの課題）ことだけ確認する。ドライバーは打ち出しが低く（5〜11°）、トータル平均約235y。','スタート前：①可動域の3種＋骨盤分離 片足10回＋ヒップツイスト10回。寒いので、いつもより5分長く体を温める。','練習場：5番ウッドのティーショット20球（13番用）。7番アイアンで1番手大きく打つ練習（打ち上げ・谷越え用）。','アプローチ：花道から転がすランニングアプローチ（8Iか9I）を10球。','パット：9フィートの速さに合わせて、3mの距離感を練習グリーンで確認。'],
  note:'ハンデはGDO／楽天GORAで違うので両方載せています。ホールの形と狙いは、ショットナビ・じゃらんゴルフのホール解説をもとにしています。10/20の結果を入れたら、ここを直します。',
 },
];
let ROUND_PLAN={};try{ROUND_PLAN=JSON.parse(localStorage.getItem('roundPlan')||'{}');}catch{}
// 選んでいるプラン（100切り＝標準／90切り）を当てはめる
function applyPlan(x){return liveRound(applyPlan0(x));}
// 最新の飛距離で文章の数字を更新（ホールの距離は選んだティー）
function liveRound(x){if(!x||typeof liveTxt!=='function')return x;const yd=h=>{try{return (typeof TEES!=='undefined'&&TEES[x.mapKey])?TEES[x.mapKey][teeIdx(x.mapKey)][1][h[0]-1]:h[2];}catch{return h[2];}};
  return {...x,summary:liveTxt(x.summary),rules:(x.rules||null)&&x.rules.map(r=>[r[0],liveTxt(r[1])]),holes:(x.holes||null)&&x.holes.map(h=>{const n=[...h];n[6]=liveTxt(h[6],yd(h));return n;})};}
function applyPlan0(x){if(!x)return x;const k=ROUND_PLAN[x.date];const P=k&&x.plans&&x.plans[k];if(!P)return x;
  return {...x,planKey:k,target:P.target,limit:P.limit,summary:P.summary,rules:P.rules,checks:P.checks,teeClub:P.tee,teeBy:P.teeBy||{},
    holes:x.holes.map(h=>{const o=P.holes[h[0]];if(!o)return h;const n=[...h];n[4]=o[0];n[6]=o[1];if(P.tee&&h[1]>3)n[5]=(P.teeBy&&P.teeBy[h[0]])||P.tee;return n;})};}
function setPlan(d,k){ROUND_PLAN[d]=k;try{localStorage.setItem('roundPlan',JSON.stringify(ROUND_PLAN));}catch{}if(typeof HM!=='undefined'&&HM){HM.L=0;HM.tap=null;drawHoleMap();}renderRounds();}
const ROUND_BASE=d=>applyPlan(ROUND_DEFS.find(x=>x.date===d));
const isRoundPlan=r=>(r.exercises||[]).some(e=>e.kind==='roundplan');
const roundPlanId=d=>Number(d.replace(/-/g,''))*100+70;
let ROUND_OPEN=null,ROUND_EDIT=null;

// 決まっている作戦＋アプリで追加・直した分をまとめる
function roundList(recs){
  const m={};
  ROUND_DEFS.forEach(x=>{m[x.date]={...applyPlan(x),builtin:true};});
  recs.filter(isRoundPlan).forEach(r=>{const e=r.exercises.find(x=>x.kind==='roundplan');const d=r.date;
    const b=m[d]||{date:d};const o={...b,recId:r.id};
    ['course','time','tee','members','plan','memo','link'].forEach(k=>{if(e[k])o[k]=e[k];});
    if(parseInt(e.target))o.target=parseInt(e.target);
    if(parseInt(e.stars)||parseFloat(e.cr))o.diff={...(b.diff||{}),...(parseInt(e.stars)?{stars:parseInt(e.stars)}:{}),...(parseFloat(e.cr)?{cr:parseFloat(e.cr)}:{})};
    if(parseInt(e.score))o.result={...(b.result||{}),score:parseInt(e.score),putts:0};
    {const hs=String(e.holes||'').split(/[\s,、・]+/).map(v=>parseInt(v)).filter(v=>v>0);if(hs.length===18){const out=hs.slice(0,9).reduce((a,b)=>a+b,0),inn=hs.slice(9).reduce((a,b)=>a+b,0);o.result={...(o.result||b.result||{}),holes:hs,out,in:inn,score:(o.result&&o.result.score)||out+inn};}}
    m[d]=o;});
  // 結果（今日の記入欄で入れたスコア）
  recs.forEach(r=>(r.exercises||[]).forEach(e=>{if(e.kind==='round'&&num(e.score)>0&&m[r.date])m[r.date].result={...(m[r.date].result||{}),score:num(e.score),putts:num(e.putts)};}));
  return Object.values(m).sort((a,b)=>a.date.localeCompare(b.date));
}
// 予定表（ホームの「次のゴルフ」）にも追加したラウンドを反映
function syncRounds(recs){
  const R=window.PLAN.ROUNDS;
  roundList(recs).forEach(x=>{if(!R.includes(x.date))R.push(x.date);});R.sort();
}

async function renderRounds(){
  const el=$('golf-body');const recs=await getRecs();if(typeof buildClubs==='function')buildClubs(recs);syncRounds(recs);
  const list=roundList(recs);const t=today();
  const done=x=>!!(x.result&&x.result.score);const up=list.filter(x=>x.date>=t&&!done(x)),past=list.filter(x=>x.date<t||done(x)).sort((a,b)=>a.date<b.date?1:-1);
  if(ROUND_OPEN===null&&up.length)ROUND_OPEN=up[0].date;
  el.innerHTML=`
  <div class="flex flex-wrap items-end justify-between gap-2"><div><div class="font-display text-2xl">ラウンド</div><div class="text-[12px] text-muted">予定と作戦。タップで作戦を開きます。</div></div>
   <button class="btn-sm !border-accent !text-accent" onclick="roundEdit('new')">＋ ラウンドを追加</button></div>
  ${roundHistory(list)}
  ${ROUND_EDIT?roundForm(list):''}
  <div class="grid gap-3">${up.length?up.map(x=>roundCard(x,t)).join(''):'<div class="card p-4 text-sm text-muted">予定しているラウンドはありません。「＋ ラウンドを追加」から入れてください。</div>'}</div>
  ${past.length?`<div class="grid gap-3"><h2 class="h2">これまでのラウンド</h2>${past.map(x=>roundCard(x,t)).join('')}</div>`:''}`;
}

function roundCard(x,t){
  const open=ROUND_OPEN===x.date;const left=diffDays(t,x.date);
  const tags=[x.time,x.tee,x.members].filter(Boolean);
  const secs=[['rs-diff','難易度',x.diff],['rs-rules','約束',x.rules],...((x.order||['out','in']).map(k=>['rs-'+k,k.toUpperCase(),x.holes])),['rs-checks','途中の確認',x.checks],['rs-prep','当日の朝',x.prep]].filter(a=>a[2]);
  return `<article id="rc-${x.date}" class="card overflow-clip ${open?'ring-2 ring-accent':''}">
   ${open?`<div class="sticky z-10 grid gap-1.5 border-b border-line bg-surface px-3 py-2 shadow-sm" style="top:calc(env(safe-area-inset-top,0px) + var(--hh,57px))">
     <div class="flex items-center gap-2"><span class="min-w-0 flex-1 truncate text-[13px] font-bold">${md(x.date)} ${esc(x.course||'')}</span><button class="btn-sm !min-h-[36px] !border-accent !text-accent" onclick="roundToggle('${x.date}')">▲ 閉じる</button></div>
     ${secs.length?`<div class="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">${secs.map(([id,l])=>`<button class="shrink-0 rounded-full bg-field px-2.5 py-1 text-[12px] font-bold ring-1 ring-line" onclick="roundJump('${id}-${x.date}')">${l}</button>`).join('')}</div>`:''}
    </div>`:''}
   <button class="grid w-full gap-1.5 p-4 text-left" onclick="roundToggle('${x.date}')" aria-expanded="${open}">
    <div class="flex items-center gap-2"><span class="font-bold">${md(x.date)}</span>${left>=0&&!x.result?`<span class="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">${left===0?'今日':'あと'+left+'日'}</span>`:''}
     ${x.result?`<span class="ml-auto num text-xl font-semibold ${x.result.score<100?'text-accent':''}">${x.result.score}</span>`:x.target?`<span class="ml-auto text-[12px] text-muted">目標 <b class="num text-base text-accent">${x.target}</b></span>`:''}<span class="text-muted ${x.result||x.target?'':'ml-auto'}">${open?'▲':'▼'}</span></div>
    <div class="flex items-center gap-2"><div class="min-w-0 flex-1 text-lg font-bold leading-snug">${esc(x.course||'コース未定')}</div>${x.mapKey&&typeof openHoleMap==='function'&&!x.result?`<span class="flex shrink-0 gap-1.5"><span role="button" tabindex="0" class="rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-white shadow-sm" onclick="event.stopPropagation();openHoleMap('${x.date}',${(x.order||['out','in'])[0]==='in'?10:1})">🗺 マップ</span>${typeof openYardageBook==='function'&&(ILLUS[x.mapKey]||[]).length?`<span role="button" tabindex="0" class="rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-bold text-accent ring-1 ring-accent" onclick="event.stopPropagation();openYardageBook('${x.date}')">📒 ブック</span>`:''}</span>`:''}</div>
    ${tags.length||x.diff?`<div class="flex flex-wrap items-center gap-1">${x.diff&&x.diff.stars?`<span class="chip k-event">難易度 ${stars(x.diff.stars)}</span>`:''}${tags.map(s=>`<span class="chip k-off">${esc(s)}</span>`).join('')}</div>`:''}
    ${x.plan?`<div class="text-[12px] text-muted">${esc(x.plan)}</div>`:''}
    ${x.result?`<div class="text-[12px] text-muted">結果 ${x.result.score}${x.result.putts?`（${x.result.putts}パット）`:''}${x.target?`／目標 ${x.target}`:''}</div>`:''}
    ${open?'':`<span class="mt-1 flex min-h-[44px] items-center justify-center rounded-xl bg-accent text-[14px] font-bold text-surface">${x.holes?'作戦とホールマップを開く ▼':'開く ▼'}</span>`}
   </button>
   ${open?`<div class="grid gap-5 border-t border-line p-4">${roundStrategy(x).replace(/data-sec="([a-z-]+)"/g,(m,k)=>`id="${k}-${x.date}" style="scroll-margin-top:calc(var(--hh,57px) + 96px)"`)}
     <div class="flex flex-wrap gap-2"><button class="btn-sm" onclick="roundEdit('${x.date}')">予定・メモを直す</button>${x.recId&&!x.builtin?`<button class="btn-sm !text-warn" onclick="busy(this,()=>roundDel('${x.date}'))">削除</button>`:''}${x.link?`<a class="btn-sm" href="${esc(x.link)}" target="_blank" rel="noopener">作戦ページを開く ↗</a>`:''}</div></div>`:''}
   ${open?`<div class="border-t border-line p-3"><button class="btn-sub w-full" onclick="roundToggle('${x.date}')">▲ 作戦を閉じる</button></div>`:''}
  </article>`;
}

function roundStrategy(x){
  const planBar=x.plans?`<div class="grid gap-1"><div class="seg !p-1 text-[13px]"><button class="${x.planKey?'':'on'}" onclick="setPlan('${x.date}','')">100切りプラン（目標${ROUND_DEFS.find(r=>r.date===x.date).target}）</button>${Object.entries(x.plans).map(([k,P])=>`<button class="${x.planKey===k?'on':''}" onclick="setPlan('${x.date}','${k}')">${P.name}プラン（目標${P.target}）</button>`).join('')}</div>${x.planKey?'<div class="text-[11px] text-muted">マップ・キャディ欄も、このプランの目標とクラブに切り替わります。</div>':''}</div>`:'';
  const H=x.holes||[];const half=k=>H.filter(h=>k==='out'?h[0]<=9:h[0]>=10);
  const sum=(a,i)=>a.reduce((s,h)=>s+h[i],0);
  const memo=(x.memo||'').split('\n').map(s=>s.trim()).filter(Boolean);
  let out=planBar+(x.diff?`<div data-sec="rs-diff">${roundDiff(x)}</div>`:'');
  if(x.summary)out+=`<p class="text-[14px] [&_b]:text-accent">${x.summary}</p>`;
  if(H.length){const o=x.order||['out','in'];
    out+=`<div class="grid grid-cols-3 gap-2 text-center">${o.map(k=>`<div class="rounded-xl bg-accent-soft p-2"><div class="num text-2xl font-semibold text-accent">${sum(half(k),4)}</div><div class="lbl">${k==='out'?'OUT':'IN'}の目標</div></div>`).join('')}<div class="rounded-xl bg-warn-soft p-2"><div class="num text-2xl font-semibold text-warn">${x.limit||99}</div><div class="lbl">上限</div></div></div>`;}
  if(x.mapKey)out+=`<div class="rounded-xl bg-accent-soft px-3 py-2 text-[13px] text-accent"><b>⛳ ホールをタップするとマップが開きます。</b>1打目・2打目の狙いと残りの距離、池・バンカー・OBの位置が見られます。</div>`;
  if(x.mapKey&&typeof courseView==='function')out+=courseView(x);
  if(x.mapKey&&typeof dwGroups==='function'&&H.length){const g=dwGroups(x);out+=`<div class="grid gap-1.5 rounded-xl border border-line p-3"><div class="font-bold">ドライバーの使い分け（全${H.length}ホール）</div>${DW_LABEL.map(([k,l,s,c])=>g[k].length?`<div class="flex items-start gap-2"><span class="w-[76px] shrink-0 pt-1 text-[12px] font-bold" style="color:${c}">${l}<span class="block text-[10px] font-normal text-muted">${s}</span></span><div class="flex flex-wrap gap-1">${g[k].map(n=>`<span class="grid h-8 min-w-[2rem] place-items-center rounded-lg px-1 font-mono text-[14px] font-bold" style="border:1.5px solid ${c};color:${c}">${n}</span>`).join('')}</div><span class="ml-auto pt-1 text-[11px] text-muted">${g[k].length}回</span></div>`:'').join('')}</div>`;}
  if(x.mapKey&&typeof openYardageBook==='function'&&(ILLUS[x.mapKey]||[]).length)out+=`<button class="btn w-full" onclick="openYardageBook('${x.date}')">📒 ヤーデージブック（手帳サイズで印刷）</button>`;
  if(x.info)out+=`<ul class="grid gap-1 pl-4 text-[13px] text-muted list-disc">${x.info.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
  if(memo.length)out+=`<div class="grid gap-2"><h3 class="font-bold">作戦メモ</h3><ul class="grid gap-1 pl-4 text-[14px] list-disc">${memo.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.rules)out+=`<div data-sec="rs-rules" class="grid gap-2"><h3 class="font-bold">当日の${x.rules.length}つの約束</h3>${x.rules.map((r,i)=>`<div class="rounded-xl border border-line p-3"><div class="font-bold"><span class="text-accent">${'①②③④⑤⑥⑦⑧⑨⑩'[i]||(i+1)}</span> ${esc(r[0])}</div><div class="text-[13px] text-muted">${esc(r[1]).replace(/&lt;(\/?b)&gt;/g,'<$1>')}</div></div>`).join('')}</div>`;
  if(H.length){const o=x.order||['out','in'];
    out+=o.map(k=>{const hs=half(k);return `<div data-sec="rs-${k}" class="grid gap-2"><div class="flex items-baseline gap-2 border-b-2 border-fg pb-1"><h3 class="h2">${k==='out'?'OUT':'IN'}</h3><span class="font-mono text-xs text-muted">${sum(hs,2).toLocaleString()}y・Par${sum(hs,1)}</span><span class="ml-auto text-[13px]">目標 <b class="num text-accent">${sum(hs,4)}</b></span></div>
     <div class="divide-y divide-line">${hs.map(h=>{const c=h[7]==='hard'?'bg-warn':h[7]==='mid'?'bg-sand':'bg-accent';const mp=x.mapKey&&typeof HOLE_MAPS!=='undefined'&&HOLE_MAPS[x.mapKey][h[0]];return `<div class="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-1 py-2.5 ${mp?'cursor-pointer':''}" ${mp?`onclick="openHoleMap('${x.date}',${h[0]})"`:''}>
      <div class="row-span-2 grid h-10 w-10 place-items-center rounded-lg ${c} font-mono text-base font-bold text-surface">${h[0]}</div>
      <div class="flex flex-wrap items-baseline gap-x-2 text-[12px] text-muted">${PAR_BADGE(h[1])}<span>Par${h[1]}</span><span class="font-mono">${h[2]}y</span><span>HC ${h[3]}</span><span class="font-semibold text-fg">${esc(h[5])}</span>${(()=>{const sd=x.mapKey&&typeof HOLE_SIDES!=='undefined'&&(HOLE_SIDES[x.mapKey]||{})[h[0]];return sd?`<span class="${sideCls(sd.L)}">左${sideMark(sd.L)}${/OB/.test(sd.L)?'OB':''}</span><span class="${sideCls(sd.R)}">右${sideMark(sd.R)}${/OB/.test(sd.R)?'OB':''}</span>${sd.B?`<span class="text-warn">奥✕</span>`:''}`:'';})()}</div>
      <div class="row-span-2 text-right"><div class="num text-2xl font-semibold leading-none">${h[4]}</div><div class="text-[10px] text-muted">目標</div></div>
      <div class="text-[13px] leading-snug">${esc(h[6])}${mp?`<span class="mt-1 flex w-fit items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-bold text-accent">⛳ マップを見る ›</span>`:''}</div></div>`;}).join('')}</div></div>`;}).join('');
    out+=`<div class="flex flex-wrap gap-3 text-[11px] text-muted"><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-accent align-middle"></i>ボギーを取る</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-sand align-middle"></i>注意</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-warn align-middle"></i>ダブルボギーでOK</span></div>`;}
  if(x.checks)out+=`<div data-sec="rs-checks" class="grid gap-2"><h3 class="font-bold">途中の確認</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc [&_b]:text-accent">${x.checks.map(s=>`<li>${s}</li>`).join('')}</ul></div>`;
  if(x.prep)out+=`<div data-sec="rs-prep" class="grid gap-2"><h3 class="font-bold">当日の朝と、それまでの練習</h3><ul class="grid gap-1 pl-4 text-[13px] list-disc">${x.prep.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
  if(x.note)out+=`<p class="text-[12px] text-muted">${esc(x.note)}</p>`;
  if(x.sources)out+=`<div class="text-[11px] text-muted"><b>出典</b>　${x.sources.map(([t,u])=>`<a class="underline" href="${u}" target="_blank" rel="noopener">${esc(t)}</a>`).join('　')}</div>`;
  if(!x.holes&&!memo.length&&!x.result)out+='<p class="text-sm text-muted">作戦はまだありません。「予定・メモを直す」から作戦メモを書けます。</p>';
  return out;
}

function roundForm(list){
  const x=ROUND_EDIT==='new'?{}:(list.find(r=>r.date===ROUND_EDIT)||{});
  const v=k=>esc(x[k]==null?'':String(x[k]));
  const f=(id,l,type,val,ph)=>`<label class="grid gap-1"><span class="lbl">${l}</span><input id="rf-${id}" type="${type}" class="inp" value="${val}" placeholder="${ph||''}"></label>`;
  return `<div class="card grid gap-3 p-4">
   <div class="font-bold">${ROUND_EDIT==='new'?'ラウンドを追加':'予定・メモを直す'}</div>
   <div class="grid grid-cols-2 gap-3">${f('date','日付','date',v('date')||'',)}${f('time','スタート','text',v('time'),'例：IN 7:32')}</div>
   ${f('course','ゴルフ場','text',v('course'),'例：〇〇カントリー倶楽部')}
   <div class="grid grid-cols-2 gap-3">${f('tee','ティー','text',v('tee'),'例：レギュラー')}${f('members','人数','text',v('members'),'例：3名')}</div>
   ${f('plan','プラン内容','text',v('plan'),'例：セルフ・カート付き・昼食別')}
   <div class="grid grid-cols-2 gap-3">${f('target','目標スコア','number',v('target'),'例：95')}${f('link','作戦ページのURL','url',x.builtin?'':v('link'),'なくてもOK')}</div>
   <div class="grid grid-cols-3 gap-3">${f('stars','難易度（1〜5）','number',x.diff&&x.diff.stars||'','例：3')}${f('cr','コースレート','number',x.diff&&x.diff.cr||'','例：70.1')}${f('score','スコア（終わったら）','number',x.result?x.result.score:'','例：98')}</div>
   ${f('holes','ホールごとの打数（1番から18個・スペース区切り。入れるとヤーデージブックに自動で記入）','text',x.result&&x.result.holes?x.result.holes.join(' '):'','例：6 7 5 6 8 7 7 10 5 5 6 7 6 3 6 7 5 6')}
   <label class="grid gap-1"><span class="lbl">作戦メモ（1行に1つ）</span><textarea id="rf-memo" rows="4" class="inp" placeholder="例：OBを0にする&#10;短いミドルは5番ウッド">${v('memo')}</textarea></label>
   <div class="flex gap-2"><button class="btn-main flex-1" onclick="busy(this,roundSave)">保存</button><button class="btn-sub" onclick="ROUND_EDIT=null;renderRounds()">やめる</button></div>
  </div>`;
}
const stars=n=>'★'.repeat(n)+'☆'.repeat(Math.max(0,5-n));
function roundDiff(x){const d=x.diff;const gap=d.cr&&d.par?Math.round((d.cr-d.par)*10)/10:null;
  const facts=[d.yards?['距離',d.yards.toLocaleString()+'y']:null,d.par?['Par',d.par]:null,d.bunkers?['バンカー',d.bunkers+'個']:null,d.water?['池が絡む',d.water+'ホール']:null].filter(Boolean);
  return `<div class="grid gap-3 rounded-xl border border-line p-3">
   <div class="flex items-baseline gap-2"><h3 class="font-bold">難易度</h3><span class="text-lg tracking-wider text-sand">${stars(d.stars||0)}</span>${d.cr?`<span class="ml-auto text-[12px] text-muted">コースレート <b class="num text-base text-fg">${d.cr}</b></span>`:''}</div>
   ${gap!==null?`<p class="text-[13px] text-muted">上手な人（ハンデ0）がふつうに回ると${d.cr}くらい。Parより<b class="text-fg">${Math.abs(gap)}打${gap<0?'やさしい':'むずかしい'}</b>コースです。</p>`:''}
   ${facts.length?`<div class="grid grid-cols-${facts.length} gap-2 text-center">${facts.map(([k,v])=>`<div class="rounded-lg bg-field p-1.5 ring-1 ring-line"><div class="num text-[15px] font-semibold">${v}</div><div class="text-[10px] text-muted">${k}</div></div>`).join('')}</div>`:''}
   ${d.green||d.terrain?`<div class="text-[12px] text-muted">${[d.green,d.terrain].filter(Boolean).map(esc).join('　／　')}</div>`:''}
   ${d.why?`<ul class="grid gap-0.5 pl-4 text-[13px] list-disc">${d.why.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}
  </div>`;}
function roundHistory(list){const done=list.filter(x=>x.result&&x.result.score);if(!done.length)return '';
  const nx=list.find(x=>x.date>=today()&&!x.result);
  return `<div class="card grid gap-2 p-4"><div class="lbl">スコアの流れ</div>
   <div class="flex flex-wrap items-end gap-x-4 gap-y-2">${done.map(x=>`<div><div class="num text-2xl font-semibold ${x.result.score<100?'text-accent':''}">${x.result.score}</div><div class="text-[11px] text-muted">${md(x.date)} ${esc(x.course||'')}</div></div>`).join('<span class="pb-4 text-muted">→</span>')}
   ${nx&&nx.target?`<span class="pb-4 text-muted">→</span><div><div class="num text-2xl font-semibold text-accent">${nx.target}</div><div class="text-[11px] text-muted">${md(nx.date)} 目標</div></div>`:''}</div></div>`;}
function roundToggle(d){const opening=ROUND_OPEN!==d;ROUND_OPEN=opening?d:'';
  const hh=document.querySelector('header');if(hh)document.documentElement.style.setProperty('--hh',hh.offsetHeight+'px');
  renderRounds().then(()=>{const el=$('rc-'+d);if(el){const y=el.getBoundingClientRect().top+scrollY-(hh?hh.offsetHeight:57)-8;scrollTo({top:y,behavior:opening?'smooth':'auto'});}});}
function roundJump(id){const el=$(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
function roundEdit(d){ROUND_EDIT=d;renderRounds().then(()=>{const e=$('rf-course');if(e)e.scrollIntoView({block:'center',behavior:'smooth'});});}
async function roundSave(){
  const g=k=>($('rf-'+k)?$('rf-'+k).value.trim():'');
  const d=g('date');if(!d){toast('日付を入れてください',true);return;}
  if(!g('course')&&!ROUND_BASE(d)){toast('ゴルフ場を入れてください',true);return;}
  const e={name:'ラウンド予定',kind:'roundplan',course:g('course'),time:g('time'),tee:g('tee'),members:g('members'),plan:g('plan'),target:parseInt(g('target'))||0,link:g('link'),memo:g('memo'),stars:Math.min(5,Math.max(0,parseInt(g('stars'))||0)),cr:parseFloat(g('cr'))||0,score:parseInt(g('score'))||0,holes:(g('holes')||'').trim()};
  const old=ROUND_EDIT&&ROUND_EDIT!=='new'&&ROUND_EDIT!==d?roundPlanId(ROUND_EDIT):null;
  const rec={id:roundPlanId(d),date:d,cat:'full',exercises:[e],runDist:0,runTime:0,walkDist:0,walkTime:0,note:`[ラウンド予定] ${e.course||ROUND_BASE(d).course}`};
  if(await upsertRec(rec)){
    if(old&&(await getRecs()).some(r=>Number(r.id)===old))await deleteRec(old);
    ROUND_EDIT=null;ROUND_OPEN=d;toast('保存しました');renderRounds();
  }
}
async function roundDel(d){
  if(!confirm('このラウンドを削除しますか？'))return;
  await deleteRec(roundPlanId(d));ROUND_OPEN=null;renderRounds();
}
if(typeof CUR!=='undefined'&&CUR==='golf'&&GOLF_R==='rounds')renderRounds();
