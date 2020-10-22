import json
import os
import urllib.request

import eventlet
import socketio

card_db_file = 'card_db.json'
card_db      = {}


# ---------------------------------------------------------------------------------------------------- SERVER INIT
static_files = {
    '/':                'pages/index.html',
    '/css/default.css': 'public/css/default.css'
}

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files=static_files)

port = 3000
if 'PORT' in os.environ.keys():
    port = int(os.environ['PORT'])


# ---------------------------------------------------------------------------------------------------- FUNCTIONS
def loadCardDB():
    if os.path.isfile(card_db_file):
        print('Card DB file exists.')
        card_db = json.load(open(card_db_file))

    else:
        print('Card DB file does not exist. Requesting from ygoprodeck.com')
        req     = urllib.request.Request('https://db.ygoprodeck.com/api/v7/cardinfo.php', headers={'User-Agent': 'Mozilla'})
        r       = urllib.request.urlopen(req).read()
        card_db = json.loads(r.decode('utf-8'))['data']
        json.dump(card_db, open(card_db_file, 'w'))

    print(f'Loaded {len(card_db)} cards.')


def main():
    eventlet.wsgi.server(eventlet.listen(('', port)), app)


if __name__ == '__main__':
    loadCardDB()
    main()
