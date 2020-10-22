$(document).ready(() => {
    const socket = io();


    $('#db-search').on('input', () => {
        socket.emit('dbSearch', $('#db-search').val());
    });

    socket.on('dbSearchResults', (results) => {
        for (let i = 0; i < results.length; i++) {
            let html = '<div class="card">';
            //html    += '<p class="card-name">' + results[i].name + '</p>';
            html    += '<img src="' + results[i].card_images[0].image_url + '">'
            html    += '</div>'

            $('#card-db-listing').append(html);
        }
    });
});
