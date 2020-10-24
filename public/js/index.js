$(document).ready(() => {
    const socket = io();

    let user_collection = [];
    let user_deck       = [];


    $('#db-search').on('input', () => {
        socket.emit('dbSearch', $('#db-search').val());
    });

    socket.on('dbSearchResults', (data) => {
        $('#card-db-listing').empty();

        for (let i = 0; i < data.results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + data.results[i].name + '</p>';
            html    += '<img id="' + data.results[i].id + '" src="' + data.results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#card-db-listing').append(html);
            $('#db-search-n-results').text('25 of ' + data.n_results + ' results shown');
        }
    });


    $('#card-db-listing').on('click', 'img', (e) => {
        user_collection.push(e.target.id);
        socket.emit('collectionUpdated', user_collection);
    });

    socket.on('collectionUpdateResults', (results) => {
        $('#user-collection-listing').empty();

        for (let i = 0; i < results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + results[i].name + '</p>';
            html    += '<img id="' + results[i].id + '" src="' + results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#user-collection-listing').append(html);
        }
    });


    $('#user-collection-listing').on('click', 'img', (e) => {
        user_deck.push(e.target.id);
        socket.emit('deckUpdated', user_deck);
    });

    socket.on('deckUpdateResults', (results) => {
        $('#user-deck-listing').empty();

        for (let i = 0; i < results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + results[i].name + '</p>';
            html    += '<img id="' + results[i].id + '" src="' + results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#user-deck-listing').append(html);
        }
    });

    $('#user-deck-listing').on('click', 'img', (e) => {
        user_deck.splice(user_deck.indexOf(e.target.id), 1);
        $(e.target).parent().remove();
    });
});
