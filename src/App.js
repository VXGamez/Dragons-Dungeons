//import logo from './logo.svg';
import { logo, up, left, down, right,vidaLogo, espadas, escudo } from './assets';
import { avatars } from './assets/avatars';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
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
  if(constantes.PLAYER_INFO.player_token === "" && constantes.PLAYER_INFO.security_code === "" ){
    var nom = prompt('Introduce el nombre de tu jugador:', '');
  if(nom!=null){
    makeRequest('GET', 'http://battlearena.danielamo.info/api/spawn/'+constantes.TOKEN+'/'+nom)
    .then(function (datums) {
        var obj = JSON.parse(datums);
        constantes.PLAYER_INFO.player_token = obj.token;
        constantes.PLAYER_INFO.security_code = obj.code;
        console.log('Jugador Creado!\nToken: ' + constantes.PLAYER_INFO.player_token + '\nCodigo de Seguridadad: ' + constantes.PLAYER_INFO.security_code);

        makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token)
        .then(function (datums) {
          var obj = JSON.parse(datums);
          var newInfo = document.createElement("div");
          newInfo.id = 'informasion';
          newInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.365)';
          newInfo.style.width = '90%';
          newInfo.style.height = '90%';
          newInfo.style.color = 'white';
          var name = document.createElement("h2");
          name.id = 'nombrePlayer';
          name.innerText = obj.name;
          newInfo.appendChild(name);
          var imagen = document.createElement("img");
          imagen.src = avatars[obj.image-1];
          imagen.className = 'characterImage';
          imagen.alt = 'characterImage';
          imagen.style.height='250px';
          newInfo.appendChild(imagen);
          var node = document.createElement("div");
          node.className = 'life';
          node.id = 'life';
          node.innerHTML =  `<div className="corasong"> <img src='/static/media/corazon.d3bf3074.svg' alt='vida' height='30px'/>  </div> <div class="progress"><div role="progressbar" class="progress-bar bg-danger progress-bar-animated progress-bar-striped" aria-valuenow="`+(obj.vitalpoints*2)+`" aria-valuemin="0" aria-valuemax="100" style="width: `+(obj.vitalpoints*2)+`%;">`+(obj.vitalpoints*2)+`vp</div></div>`;
          newInfo.appendChild(node);
          console.log(obj);
          document.getElementById("player").appendChild(newInfo);
          
          
          var dire = document.getElementById("stats");
          
          var diversiong = document.createElement("div");
          
          var ataque = document.createElement("p");
          ataque.innerText = 'Ataque: ' + obj.attack;
          ataque.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
          ataque.style.fontSize = '30px';
          ataque.style.color = 'white';
          ataque.style.marginTop = '5%';
          ataque.style.marginLeft = '25%';

          diversiong.appendChild(ataque);

          var img = document.createElement("img");
          img.src =  espadas;
          img.alt = 'espadas';
          img.style.width = '10%';
          img.style.marginLeft = '5%';

          diversiong.appendChild(img);

          diversiong.style.display = 'flex';
          diversiong.style.flexDirection = 'row';

          dire.appendChild(diversiong);
          
          var diversiong2 = document.createElement("div");
          
          var defensa = document.createElement("p");
          defensa.innerText = 'Defensa: ' + obj.defense;
          defensa.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
          defensa.style.fontSize = '30px';
          defensa.style.color = 'white';
          defensa.style.marginLeft = '25%';

          diversiong2.appendChild(defensa);

          var img2 = document.createElement("img");
          img2.src = escudo;
          img2.alt = 'escudo';
          img2.style.width = '10%';
          img2.style.marginLeft = '5%';
        
          
          diversiong2.style.display = 'flex';
          diversiong2.style.flexDirection = 'row';

          diversiong2.appendChild(img2);
          dire.appendChild(diversiong2);

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
  if(constantes.PLAYER_INFO.player_token === "" || constantes.PLAYER_INFO.security_code === "" ){
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
        <div className="stats" id="stats"></div>
        <div className="objetos">
          <div className="obj1">
            <div className="imgObj1">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/axe.svg?token=ALPT6YAHZPFG6CIJQ5ZXXY277NEO2" alt="obj1" width="50px"/>
              <h3>Q</h3>
            </div>
            <div className="infoObj1">
              <h6>Hachas del destino</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="obj2">
            <div className="imgObj2">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/kunai.svg?token=ALPT6YE3XKRBYDZIKYFGFPS77NET6" alt="obj2" width="50px"/>
              <h3>W</h3>
            </div>
            <div className="infoObj2">
              <h6>Kunai Represor</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="obj3">
            <div className="imgObj3">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/spear.svg?token=ALPT6YCQJB627XIZ6Q2COTC77NEUS" alt="obj3" width="50px"/>
              <h3>E</h3>
            </div>
            <div className="infoObj3">
              <h6>Lanza Letal</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="obj4">
            <div className="imgObj4">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/weapon.svg?token=ALPT6YHHTINJ635FRSINDP277NEVE" alt="obj4" width="50px"/>
              <h3>R</h3>
            </div>
            <div className="infoObj4">
              <h6>Garras del Inmortal</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="obj5">
            <div className="imgObj5">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/attackPotion.svg?token=ALPT6YDY2XSYIMEV7M3JLC277NEB2" alt="obj5"width="50px"/>
              <h3>T</h3>
            </div>
            <div className="infoObj5">
              <h6>Poción de Sangre</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="obj6">
            <div className="imgObj6">
              <img src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/defensePotion.svg?token=ALPT6YCLUDVO7BEY3JEG6CK77NEFI" alt="obj5" width="50px"/>
              <h3>Y</h3>
            </div>
            <div className="infoObj6">
              <h6>Poción de Corrupción</h6>
              <h6>Ataque : X</h6>
              <h6>Defensa : X</h6>
            </div>
          </div>
          <div className="explicacion"></div>
        </div>
      </header>
    </div>
  );
}


export default App;
