let script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.3.1.js';
script.type = 'text/javascript';

script.onreadystatechange = handler;
script.onload = handler;

var head = document.getElementsByTagName('head')[0];
head.appendChild(script);

function handler(){
    //based on chat theme load various 
    $("#chat").load("../public/components/layout.html");
}