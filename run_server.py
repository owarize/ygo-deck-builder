import json
import os
import urllib.request

import eventlet
import socketio

card_db_file  = 'card_db.json'
card_db       = []
card_db_by_id = {}


# ---------------------------------------------------------------------------------------------------- SERVER INIT
static_files = {
    '/':                'pages/index.html',
    '/css/default.css': 'public/css/default.css',
    '/js/index.js':     'public/js/index.js'
}

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files=static_files)

port = 3000
if 'PORT' in os.environ.keys():
    port = int(os.environ['PORT'])


# ---------------------------------------------------------------------------------------------------- SOCKET.IO
@sio.on('dbSearch')
def dbSearch(sid, query):
    query     = query.lower()
    results   = []
    n_results = 0

    for card in card_db:
        if query in card['name'].lower():
            n_results += 1
            if len(results) < 25:
                results.append(card)

    sio.emit('dbSearchResults', {
        'results':   results,
        'n_results': n_results }, room=sid)


@sio.on('collectionUpdated')
def collectionUpdated(sid, collection):
    results = []

    for card_id in collection:
        results.append(card_db_by_id[int(card_id)])

    sio.emit('collectionUpdateResults', results, room=sid)


# ---------------------------------------------------------------------------------------------------- FUNCTIONS
def loadCardDB():
    global card_db
    global card_db_by_id

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
    print('Building database...', end=' ')

    for card in card_db:
        card_db_by_id[card['id']] = card

    print('Done.')


def main():
    eventlet.wsgi.server(eventlet.listen(('', port)), app)


if __name__ == '__main__':
    loadCardDB()
    main()
