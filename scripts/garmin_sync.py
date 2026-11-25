"""Garmin Connect のラン・ウォークを洋平トレーニング（Supabase training_logs）へ自動で入れる。
GitHub Actions から1時間ごとに動く。パスワード類はすべて GitHub の Secrets から読む（ファイルには書かない）。
"""
import json, os, sys, urllib.request, urllib.error
from datetime import date, timedelta

SB_URL = 'https://nuqhddzwjknoxrykfcrb.supabase.co'
SB_KEY = 'sb_publishable_6nSJ-7MfHwr4e2p2Esgp8A_0BTGPODN'
SINCE = os.environ.get('SYNC_SINCE', '2012-01-01')   # この日より前は入れない
DAYS = int(os.environ.get('SYNC_DAYS', '7'))
TOKENS = os.path.expanduser('~/.garminconnect')
RUN = {'running', 'treadmill_running', 'trail_running', 'track_running', 'indoor_running', 'virtual_run'}
WALK = {'walking', 'hiking', 'casual_walking', 'speed_walking', 'indoor_walking'}


def http(method, url, body=None, headers=None):
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Content-Type': 'application/json', 'apikey': SB_KEY, **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        t = r.read().decode()
        return json.loads(t) if t else None


def garmin():
    from garminconnect import Garmin
    os.makedirs(TOKENS, exist_ok=True)
    # 保存したログイン情報があればそれで入り、だめならメール・パスワードで入り直して保存し直す
    api = Garmin(os.environ['GARMIN_EMAIL'], os.environ['GARMIN_PASSWORD'])
    api.login(TOKENS)
    return api


FRIENDS_ID = 900000000000000001   # 仲間のまとめを入れる行（date 2000-01-01・アプリの記録には出さない）


def _list(x):
    if isinstance(x, list):
        return x
    if isinstance(x, dict):
        for k in ('activityList', 'activities', 'adHocChallenges', 'challenges', 'players', 'items'):
            if isinstance(x.get(k), list):
                return x[k]
    return []


def friends(api, my_name, my_full=''):
    """Garminのランニングチャレンジに入っている仲間の、今の距離と最近のランを集める。
    公開リポジトリのログに他人のデータを出さないよう、print は件数とキーの名前だけ。"""
    from datetime import datetime, timezone
    out = {'at': datetime.now(timezone(timedelta(hours=9))).strftime('%Y-%m-%d %H:%M'), 'challenge': None, 'people': []}
    try:
        chs = _list(api.get_active_adhoc_challenges())
    except Exception as e:
        print('チャレンジを読めませんでした:', str(e)[:120]); return None
    print('チャレンジ', len(chs), '件', sorted(chs[0].keys())[:40] if chs else '')
    ch = next((c for c in chs if 'ラン' in str(c.get('adHocChallengeName') or c.get('name') or '')), chs[0] if chs else None)
    if not ch:
        return None
    uuid = ch.get('uuid') or ch.get('adHocChallengeUuid') or ch.get('challengeUuid')
    det = ch
    if uuid:
        try:
            det = api.connectapi(f'/adhocchallenge-service/adHocChallenge/{uuid}') or ch
        except Exception as e:
            print('チャレンジの中身を読めませんでした:', str(e)[:120])
    players = _list(det.get('players') if isinstance(det, dict) else None) or _list(det)
    print('参加者', len(players), sorted(players[0].keys())[:40] if players else '')
    out['challenge'] = {'name': det.get('adHocChallengeName') or det.get('name'), 'start': str(det.get('startDate') or '')[:10],
                        'end': str(det.get('endDate') or '')[:10]}
    for p in players:
        dn = p.get('displayName') or p.get('userDisplayName')
        nm = p.get('fullName') or p.get('displayName') or ''
        score = p.get('totalNumber')
        me = bool(dn and dn == my_name) or (my_full and nm.replace(' ', '') == my_full.replace(' ', ''))
        person = {'name': nm, 'me': me, 'score': score, 'today': p.get('todayNumber'), 'runs': []}
        if dn and not me:
            try:
                acts = _list(api.connectapi(f'/activitylist-service/activities/{dn}', params={'start': 0, 'limit': 30}))
                if acts:
                    print('仲間のラン', len(acts), '件', sorted(acts[0].keys())[:12])
                for a in acts:
                    kind = ((a.get('activityType') or {}).get('typeKey') or '').lower()
                    if 'run' not in kind:
                        continue
                    km = round((a.get('distance') or 0) / 1000, 2); sec = int(round(a.get('duration') or 0))
                    if km <= 0 or sec <= 0:
                        continue
                    person['runs'].append({'d': (a.get('startTimeLocal') or '')[:10], 'km': km, 'sec': sec,
                                           'hr': int(round(a.get('averageHR') or 0)), 'vo2': a.get('vO2MaxValue') or 0})
            except Exception as e:
                print('仲間のランを読めませんでした:', str(e)[:120])
        out['people'].append(person)
    return out


def main():
    tok = http('POST', SB_URL + '/auth/v1/token?grant_type=password',
               {'email': os.environ['SB_EMAIL'], 'password': os.environ['SB_PASSWORD']})
    auth = {'Authorization': 'Bearer ' + tok['access_token']}
    end = date.today() + timedelta(days=1)
    start = max(date.fromisoformat(SINCE), end - timedelta(days=DAYS))
    api = garmin()
    acts = api.get_activities_by_date(start.isoformat(), end.isoformat())
    # Garminのフルマラソン予想（今の値）。取れなければ何もしない
    pred = None
    try:
        rp = api.get_race_predictions()
        if isinstance(rp, list):
            rp = rp[0] if rp else None
        if isinstance(rp, dict) and rp.get('timeMarathon'):
            h, m = divmod(int(rp['timeMarathon']), 3600)
            pred = f'{h}:{m // 60:02d}:{m % 60:02d}'
    except Exception as e:
        print('レース予想を読めませんでした:', str(e)[:120])
    have = http('GET', f"{SB_URL}/rest/v1/training_logs?date=gte.{start.isoformat()}&select=id,date,run_dist,walk_dist", headers=auth) or []
    rows = []
    skipped = {}
    for a in acts:
        kind = ((a.get('activityType') or {}).get('typeKey') or '').lower()
        if kind not in RUN and kind not in WALK:
            if 'run' in kind:
                RUN.add(kind)            # street_running・road_running など、名前に run が付くものは全部ラン
            elif 'walk' in kind or 'hik' in kind:
                WALK.add(kind)
            else:
                skipped[kind] = skipped.get(kind, 0) + 1
                continue
        d = (a.get('startTimeLocal') or '')[:10]
        if not d or d < SINCE:
            continue
        km = round((a.get('distance') or 0) / 1000, 2)
        sec = int(round(a.get('duration') or 0))
        if km <= 0 or sec <= 0:
            continue
        aid = int(a['activityId'])
        fld = 'run_dist' if kind in RUN else 'walk_dist'
        # 手で入れた同じ日・同じ距離の記録があれば入れない（二重にしない）
        if any(h['date'][:10] == d and int(h['id']) != aid and abs(float(h.get(fld) or 0) - km) < 0.15 for h in have):
            continue
        pm, ps = divmod(int(round(sec / km)), 60)   # 1kmあたりの秒 → 分・秒
        row = {'id': aid, 'date': d, 'cat': 'run', 'exercises': [], 'run_dist': 0, 'run_time': 0, 'run_pace_min': 0,
               'run_pace_sec': 0, 'run_hr': 0, 'run_cal': 0, 'walk_dist': 0, 'walk_time': 0,
               'note': 'Garmin自動：' + (a.get('activityName') or kind)}
        if kind in RUN and a.get('vO2MaxValue'):
            row['note'] += f"｜VO2max {round(float(a['vO2MaxValue']), 1):g}"   # その日のランで出たVO2max
        if kind in RUN:
            row.update(run_dist=km, run_time=sec, run_pace_min=pm, run_pace_sec=ps,
                       run_hr=int(round(a.get('averageHR') or 0)), run_cal=int(round(a.get('calories') or 0)))
        else:
            row.update(walk_dist=km, walk_time=sec)
        rows.append(row)
    runs = [r for r in rows if r['run_dist'] > 0]
    if pred and runs:
        last = max(runs, key=lambda r: (r['date'], r['id']))   # 一番新しいランに今の予想を付ける
        last['note'] += f'｜Garmin予想フル {pred}'
    try:
        my_dn = getattr(api, 'display_name', None) or getattr(getattr(api, 'garth', None), 'profile', {}).get('displayName')
        try:
            my_full = api.get_full_name() or ''
        except Exception:
            my_full = ''
        fr = friends(api, my_dn, my_full)
        if fr:
            rows.append({'id': FRIENDS_ID, 'date': '2000-01-01', 'cat': 'run', 'exercises': [], 'run_dist': 0, 'run_time': 0,
                         'run_pace_min': 0, 'run_pace_sec': 0, 'run_hr': 0, 'run_cal': 0, 'walk_dist': 0, 'walk_time': 0,
                         'note': '[FRIENDS]' + json.dumps(fr, ensure_ascii=False)})
    except Exception as e:
        print('仲間の記録でエラー:', str(e)[:160])
    if rows:
        http('POST', SB_URL + '/rest/v1/training_logs', rows, {**auth, 'Prefer': 'resolution=merge-duplicates'})
    print(f'Garmin: {len(acts)}件を確認、{len(rows)}件を記録（{start}〜）')
    print('ラン・ウォーク以外で入れなかった種類:', skipped)


if __name__ == '__main__':
    if not all(os.environ.get(k) for k in ('GARMIN_EMAIL', 'GARMIN_PASSWORD', 'SB_EMAIL', 'SB_PASSWORD')):
        print('Secrets がまだ設定されていないので何もしません'); sys.exit(0)
    try:
        main()
    except urllib.error.HTTPError as e:
        print('Supabase エラー', e.code, e.read().decode()[:300]); sys.exit(1)
