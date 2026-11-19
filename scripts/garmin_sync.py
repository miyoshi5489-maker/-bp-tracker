"""Garmin Connect のラン・ウォークを洋平トレーニング（Supabase training_logs）へ自動で入れる。
GitHub Actions から1時間ごとに動く。パスワード類はすべて GitHub の Secrets から読む（ファイルには書かない）。
"""
import json, os, sys, urllib.request, urllib.error
from datetime import date, timedelta

SB_URL = 'https://nuqhddzwjknoxrykfcrb.supabase.co'
SB_KEY = 'sb_publishable_6nSJ-7MfHwr4e2p2Esgp8A_0BTGPODN'
SINCE = os.environ.get('SYNC_SINCE', '2022-01-01')   # この日より前は入れない
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


def main():
    tok = http('POST', SB_URL + '/auth/v1/token?grant_type=password',
               {'email': os.environ['SB_EMAIL'], 'password': os.environ['SB_PASSWORD']})
    auth = {'Authorization': 'Bearer ' + tok['access_token']}
    end = date.today() + timedelta(days=1)
    start = max(date.fromisoformat(SINCE), end - timedelta(days=DAYS))
    acts = garmin().get_activities_by_date(start.isoformat(), end.isoformat())
    have = http('GET', f"{SB_URL}/rest/v1/training_logs?date=gte.{start.isoformat()}&select=id,date,run_dist,walk_dist", headers=auth) or []
    rows = []
    for a in acts:
        kind = ((a.get('activityType') or {}).get('typeKey') or '').lower()
        if kind not in RUN and kind not in WALK:
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
        if kind in RUN:
            row.update(run_dist=km, run_time=sec, run_pace_min=pm, run_pace_sec=ps,
                       run_hr=int(round(a.get('averageHR') or 0)), run_cal=int(round(a.get('calories') or 0)))
        else:
            row.update(walk_dist=km, walk_time=sec)
        rows.append(row)
    if rows:
        http('POST', SB_URL + '/rest/v1/training_logs', rows, {**auth, 'Prefer': 'resolution=merge-duplicates'})
    print(f'Garmin: {len(acts)}件を確認、{len(rows)}件を記録（{start}〜）')


if __name__ == '__main__':
    if not all(os.environ.get(k) for k in ('GARMIN_EMAIL', 'GARMIN_PASSWORD', 'SB_EMAIL', 'SB_PASSWORD')):
        print('Secrets がまだ設定されていないので何もしません'); sys.exit(0)
    try:
        main()
    except urllib.error.HTTPError as e:
        print('Supabase エラー', e.code, e.read().decode()[:300]); sys.exit(1)
