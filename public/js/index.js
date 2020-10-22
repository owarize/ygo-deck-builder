$(document).ready(() => {
    const socket = io();


    $('#db-search').on('input', () => {
        socket.emit('dbSearch', $('#db-search').val());
    });

    socket.on('dbSearchResults', (results) => {
        console.log(results);
    });
});
