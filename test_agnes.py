import os, urllib.request, json

env_path = os.path.expanduser('~/AppData/Local/hermes/hermes-agent/.env')
key = None
with open(env_path) as f:
    for line in f:
        if 'AGNES_API_KEY' in line:
            key = line.split('=', 1)[1].strip()
            break

data = json.dumps({
    'model': 'agnes-2.0-flash',
    'messages': [{'role': 'user', 'content': 'Reply OK'}],
    'max_tokens': 10
}).encode()

req = urllib.request.Request(
    'https://apihub.agnes-ai.com/v1/chat/completions',
    data=data,
    headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}
)
# No proxy
try:
    resp = urllib.request.urlopen(req, timeout=15)
    print('SUCCESS:', resp.read().decode()[:500])
except Exception as e:
    print('ERROR:', e)
    if hasattr(e, 'read'):
        print('Body:', e.read().decode()[:500])
