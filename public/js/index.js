$(document).ready(() => {
    const socket = io();

    let card_details    = [];
    let user_collection = [];
    let user_deck       = [];

    let allow_db_search = true; // TODO: This method will cause incorrect search results. Find a better solution.


    $('#db-search').on('input', () => {
        if (allow_db_search) {
            allow_db_search = false;
            socket.emit('dbSearch', $('#db-search').val());
        }
    });

    socket.on('dbSearchResults', (data) => {
        $('#card-db-listing').empty();

        for (let i = 0; i < data.results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + data.results[i].name + '</p>';
            html    += '<img id="' + data.results[i].id + '" src="' + data.results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#card-db-listing').append(html);

            if (!(data.results[i].id in card_details)) {
                card_details[data.results[i].id] = data.results[i]
            }
        }

        $('#db-search-n-results').text(data.results.length + ' of ' + data.n_results + ' results shown');
        allow_db_search = true;
    });


    $('#card-db-listing').on('click', 'img', (e) => {
        user_collection.push(e.target.id);

        let html = '<div class="card">';
        //html    += '<p class="card-name">' + results[i].name + '</p>';
        html    += '<img id="' + e.target.id + '" src="' + card_details[e.target.id].card_images[0].image_url + '">'
        html    += '</div>'

        $('#user-collection-listing').prepend(html);
    });


    $('#user-collection-listing').on('click', 'img', (e) => {
        user_deck.push(e.target.id);

        let html = '<div class="card">';
        //html    += '<p class="card-name">' + results[i].name + '</p>';
        html    += '<img id="' + e.target.id + '" src="' + card_details[e.target.id].card_images[0].image_url + '">'
        html    += '</div>'

        $('#user-deck-listing').prepend(html);
    });

    $('#user-deck-listing').on('click', 'img', (e) => {
        user_deck.splice(user_deck.indexOf(e.target.id), 1);
        $(e.target).parent().remove();
    });


    $('#csv-file').change(() => {
        const fr = new FileReader();

        fr.onload = function() {
            socket.emit('csvFile', fr.result);
        }

        fr.readAsText($('#csv-file').prop('files')[0]);
    });

    socket.on('csvSubmitResults', (results) => {
        $('#user-collection-listing').empty();

        for (let i = 0; i < results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + results[i].name + '</p>';
            html    += '<img id="' + results[i].id + '" src="' + results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#user-collection-listing').append(html);
            user_collection.push(results[i].id);

            if (!(results[i].id in card_details)) {
                card_details[results[i].id] = results[i]
            }
        }
    });
});
