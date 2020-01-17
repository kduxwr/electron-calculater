const $ = require('jquery');
const {ipcRenderer} = require('electron');

$('.num').on('click', function () {
    ipcRenderer.send('num', this.innerText);
});

$('.ope').on('click', function () {
    ipcRenderer.send('ope', this.innerText);
});

$('.con').on('click', function () {
    ipcRenderer.send('con', this.innerText);
});

ipcRenderer.on('render', (event, arg) => {
    $('#output-text').text(arg);
});