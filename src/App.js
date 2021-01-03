//import logo from './logo.svg';
import { logo, up, left, down, right,vidaLogo } from './assets';
import { avatars } from './assets/avatars';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




const constantes = {
  TOKEN: "b89f96d2",
  PLAYER_INFO: 
  {
    player_token : "",
    security_code: ""
  }
}



function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}




function nuevaPartida(){
  if(constantes.PLAYER_INFO.player_token === "" && constantes.PLAYER_INFO.player_token === "" ){
    var nom = prompt('Introduce el nombre de tu jugador:', '');
  if(nom!=null){
    makeRequest('GET', 'http://battlearena.danielamo.info/api/spawn/'+constantes.TOKEN+'/'+nom)
    .then(function (datums) {
        var obj = JSON.parse(datums);
        console.log(obj);
        constantes.PLAYER_INFO.player_token = obj.token;
        constantes.PLAYER_INFO.security_code = obj.code;
        console.log('Jugador Creado!\nToken: ' + constantes.PLAYER_INFO.player_token + '\nCodigo de Seguridadad: ' + constantes.PLAYER_INFO.security_code);

        makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token)
        .then(function (datums) {
          var obj = JSON.parse(datums);
          var newInfo = document.createElement("div");
          newInfo.id = 'informasion';
          newInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.365)';
          var name = document.createElement("h2");
          name.id = 'nombrePlayer';
          name.innerText = obj.name;
          newInfo.appendChild(name);
          console.log('1');
          var imagen = document.createElement("img");
          imagen.src = avatars[obj.image-1];
          imagen.className = 'characterImage';
          imagen.alt = 'characterImage';
          imagen.style.height='300px';
          console.log('1.2');
          newInfo.appendChild(imagen);
          console.log('2');
          var node = document.createElement("div");
          node.className = 'life';
          node.id = 'life';
          console.log('3');
          node.innerHTML =  `<div className="corasong"> <img src='/static/media/corazon.d3bf3074.svg' alt='vida' height='30px'/>  </div> <div class="progress"><div role="progressbar" class="progress-bar bg-danger progress-bar-animated progress-bar-striped" aria-valuenow="`+(obj.vitalpoints*2)+`" aria-valuemin="0" aria-valuemax="100" style="width: `+(obj.vitalpoints*2)+`%;"></div></div>`;
          console.log('4');
          newInfo.appendChild(node);
          console.log('5');
          console.log(obj);
          document.getElementById("player").appendChild(newInfo);

        })
        .catch(function (err) {
            console.log('Augh, there was an error!', err.statusText);
        });

    })
    .catch(function (err) {
        console.log('Augh, there was an error!', err.statusText);
    });
  }
  }else{
    console.log('Ya has hecho spawn de un jugador!');
  }
  
}

function eliminarJugador(){
  if(constantes.PLAYER_INFO.player_token === "" || constantes.PLAYER_INFO.player_token === "" ){
    console.log('Crea un jugador primero!');
  }else{
    makeRequest('GET', 'http://battlearena.danielamo.info/api/remove/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token+'/'+constantes.PLAYER_INFO.security_code)
    .then(function (datums) {

      document.querySelector('#player').innerHTML= '';
    
      
      constantes.PLAYER_INFO.player_token = "";
      constantes.PLAYER_INFO.security_code = "";


      console.log('Jugador Eliminado');
    })
    .catch(function (err) {
        console.log('Augh, there was an error!', err.statusText);
    });
  }
 
}

function updateScroll(){
  var objDiv = document.getElementById("log");
  objDiv.scrollTop = objDiv.scrollHeight
}

window.console = {
  log: function(str){
    var current = new Date();
    var node = document.createElement("div");
    node.style.width = '100%';
    node.style.alignContent = 'start';
    node.style.margin = '0 auto';
    node.style.marginLeft = '10px'
    node.style.textAlign = 'left';
    node.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
    node.style.fontSize = '12px';
    node.style.color = 'white';
    if(typeof str === 'object'){
      str = JSON.stringify(str, null, 4);
    }
    node.appendChild(document.createTextNode('['+current.getDate()+'/'+(current.getMonth()+ 1)+'/'+current.getFullYear()+'-'+current.getHours()+':'+current.getMinutes()+':'+current.getSeconds()+'] ' + str));
    document.getElementById("log").appendChild(node);
    updateScroll();
  }
}


document.onkeydown = function(e) {
  switch (e.keyCode) {
      case 37:
          console.log("El personaje se mueve a la izquierda");
          break;
      case 38:
          console.log("El personaje se mueve hacia delante");
          break;
      case 39:
          console.log("El personaje se mueve hacia la derecha");
          break;
      case 40:
          console.log("El personaje se mueve hacia atras");
          break;
  }
};


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header">
          

          <img src={logo} className="logo" alt='logo' height='70px'/>
          <div className="siteTitle">
            <h4>Pràctica 2</h4>
            <h6>Marti Ejarque · Rafael Morera · Victor Xirau</h6>
          </div>
          <Button variant="outline-danger" onClick={eliminarJugador}>REMOVE</Button>{' '}
          <Button variant="outline-success" onClick={nuevaPartida}>SPAWN</Button>{' '}
         

        </div>
        <div className="mapa">
          <div className="miniMapa">

          </div>

        </div>
        
        
        <div className="player" id="player">
         
        </div>

        <div className="terminal" id="terminal" >
          <h3>TERMINAL</h3>
          <div className="log" id="log">

          </div>
        </div>
        <div className="control">
          <div className="up"> 
            <img src={up} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
          <div className="down"> 
            <img src={down} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
          <div className="left"> 
            <img src={left} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
          <div className="right"> 
            <img src={right} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
        </div>
        <div className="bruju"></div>
        <div className="stats"></div>
        <div className="neutral"></div>
      </header>
    </div>
  );
}


export default App;
