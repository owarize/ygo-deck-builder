$(document).ready(() => {
    const socket = io();

    let user_collection = [];


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


    $('body').on('click', 'img', (e) => {
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
});
