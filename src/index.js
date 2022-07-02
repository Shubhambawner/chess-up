import ReactDOM from 'react-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GameErrorboundry } from './Errorboundry';
import Game from './components/Game';
//controlled components


//controlling component


let initCheck = ()=>{let w = window.innerWidth;
if (w > 630 && w < 780) {
    window.alert("game supported for standard mobile/desktop view, for current device being used, game is under construction ");
} if (w <= 630) {
    window.alert("this site uses some advance UI properties, so it may produce lag on small screens, please switch to desktop for best experience. or, move to alternate site: https://chess-up.netlify.app/")
}}

initCheck()
// ========================================
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<GameErrorboundry ><Game /></GameErrorboundry>);
/*
the localstorage is used to store the game state,so that reload dosnt make it lost.

when we store object in local storage, we have to see, that the format of object being stored has to be the same in which it will be fetched from there,
otherwise the object being fetched being different, will produce following error:

Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.


*/