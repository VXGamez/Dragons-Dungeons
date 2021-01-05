//import logo from './logo.svg';
import { logo, up, left, down, right, espadas, escudo, marco, noObj, nord, sud, este, oeste, brujuNord, brujuSud, brujuOest, brujuEst, papeliko } from './assets';
import { avatars } from './assets/avatars';
import { corrupcion, hachasDestino, garras, kunai, lanza, muerte, sangre } from './assets/audio';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




const constantes = {
  TOKEN: "b89f96d2",
  PLAYER_INFO: 
  {
    x: "",
    y: "",
    player_token : "",
    security_code: "",
    direction: ""
  },
  ObjectCooldown: 0
}

//var estoyVivo = 0;

window.onload = function() {
  var imagen = document.getElementById("imagenFondo");
  var loDemas = document.getElementById("header");
  imagen.style.height = loDemas.style.height;
};

window.scrollTo(0, 0);

function makeRequest (method, url, obj) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
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
    if(method==='POST'){
      
      xhr.setRequestHeader('Content-type', 'application/json');

      var form = new FormData();
      form.append('name', obj.name);
      form.append('image', obj.image);
      form.append('attack', obj.attack);
      form.append('defense', obj.defense);

      console.log('FORM CREAT: ' + JSON.stringify(form));
      
      xhr.send(form);
    }else{
      xhr.send();
    }
  });
}

function showMiniMap(){

  makeRequest('GET', 'http://battlearena.danielamo.info/api/map/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
  .then(function (datums) {
    
    var obj = JSON.parse(datums);
    var total = obj.enemies.length;
    let j = 0, i=0;

    //ctx.clearRect(0, 0, c.width, c.height);
    var w = document.getElementById("myCanvas").clientWidth;
    var h = document.getElementById("myCanvas").clientHeight;
    var c = document.getElementById("myCanvas");
    c.width  = c.offsetWidth;
    c.height = c.offsetHeight;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000"; 
    for(j = 0; j < total; j++) {
      ctx.fillRect((w/40)*obj.enemies[j].x, h-((h/40)*obj.enemies[j].y), w/40 - 2 , h/40 - 2);
    }
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect((w/40)*constantes.PLAYER_INFO.x, h-((h/40)*constantes.PLAYER_INFO.y), w/40 - 2 , h/40 - 2);
    
})
  .catch(function (err) {
    console.log('Augh, there was an error!', err.statusText);
  });

}


function nuevaPartida(){


  if(constantes.PLAYER_INFO.player_token === "" && constantes.PLAYER_INFO.security_code === "" ){
    var nom = prompt('Introduce el nombre de tu jugador:', '');
    if(nom!=null){

      
      makeRequest('GET', 'http://battlearena.danielamo.info/api/spawn/'+constantes.TOKEN+'/'+nom, null)
      .then(function (datums) {
          var obj = JSON.parse(datums);
          constantes.PLAYER_INFO.player_token = obj.token;
          constantes.PLAYER_INFO.security_code = obj.code;
          
          console.log('Jugador Creado!\nToken: ' + constantes.PLAYER_INFO.player_token + '\nCodigo de Seguridadad: ' + constantes.PLAYER_INFO.security_code);

          makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            //estoyVivo = 1;
            constantes.PLAYER_INFO.x = obj.x;
            constantes.PLAYER_INFO.y = obj.y;
            constantes.PLAYER_INFO.direction = obj.direction;
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
            imagen.style.height='35%';
            imagen.style.width='35%';
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
            selectedObject.style.height='10%';
            selectedObject.style.width='10%';
            selectedObject.style.marginTop='15px';
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
            
            
            var atk = document.getElementById("atk");
            atk.textContent = obj.attack;

            var df = document.getElementById("df")
            df.textContent = obj.defense;
            
            showMiniMap();

          
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
    makeRequest('GET', 'http://battlearena.danielamo.info/api/remove/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token+'/'+constantes.PLAYER_INFO.security_code, null)
    .then(function (datums) {

      document.querySelector('#player').innerHTML= '';
    
      
      constantes.PLAYER_INFO.player_token = "";
      constantes.PLAYER_INFO.security_code = "";

      var atk = document.getElementById("atk");
      atk.textContent = '--';

      var df = document.getElementById("df")
      df.textContent = '--';


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

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

  


document.onkeydown = function(e){
  switch (e.keyCode) {
    case 37:
        console.log("El personaje se mueve a la izquierda");
        document.getElementById("left").style.transform = "scale(0.8)";
        e.preventDefault();
        break;
    case 38:
        console.log("El personaje se mueve hacia delante");
        document.getElementById("up").style.transform = "scale(0.8)";
        e.preventDefault();
        break;
    case 39:
        console.log("El personaje se mueve a la derecha");
        document.getElementById("right").style.transform = "scale(0.8)";
        e.preventDefault();
        break;
    case 40:
        console.log("El personaje se mueve hacia atras");
        document.getElementById("down").style.transform = "scale(0.8)";
        e.preventDefault();
        break;
    default:
      break;
  }
}



document.onkeyup = function(e) {
  var newObj;
  var created = 0;
  var audio;
  var direction;
  if(constantes.PLAYER_INFO.player_token === "" || constantes.PLAYER_INFO.security_code === "" ){
    if(e.keyCode!==37 &&e.keyCode!==38&&e.keyCode!==39&&e.keyCode!==40 ){
      console.log('Crea un jugador primero!');
    }
  }else{
    created=1;
  }
    switch (e.keyCode) {
      case 32:
        if(created===1){
          console.log('Estas atacando en la dirección ' + constantes.PLAYER_INFO.direction);
          makeRequest('GET', 'http://battlearena.danielamo.info/api/attack/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token + '/' + constantes.PLAYER_INFO.direction, null)
          .then(function (datums) {
              var obj = JSON.parse(datums);
              console.log('ES BIEN:' + JSON.stringify(obj));
          })
          .catch(function (err){
            console.log('ES MAL:' + JSON.stringify(err));
          });

        }
        break;
      case 37:
        constantes.PLAYER_INFO.direction = 'O';
        created=3;
        direction = 'O';
        sleep(100).then(() => {
          document.getElementById("left").style.transform = "scale(1)";
          document.getElementById("imgBruju").src = {brujuOest};
   
        });    
       
        break;
      case 38:
        constantes.PLAYER_INFO.direction = 'N';
        created=3;
        direction = 'N';
        sleep(100).then(() => {
          document.getElementById("up").style.transform = "scale(1)";
        });  
        break;
      case 39:
        constantes.PLAYER_INFO.direction = 'E';
        created=3;
        direction = 'E';
        sleep(100).then(() => {
          document.getElementById("right").style.transform = "scale(1)";
        }); 
        break;
      case 40:
        constantes.PLAYER_INFO.direction = 'S';
        created=3;
        direction = 'S';
        sleep(100).then(() => {
          document.getElementById("down").style.transform = "scale(1)";
        }); 
        break;
      case 81:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj1").style.transform = "scale(0.9)";
            audio = new Audio(hachasDestino);
            audio.play();
            newObj = 
            {
              name: 'Hachas del Destino',
              image: document.getElementById("imgObj1").src,
              attack: '9',
              defense: '-1'
            };
            created = 2;
            console.log("Hachas del destino forjadas!");
            console.log("La muerte es como el viento... siempre a mi lado...");
            sleep(1000).then(() => {
              document.getElementById("obj1").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 87:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj2").style.transform = "scale(0.9)";
            audio = new Audio(kunai);
            audio.play();
            newObj = 
            {
              name: 'Kunai Represor',
              image: document.getElementById("imgObj2").src,
              attack: '7',
              defense: '4'
            };
            created = 2;
            console.log("Kunai represor ");
            console.log("Nunca se tienen demasiados kunai...");
            sleep(1000).then(() => {
              document.getElementById("obj2").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 69:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj3").style.transform = "scale(0.9)";
            audio = new Audio(lanza);
            audio.play();
            newObj = {
              name: 'Lanza Letal',
              image: document.getElementById("imgObj3").src,
              attack: '10',
              defense: '0'
            };
            created = 2;
            console.log("Lanza letal forjada!");
            console.log("Huye! Y la lanza encontrará tu espalda...");
            sleep(1000).then(() => {
              document.getElementById("obj3").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 82:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj4").style.transform = "scale(0.9)";
            audio = new Audio(garras);
            audio.play();
            newObj = {
              name: 'Garras del inmortal',
              image: document.getElementById("imgObj4").src,
              attack: '16',
              defense: '-4'
            };
            created = 2;
            console.log("Garras del inmortal forjadas!");
            console.log("Hmmm.... Siente el poder de la naturaleza");
            sleep(1000).then(() => {
              document.getElementById("obj4").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 84:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj5").style.transform = "scale(0.9)";
            audio = new Audio(sangre);
            audio.play();
            newObj = 
            {
              name: 'Poción de sangre',
              image: document.getElementById("imgObj5").src,
              attack: '8',
              defense: '0'
            }
            created = 2;
            console.log("Poción de sangre creada!");
            console.log("Rojos se tornarán los rios");
            sleep(1000).then(() => {
              document.getElementById("obj5").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 89:
          if(created===1 && constantes.ObjectCooldown===0){
            document.getElementById("obj6").style.transform = "scale(0.9)";
            audio = new Audio(corrupcion);
            audio.play();
            newObj = 
            {
              name: 'Poción de Rabia',
              image: document.getElementById("imgObj6").src,
              attack: '0',
              defense: '8'
            }
            created = 2;
            console.log("Poción de Rabia creada!");
            console.log("Esto puede doler...");
            sleep(1000).then(() => {
              document.getElementById("obj6").style.transform = "scale(1)";
            });  
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      case 187:
          if(created===1 && constantes.ObjectCooldown===0){
            audio = new Audio(muerte);
            audio.play();
            newObj = 
            {
              name: 'Masacre a Porrazos',
              image: 'https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/machuahuitl.svg?token=ALPT6YEGJSUHD2OT7SKUZLC77QYDC',
              attack: '60',
              defense: '60'
            }
            created = 2;
            console.log("Masacre a Porrazos");
            console.log("Vivo para dar muerte");
          }else if(constantes.ObjectCooldown===1){
            console.log('Espera para poder volver a crear un objeto!');
          }
          break;
      default:
        break;
  }

  if(created===2){
      disableKeypresses();
      console.log(newObj);
      makeRequest('POST', 'http://battlearena.danielamo.info/api/craft/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, newObj)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            console.log(JSON.stringify(obj));
          })
          .catch(function (err){
            console.log('Error: ' + JSON.stringify(err));
          });

      /*makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            console.log(obj);
          });*/
      console.log('objeto creado');
      created=0;
  }else if(created===3){
    console.log('DIRECTION: ' + direction);
    makeRequest('GET', 'http://battlearena.danielamo.info/api/move/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token + '/' +direction, null)
    .then(function (datums) {
        /*var obj = JSON.parse(datums);*/
        /*console.log('ES BIEN:' + JSON.stringify(obj));*/
       
        sleep(1000).then(() => {
          makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            constantes.PLAYER_INFO.x = obj.x;
            constantes.PLAYER_INFO.y = obj.y;
          });

          showMiniMap();
        }); 
    })
    .catch(function (err){
      console.log('ES MAL:' + err);
    });
    created=0;
  }

}



function disableKeypresses(){
  constantes.ObjectCooldown = 1;
  
  var obj1 = document.getElementById("obj1");
  var objAnterior1 = obj1.innerHTML;
  var estilAnterior1 = obj1.style;
  obj1.opacity = '1';
  obj1.style.background = 'black';
  obj1.style.animation = 'cooldown 10s ease';

  var obj2 = document.getElementById("obj2");
  var objAnterior2 = obj2.innerHTML;
  var estilAnterior2 = obj2.style;
  obj2.opacity = '1';
  obj2.style.background = 'black';
  obj2.style.animation = 'cooldown 10s ease';

  var obj3 = document.getElementById("obj3");
  var objAnterior3 = obj3.innerHTML;
  var estilAnterior3 = obj3.style;
  obj3.opacity = '1';
  obj3.style.background = 'black';
  obj3.style.animation = 'cooldown 10s ease';
  
  var obj4 = document.getElementById("obj4");
  var objAnterior4 = obj4.innerHTML;
  var estilAnterior4 = obj4.style;
  obj4.opacity = '1';
  obj4.style.background = 'black';
  obj4.style.animation = 'cooldown 10s ease';
  
  var obj5 = document.getElementById("obj5");
  var objAnterior5 = obj5.innerHTML;
  var estilAnterior5 = obj5.style;
  obj5.opacity = '1';
  obj5.style.background = 'black';
  obj5.style.animation = 'cooldown 10s ease';

  var obj6 = document.getElementById("obj6");
  var objAnterior6 = obj6.innerHTML;
  var estilAnterior6 = obj6.style;
  obj6.opacity = '1';
  obj6.style.background = 'black';
  obj6.style.animation = 'cooldown 10s ease';

  setTimeout(function(){
    obj1.innerHTML = objAnterior1;
    obj1.style = estilAnterior1;

    obj2.innerHTML = objAnterior2;
    obj2.style = estilAnterior2;

    obj3.innerHTML = objAnterior3;
    obj3.style = estilAnterior3;

    obj4.innerHTML = objAnterior4;
    obj4.style = estilAnterior4;

    obj5.innerHTML = objAnterior5;
    obj5.style = estilAnterior5;

    obj6.innerHTML = objAnterior6;
    obj6.style = estilAnterior6;


    constantes.ObjectCooldown = 0;
  },10000);
  
}


function App() {
  return (
    <div className="App">

      <img id="imagenFondo" src={papeliko} className="imagenFondo" alt="imagen de fondo" />
      
      <header id="header" className="App-header">
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
          <img className="marquito" src={marco} alt="marquito"/>
          <div className="escena" id="escena"></div>
        
          <div className="bruju">
          
            <div className="nord">
              <img src={nord} alt="nord" style={{width:'55%', height:'55%'}}/>
            </div>

            <div className="sud">
              <img src={sud} alt="sud" style={{width:'55%', height:'55%'}}/>
            </div>

            <div className="oest">
              <img src={oeste} alt="oeste" style={{width:'55%', height:'55%'}}/>
            </div>

            <div className="est">
              <img src={este} alt="este" style={{width:'55%', height:'55%'}}/>
            </div>

            <div className="imgBruju" id="imgBruju">
              <img src={brujuNord} alt="bruju" style={{width:'70%', height:'70%'}}/>
            </div>         
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
          <div className="up" id="up"> 
            <img src={up} alt='up' style={{height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="down" id="down"> 
            <img src={down} alt='down' style={{height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="left" id="left"> 
            <img src={left} alt="left" style={{height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="right" id="right"> 
            <img src={right} alt="right" style={{height: "100%", width: "100%",display:'block'}}/> 
          </div>
        </div>

      <div className="mini">
        <canvas className="miniMapa" id="myCanvas" width="100%" height="100%"></canvas>
      </div>
        
       
        <div className="stats" id="stats">
          <div className="ataque" id="ataque">
            <h4 style={{color: 'black', marginRight: '2%', fontSize: '4vh'}}>Ataque:</h4>
            <p id="atk">--</p>
            <img src= {espadas} style={{width: '10%', marginLeft: '5%'}} alt="espadas"/>
          </div>
          <div className="defensa" id="defensa">
            <h4 style={{color: 'black', marginRight: '2%', fontSize: '4vh'}}>Defensa:</h4>
            <p id="df">--</p>
            <img src= {escudo} style={{width: '10%', marginLeft: '5%'}} alt="escudo"/>
          </div>
        </div>

        
        <div className="objetos">
          <div id="obj1" className="obj1">
            <img id="imgObj1" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/axe.svg?token=ALPT6YAHZPFG6CIJQ5ZXXY277NEO2" alt="obj1" width="100%"/>
            <p className="objectTitle">Hachas del destino (Q)</p>
            <p>Ataque : 9</p>
            <p>Defensa : -1</p>
          </div>
          <div id="obj2" className="obj2">
            <img id="imgObj2" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/kunai.svg?token=ALPT6YE3XKRBYDZIKYFGFPS77NET6" alt="obj2" width="100%"/>
            <p className="objectTitle">Kunai Represor (W)</p>
            <p>Ataque : 7</p>
            <p>Defensa : 4</p>
          </div>
          <div id="obj3" className="obj3">
            <img id="imgObj3" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/spear.svg?token=ALPT6YCQJB627XIZ6Q2COTC77NEUS" alt="obj3" width="100%"/>
            <p className="objectTitle">Lanza Letal (E)</p>
            <p>Ataque : 10</p>
            <p>Defensa : 0</p>
          </div>
          <div id="obj4" className="obj4">
            <img id="imgObj4" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/weapon.svg?token=ALPT6YHHTINJ635FRSINDP277NEVE" alt="obj4" width="100%"/>
            <p className="objectTitle">Garras Inmortales (R)</p>
            <p>Ataque : 16</p>
            <p>Defensa : -4</p>
          </div>
          <div id="obj5" className="obj5">
            <img id="imgObj5" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/attackPotion.svg?token=ALPT6YDY2XSYIMEV7M3JLC277NEB2" alt="obj5"width="100%"/>
            <p className="objectTitle">Poción Sangre (T)</p>
            <p>Ataque : 8</p>
            <p>Defensa : 0</p>
          </div>
          <div id="obj6" className="obj6">
            <img id="imgObj6" src="https://raw.githubusercontent.com/VXGamez/P2-PW/main/src/assets/objects/defensePotion.svg?token=ALPT6YCLUDVO7BEY3JEG6CK77NEFI" alt="obj6" width="100%"/>
            <p className="objectTitle">Poción Rabia (Y)</p>
            <p>Ataque : 0</p>
            <p>Defensa : 8</p>
          </div>
        </div> 

      </header>
    </div>
  );
}


export default App;
