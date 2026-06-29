import os

env_path = os.path.expanduser('~/AppData/Local/hermes/hermes-agent/.env')
with open(env_path) as f:
    for line in f:
        if 'AGNES_API_KEY' in line:
            key = line.split('=', 1)[1].strip()
            print('len:', len(key), 'hex:', key.encode().hex())
            break
