//import logo from './logo.svg';
import { logo, up, left, down, right,vidaLogo, espadas, escudo, marco, maderita, noObj, nord, sud, este, oeste, bruju } from './assets';
import { avatars } from './assets/avatars';
import { corrupcion, hachasDestino, garras, kunai, lanza, muerte, sangre } from './assets/audio';
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
          imagen.style.height='300px';
          newInfo.appendChild(imagen);
          var node = document.createElement("div");
          node.className = 'life';
          node.id = 'life';
          node.innerHTML =  `<div className="corasong"> <img src='/static/media/corazon.d3bf3074.svg' alt='vida' height='30px'/>  </div> <div class="progress"><div role="progressbar" class="progress-bar bg-danger progress-bar-animated progress-bar-striped" aria-valuenow="`+(obj.vitalpoints*2)+`" aria-valuemin="0" aria-valuemax="100" style="width: `+(obj.vitalpoints*2)+`%;">`+(obj.vitalpoints)+`vp</div></div>`;
          newInfo.appendChild(node);
          console.log(obj);
          var selectedObject = document.createElement("img");
          selectedObject.id = "selectedObject";
          selectedObject.src = noObj;
          selectedObject.alt = 'selectedObject';
          selectedObject.style.height='50px';
          selectedObject.style.marginTop='30px';
          newInfo.appendChild(selectedObject);
          var objectInfo = document.createElement("p");
          objectInfo.id = 'objectName';
          objectInfo.textContent = 'Ningun objeto seleccionado';
          objectInfo.style.fontSize = '16px';
          objectInfo.style.marginTop='10px';
          objectInfo.style.fontWeight='bold';
          objectInfo.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
          newInfo.appendChild(objectInfo);
          var objectAttack = document.createElement("p");
          objectAttack.id = 'objectAttack';
          objectAttack.textContent = 'Ataque: -';
          objectAttack.style.fontSize = '14px';
          objectAttack.style.fontWeight='bold';
          objectAttack.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
          newInfo.appendChild(objectAttack);
          var objectDefense = document.createElement("p");
          objectDefense.id = 'objectDefense';
          objectDefense.textContent = 'Defensa: -';
          objectDefense.style.fontSize = '14px';
          objectDefense.style.fontWeight='bold';
          objectDefense.style.fontFamily = 'Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace';
          newInfo.appendChild(objectDefense);
          document.getElementById("player").appendChild(newInfo);
          
          
          var atk = document.createElement("p");
          atk.innerText('obj.attack');
          document.getElementById("ataque").appendChild(atk);

          var df = document.createElement("p");
          df.innerText('obj.defense');
          document.getElementById("defensa").appendChild(df);
          
          

          
          
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
          document.getElementsByClassName("left").style.transform = "scale(0.5)";
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
      case 81:
          var audio = new Audio(hachasDestino);
          audio.play();
          var newObj = 
          {
            name: 'Hachas del Destino',
            image: document.getElementById("imgObj1").src,
            attack: '9',
            defense: '-1'
          }
          console.log("Hachas del destino forjadas!");
          console.log("La muerte es como el viento... siempre a mi lado...");
          break;
      case 87:
          var audio = new Audio(kunai);
          audio.play();
          var newObj = 
          {
            name: 'Kunai Represor',
            image: document.getElementById("imgObj2").src,
            attack: '7',
            defense: '4'
          }
          console.log("Kunai represor ");
          console.log("Nunca se tienen demasiados kunai...");
          break;
      case 69:
          var audio = new Audio(lanza);
          audio.play();
          var newObj = 
          {
            name: 'Lanza Letal',
            image: document.getElementById("imgObj3").src,
            attack: '10',
            defense: '0'
          }
          console.log("Lanza letal forjada!");
          console.log("Huye! Y la lanza encontrará tu espalda...");
          break;
      case 82:
          var audio = new Audio(garras);
          audio.play();
          var newObj = 
          {
            name: 'Garras del inmortal',
            image: document.getElementById("imgObj4").src,
            attack: '16',
            defense: '-4'
          }
          console.log("Garras del inmortal forjadas!");
          console.log("Hmmm.... Siente el poder de la naturaleza");
          break;
      case 84:
          var audio = new Audio(sangre);
          audio.play();
          var newObj = 
          {
            name: 'Poción de sangre',
            image: document.getElementById("imgObj5").src,
            attack: '8',
            defense: '0'
          }
          console.log("Poción de sangre creada!");
          console.log("Rojos se tornarán los rios");
          break;
      case 89:
          
          var audio = new Audio(corrupcion);
          audio.play();
          var newObj = 
          {
            name: 'Poción de corrupción',
            image: document.getElementById("imgObj6").src,
            attack: '0',
            defense: '8'
          }
          console.log("Poción de corrupción creada!");
          console.log("Esto puede doler...");
          break;
      case 187:
          
          var audio = new Audio(muerte);
          audio.play();
          var newObj = 
          {
            name: 'Poción de corrupción',
            image: document.getElementById("imgObj6").src,
            attack: '0',
            defense: '8'
          }
          console.log("Poción de corrupción creada!");
          console.log("Esto puede doler...");
          break;
  }
  console.log(e.keyCode);
  //Q = 81
  //W = 87
  //E = 69
  //R = 82
  //T = 84
  //Y = 89
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
          <img src={marco} style={{width:'101.5%',height:'105.5%', transform: 'translateY(-5%)'}}/>
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
            <img src={up} style={{marginTop:"100%",width:'100px',display:'block'}}/> 
          </div>
          <div className="down"> 
            <img src={down} style={{marginBottom:"100%",width:'100px',display:'block'}}/> 
          </div>
          <div className="left"> 
            <img src={left} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
          <div className="right"> 
            <img src={right} style={{margin:'auto',width:'100px',display:'block'}}/> 
          </div>
        </div>
        <div className="bruju">
          
          <div className="nord">
            <img src={nord} style={{width:'55%', height:'55%'}}/>
          </div>

          <div className="sud">
            <img src={sud} style={{width:'55%', height:'55%'}}/>
          </div>

          <div className="oest">
            <img src={oeste} style={{width:'55%', height:'55%'}}/>
          </div>

          <div className="est">
            <img src={este} style={{width:'55%', height:'55%'}}/>
          </div>

          <div className="imgBruju">
            <img src={bruju} style={{width:'70%', height:'70%'}}/>
          </div>

          
        </div>
        
        <div className="stats" id="stats">
          <div className="ataque" id="ataque">
            <h4 style={{color: 'white'}}>Ataque:</h4>
            <img src= {espadas} style={{width: '40px'}} alt="espadas"/>
          </div>
          <div className="defensa" id="defensa">
            <h4 style={{color: 'white'}}>Defensa:</h4>
            <p id="txtDef"></p>
            <img src= {escudo} style={{width: '40px'}} alt="escudo"/>
          </div>
        </div>
        <div className="objetos">
          <div className="obj1">
            <div className="imgObj1">
              <img id="imgObj1" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/axe.svg?token=ALPT6YAHZPFG6CIJQ5ZXXY277NEO2" alt="obj1" width="50px"/>
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
              <img id="imgObj2" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/kunai.svg?token=ALPT6YE3XKRBYDZIKYFGFPS77NET6" alt="obj2" width="50px"/>
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
              <img id="imgObj3" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/spear.svg?token=ALPT6YCQJB627XIZ6Q2COTC77NEUS" alt="obj3" width="50px"/>
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
              <img id="imgObj4" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/weapon.svg?token=ALPT6YHHTINJ635FRSINDP277NEVE" alt="obj4" width="50px"/>
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
              <img id="imgObj5" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/attackPotion.svg?token=ALPT6YDY2XSYIMEV7M3JLC277NEB2" alt="obj5"width="50px"/>
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
              <img id="imgObj6" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/defensePotion.svg?token=ALPT6YCLUDVO7BEY3JEG6CK77NEFI" alt="obj5" width="50px"/>
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
