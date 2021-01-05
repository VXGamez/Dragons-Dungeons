//import logo from './logo.svg';
import { logo, up, left, down, right, space, espadas, escudo, marco, noObj, nord, sud, este, oeste, brujuNord, brujuSud, brujuOest, brujuEst, papeliko, pared, noPared, splash } from './assets';
import { avatars } from './assets/avatars';
import { corrupcion, hachasDestino, garras, kunai, lanza, muerte, sangre, background } from './assets/audio';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'



const constantes = {
  TOKEN: "b89f96d2",
  PLAYER_INFO: 
  {
    x: "",
    y: "",
    player_token : "",
    security_code: "",
    direction: "",
    vp: ""
  },
  ObjectCooldown: 0
}

var intervalID;
var backgroundMusic;
var alerta=0;
let found=0;
var objectIdentifier;
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
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      var newName = obj.name.replace(" ", "+");
      let form = 'name='+newName+'&image='+obj.image+'&attack='+obj.attack+'&defense='+obj.defense;
      xhr.send(form);
    }else{
      if(obj){
        xhr.send(obj);
      }else{
        xhr.send();
      }
    }
  });
}



function findEnemy(){
  makeRequest('GET', 'http://battlearena.danielamo.info/api/playersobjects/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
  .then(function (datums) {
    var obj = JSON.parse(datums);
    var total = obj.enemies.length;
    var imagen = document.getElementById("enemyAct");
    found = 0;
    let k = 0;
   
    var vidaEnemic=0;
    for(k = 0; k < total; k++){
      if(constantes.PLAYER_INFO.x === obj.enemies[k].x && constantes.PLAYER_INFO.y === obj.enemies[k].y && obj.enemies[k].vitalpoints > 0){
        imagen.src = avatars[obj.enemies[k].image - 1];
        vidaEnemic = obj.enemies[k].vitalpoints;
        imagen.style.display = "inline";
        found = 1;
        break;
      } 
    }
    var antiguo = document.getElementById("enemyLife");

    if(found===0){
      for(k = 0; k < obj.objects.length; k++){
        if(constantes.PLAYER_INFO.x === obj.objects[k].x && constantes.PLAYER_INFO.y === obj.objects[k].y){
          imagen.src = obj.enemies[k].image;
          objectIdentifier = obj.enemies[k].token;
          imagen.style.display = "inline";
          found = 1;
          break;
        }
      }
      if(found===0){
        imagen.src = "//:0";
        imagen.style.display = "none";
        if(antiguo){
          antiguo.outerHTML = '';
        }
      }
    }else{
      if(antiguo){
        antiguo.outerHTML = '';
      }
      var parent = document.getElementById("eneimgo");
      var divString = `<div id="enemyLife" class="progress"><div id="enemyLifeInner" role="progressbar" class="progress-bar bg-danger progress-bar-animated progress-bar-striped" aria-valuenow="`+(vidaEnemic*2)+`" aria-valuemin="0" aria-valuemax="100" style="width: `+(vidaEnemic*2)+`%;">`+(vidaEnemic)+`vp</div></div>`;
      var newInner = divString.concat(parent.innerHTML);
      parent.innerHTML = newInner;
    }

  })
  .catch(function (err) {
    console.log('Augh, there was an error finding enemies!', err.statusText);
  });
}


function actuLife(){

  let reborn = 0;
  //console.log('FounD ES: ' + found);
  if(found!==0){


      makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
    .then(function (datums) {
      var obj = JSON.parse(datums);
     

      if(obj.vitalpoints <=0){
        Swal.fire({
          title: 'Has mort!',
          text: "Vols fer respawn o acabar la partida?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Vull acabar la partida',
          confirmButtonText: 'Respawn',
        }).then((result) => {
          if (result.isConfirmed) {
            makeRequest('GET', 'http://battlearena.danielamo.info/api/respawn/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token+'/'+constantes.PLAYER_INFO.security_code, null)
            .then(function (datums) {
              console.log('Has revivido!');
              reborn = 1;


            })
            .catch(function (err) {
              console.log('Error respawinig', err.statusText);
            });
          }
        });

        /*if(reborn === 0){
          makeRequest('GET', 'http://battlearena.danielamo.info/api/remove/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token+'/'+constantes.PLAYER_INFO.security_code, null)
          .then(function (datums) {
            Swal.fire(
              'THE END',
              'Hasta la próxima!',
              'success'
            )
          })
          .catch(function (err) {
            console.log('Error removing', err.statusText);
          });
          
        }*/
  
        reborn = 0;
      } else {

        if(constantes.PLAYER_INFO.vp < obj.vitalpoints){
          console.log('Me han quitado' + (constantes.PLAYER_INFO.vp - obj.vitalpoints) + 'puntos de vida');
        }
        var barra = document.getElementById("barraDeLosHuevos");
        barra.ariaValueNow=(obj.vitalpoints*2);
        barra.style.width=  (obj.vitalpoints*2)+'%';
        barra.innerHTML = (obj.vitalpoints)+'vp';
        constantes.PLAYER_INFO.vp = obj.vitalpoints;
      }

    })
    .catch(function (err) {
      console.log('Augh, there was an error downloading the map!', err.statusText);
    });

  }

  
}

function showMiniMap(){


  actuLife();
  
  
  makeRequest('GET', 'http://battlearena.danielamo.info/api/map/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
  .then(function (datums) {
    
    var obj = JSON.parse(datums);
    var total = obj.enemies.length;
    let j = 0;

    
    var w = document.getElementById("myCanvas").clientWidth;
    var h = document.getElementById("myCanvas").clientHeight;
    var c = document.getElementById("myCanvas");
    c.width  = c.offsetWidth;
    c.height = c.offsetHeight;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width*2, c.height*2);
    ctx.scale(0.91, 0.92);
    ctx.fillStyle = "#FF0000"; 
    for(j = 0; j < total; j++) {
      ctx.fillRect((w/37)*obj.enemies[j].x+5, h-((h/37)*obj.enemies[j].y)+15, w/37 - 2 , h/37 - 2);
    }
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect((w/37)*constantes.PLAYER_INFO.x+5, h-((h/37)*constantes.PLAYER_INFO.y)+15, w/37 - 2 , h/37 - 2);
    
})
  .catch(function (err) {
    console.log('Augh, there was an error downloading the map!', err.statusText);
  });

}

function alertNovaPartida(){
  if(constantes.PLAYER_INFO.player_token === "" && constantes.PLAYER_INFO.security_code === "" ){
    alerta = 1;
    Swal.fire({
      title: "Nueva Partida",
      text: "Introduce el nombre de tu jugador: ",
      input: 'text',
      showCancelButton: true        
      }).then((result) => {
        if (result.value) {
            console.log("Result: " + result.value);
            var nom = result.value;
            nuevaPartida(nom);
        }
    });
  }else{
    console.log('Ya has hecho spawn de un jugador!');
  }
  
}


function nuevaPartida(nom){
  
  document.getElementById("log").innerHTML = '';
  if(constantes.PLAYER_INFO.player_token === "" && constantes.PLAYER_INFO.security_code === "" ){
    
    //var nom = prompt('Introduce el nombre de tu jugador:', '');

    if(nom!=null){
      alerta = 0;

      makeRequest('GET', 'http://battlearena.danielamo.info/api/spawn/'+constantes.TOKEN+'/'+nom, null)
      .then(function (datums) {

          
          var pergamino1 = document.getElementById('imagenFondo');
          pergamino1.style.display = 'flex';
          pergamino1.style.animationFillMode = 'forwards';
          pergamino1.style.animation = 'slideUp 1s ease';

          var pergamino2 = document.getElementById('imagenFondoDerecha');
          pergamino2.style.display = 'flex';
          pergamino2.style.animationFillMode = 'forwards';
          pergamino2.style.animation = 'slideUp 1s ease';

          var terminal = document.getElementById('terminal');
          terminal.style.display = 'inline';
          terminal.style.animationFillMode = 'forwards';
          terminal.style.animation = 'aparecer 2s ease';

          var bruju = document.getElementById('bruju');
          bruju.style.display = 'grid';
          bruju.style.animationFillMode = 'forwards';
          bruju.style.animation = 'aparecer 2s ease';

          sleep(1000).then(function(){
            var miniMapa = document.getElementById('mini');
            miniMapa.style.display = 'flex';
            miniMapa.style.animationFillMode = 'forwards';
            miniMapa.style.animation = 'aparecer 2s ease';
          
            var estadisticas = document.getElementById('stats');
            estadisticas.style.display = 'flex';
            estadisticas.style.flexDirection = 'column';
            estadisticas.style.animationFillMode = 'forwards';
            estadisticas.style.animation = 'aparecer 2s ease';
          
            var objetos = document.getElementById('objetos');
            objetos.style.display = 'grid';
            objetos.style.animationFillMode = 'forwards';
            objetos.style.animation = 'aparecer 2s ease';

            var control = document.getElementById('control');
            control.style.display = 'grid';
            control.style.animationFillMode = 'forwards';
            control.style.animation = 'aparecer 2s ease';

            var player = document.getElementById('player');
            player.style.display = 'flex';
            player.style.animationFillMode = 'forwards';
            player.style.animation = 'aparecer 2s ease';
          });
          
        
          


          backgroundMusic = new Audio(background);
          backgroundMusic.volume = 0;
          //backgroundMusic.animate.volume = '0.3 2000';
          backgroundMusic.currentTime = Math.floor(Math.random() * (5429));
          backgroundMusic.play();
          var vol=0;
          var fadeIn = setInterval(
            function() {
              if (vol < 0.1) {
                vol += 0.02;
                backgroundMusic.volume = vol;
              }
              else {
                clearInterval(fadeIn);
              }
            }, 500);
          
          var obj = JSON.parse(datums);
          constantes.PLAYER_INFO.player_token = obj.token;
          constantes.PLAYER_INFO.security_code = obj.code;


          intervalID = window.setInterval(showMiniMap, 1000);

          makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            //estoyVivo = 1;
            constantes.PLAYER_INFO.x = obj.x;
            constantes.PLAYER_INFO.y = obj.y;
            constantes.PLAYER_INFO.vp = obj.vitalpoints;
            constantes.PLAYER_INFO.direction = obj.direction;
            var xd = 'dir:'+obj.x+'-'+obj.direction;
            var yd = 'dir:'+obj.y+'-'+obj.direction;
            if((xd==='dir:0-O') || (xd==='dir:39-E') || (yd==='dir:0-S') || (yd==='dir:39-N')){
              document.getElementById("escena").style.backgroundImage = 'url('+pared+')';
            }else{
              document.getElementById("escena").style.backgroundImage = 'url('+noPared+')';
            }
            var newInfo = document.createElement("div");
            newInfo.id = 'informasion';
            //newInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.365)';
            newInfo.style.width = '90%';
            newInfo.style.height = '90%';
            newInfo.style.color = 'black';
            newInfo.style.fonFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            var name = document.createElement("h2");
            name.id = 'nombrePlayer';
            name.innerText = obj.name;
            name.style.fonFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            newInfo.appendChild(name);
            var imagen = document.createElement("img");
            imagen.src = avatars[obj.image-1];
            imagen.className = 'characterImage';
            imagen.alt = 'characterImage';
            imagen.style.height='35%';
            imagen.style.width='35%';
            imagen.style.fonFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            newInfo.appendChild(imagen);
            var node = document.createElement("div");
            node.className = 'life';
            node.id = 'life';
            node.innerHTML =  `<div className="corasong"> <img src='/static/media/corazon.d3bf3074.svg' alt='vida' height='30px'/>  </div> <div class="progress"><div id="barraDeLosHuevos" role="progressbar" class="progress-bar bg-danger progress-bar-animated progress-bar-striped" aria-valuenow="`+(obj.vitalpoints*2)+`" aria-valuemin="0" aria-valuemax="100" style="width: `+(obj.vitalpoints*2)+`%;">`+(obj.vitalpoints)+`vp</div></div>`;
            newInfo.appendChild(node);
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
            objectInfo.style.fontFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            newInfo.appendChild(objectInfo);
            var objectAttack = document.createElement("p");
            objectAttack.id = 'objectAttack';
            objectAttack.textContent = 'Ataque: -';
            objectAttack.style.fontSize = '14px';
            objectAttack.style.fontWeight='bold';
            objectAttack.style.fontFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            newInfo.appendChild(objectAttack);
            var objectDefense = document.createElement("p");
            objectDefense.id = 'objectDefense';
            objectDefense.textContent = 'Defensa: -';
            objectDefense.style.fontSize = '14px';
            objectDefense.style.fontWeight='bold';
            objectDefense.style.fontFamily = '"Papyrus", "Palatino Linotype", "Book Antiqua", "Palatino", Serif';
            newInfo.appendChild(objectDefense);
            document.getElementById("player").appendChild(newInfo);
            
            
            var atk = document.getElementById("atk");
            atk.textContent = obj.attack;

            var df = document.getElementById("df");
            df.textContent = obj.defense;

            var bru = document.getElementById("imgBruju");


            switch(constantes.PLAYER_INFO.direction){
              case  'N':
                bru.src = brujuNord;
                break;
              case 'O':
                bru.src = brujuOest;
                break;
              case 'E':
                bru.src = brujuEst;
                break;
              case 'S':
                bru.src = brujuSud;
                break;
              default:
                break;
            }
            
            showMiniMap();
            findEnemy();

          
          })
          .catch(function (err) {
              console.log('Augh, there was an error getting player info!', err.statusText);
          });

      })
      .catch(function (err) {
          console.log('Augh, there was an error spawning player!', err.statusText);
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
      
      var vol=0.1;
      var fadeOut = setInterval(
        function() {
          if (vol-0.025 > 0) {
            vol -= 0.025;
            backgroundMusic.volume = vol;
          }
          else {
            backgroundMusic.volume = 0;
            backgroundMusic.pause();
            clearInterval(fadeOut);
          }
        }, 500);
      
      
      window.clearInterval(intervalID);

      document.getElementById("log").innerHTML = '';
     

      var miniMapa = document.getElementById('mini');
      miniMapa.style.animationFillMode = 'forwards';
      miniMapa.style.animation = 'meVoy 2s ease';
    
      var estadisticas = document.getElementById('stats');
      estadisticas.style.display = 'flex';
      estadisticas.style.flexDirection = 'column';
      estadisticas.style.animationFillMode = 'forwards';
      estadisticas.style.animation = 'meVoy 2s ease';
    
      var objetos = document.getElementById('objetos');
      objetos.style.animationFillMode = 'forwards';
      objetos.style.animation = 'meVoy 2s ease';

      var control = document.getElementById('control');
      control.style.animationFillMode = 'forwards';
      control.style.animation = 'meVoy 2s ease';

      var player = document.getElementById('player');
      player.style.animationFillMode = 'forwards';
      player.style.animation = 'meVoy 2s ease';

      var terminal = document.getElementById('terminal');
      terminal.style.animationFillMode = 'forwards';
      terminal.style.animation = 'meVoy 2s ease';

      var bruju = document.getElementById('bruju');
      bruju.style.animationFillMode = 'forwards';
      bruju.style.animation = 'meVoy 2s ease';

    var pergamino1 = document.getElementById('imagenFondo');
    var pergamino2 = document.getElementById('imagenFondoDerecha');
    sleep(2000).then(function(){
      player.style.display = 'none';
      miniMapa.style.display = 'none';
      bruju.style.display = 'none';
      terminal.style.display = 'none';
      estadisticas.style.display = 'none';
      control.style.display = 'none';
      objetos.style.display = 'none';

      document.getElementById("escena").style.backgroundImage = 'url('+splash+')';


      document.querySelector('#player').innerHTML= '';

      pergamino1.style.animationFillMode = 'forwards';
      pergamino1.style.animation = 'slideDown 1s ease';

      pergamino2.style.animationFillMode = 'forwards';
      pergamino2.style.animation = 'slideDown 1s ease';
    });
    
    sleep(3000).then(function(){
      pergamino1.style.display = 'none';
      pergamino2.style.display = 'none';
    });
    


      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width*2, c.height*2);

      constantes.PLAYER_INFO.player_token = "";
      constantes.PLAYER_INFO.security_code = "";

      var atk = document.getElementById("atk");
      atk.textContent = '--';

      var df = document.getElementById("df");
      df.textContent = '--';
      
      var imagen = document.getElementById("enemyAct");
      imagen.src = "//:0";
      imagen.style.display = "none";
      


      console.log('Jugador Eliminado');
    })
    .catch(function (err) {
        console.log('Augh, there was an error removing player!', err.statusText);
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
  if(constantes.PLAYER_INFO.player_token === "" || constantes.PLAYER_INFO.security_code === "" || alert===1){
    
  }else{
    switch (e.keyCode) {
      case 32:
          document.getElementById("space").style.transform = "scale(0.8)";
          e.preventDefault();
          break;
      case 37:
          document.getElementById("left").style.transform = "scale(0.8)";
          e.preventDefault();
          break;
      case 38:
          document.getElementById("up").style.transform = "scale(0.8)";
          e.preventDefault();
          break;
      case 39:
          document.getElementById("right").style.transform = "scale(0.8)";
          e.preventDefault();
          break;
      case 40:
          document.getElementById("down").style.transform = "scale(0.8)";
          e.preventDefault();
          break;
      default:
        break;
    }
  }
}


document.onkeyup = function(e) {
  var newObj;
  var created = 0;
  var audio;
  var direction;
  
  if(alerta===0){
    if(constantes.PLAYER_INFO.player_token === "" || constantes.PLAYER_INFO.security_code === "" ){
      console.log('Crea un jugador primero!');
    }else{
      created=1;
    }
  }
  
    switch (e.keyCode) {
      case 80:
        if(created===1){
          //AQUI COHER EL OBJETO ERMANO
          if(objectIdentifier){
            makeRequest('http://battlearena.danielamo.info/api/pickup/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, objectIdentifier)
            .then(function(data){
              console.log('objeto cogido' + JSON.stringify(data));
            })
            .catch(function(error){
              console.log('Error cogido' + JSON.stringify(error));
            });
          }else{
            console.log('No hay objetos para coger');
          }
          
        }
        break;
      case 32:
        if(created===1){ 
          makeRequest('GET', 'http://battlearena.danielamo.info/api/attack/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token + '/' + constantes.PLAYER_INFO.direction, null)
          .then(function (datums) {
              var obj = JSON.parse(datums);
              console.log('Hay un enemigo en la dirección ' + constantes.PLAYER_INFO.direction +'! Le has hecho ' +JSON.stringify(obj) + ' puntos de daño!');
              

              var barraEnemigo = document.getElementById("enemyLifeInner");
              var vidaActual = barraEnemigo.ariaValueNow;

              
              barraEnemigo.ariaValueNow=vidaActual-(obj*2);
              barraEnemigo.style.width=  (vidaActual-(obj*2))+'%';
              barraEnemigo.innerHTML = ((vidaActual/2)-obj)+'vp';
              if(vidaActual-(obj*2)<=0){
                document.getElementById("enemyAct").src = "//:0";
                document.getElementById("enemyAct").style.display = 'none';
                var antiguo = document.getElementById("enemyLife");
                if(antiguo){
                  antiguo.outerHTML = '';
                }
              
              }


              makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
              .then(function (datums) {
                var obj = JSON.parse(datums);
                var barra = document.getElementById("barraDeLosHuevos");
                if(obj.vitalpoints>0){
                  console.log('Te han quitado ' + (constantes.PLAYER_INFO.vp-obj.vitalpoints) + ' puntos de vida!');
                }
                barra.ariaValueNow=(obj.vitalpoints*2);
                barra.style.width=  (obj.vitalpoints*2)+'%';
                barra.innerHTML = (obj.vitalpoints)+'vp';
                constantes.PLAYER_INFO.vp = obj.vitalpoints;
              });
          
            })
          .catch(function (err){
            findEnemy();
            console.log('Es inutil atacar en esta dirección! Ataca hacia otro lado! ;)');
          });

          
          sleep(100).then(() => {
            document.getElementById("space").style.transform = "scale(1)";     
          });   

        }
        break;
      case 37:
        if(created===1){ 
          constantes.PLAYER_INFO.direction = 'O';
          created=3;
          direction = 'O';
          sleep(100).then(() => {
            document.getElementById("left").style.transform = "scale(1)";
            document.getElementById("imgBruju").src = brujuOest;
     
          });   
        }
         
       
        break;
      case 38:
        if(created===1){
          constantes.PLAYER_INFO.direction = 'N';
          created=3;
          direction = 'N';
          sleep(100).then(() => {
            document.getElementById("up").style.transform = "scale(1)";
            document.getElementById("imgBruju").src = brujuNord;
  
          });  
        }
       
        break;
      case 39:
        if(created===1){
          constantes.PLAYER_INFO.direction = 'E';
          created=3;
          direction = 'E';
          sleep(100).then(() => {
            document.getElementById("right").style.transform = "scale(1)";
            document.getElementById("imgBruju").src = brujuEst;
          }); 
        }
        
        break;
      case 40:
        if(created===1){
          constantes.PLAYER_INFO.direction = 'S';
          created=3;
          direction = 'S';
          sleep(100).then(() => {
            document.getElementById("down").style.transform = "scale(1)";
            document.getElementById("imgBruju").src = brujuSud;
          }); 
        }
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
            console.log("Masacre a Porrazos forjada del inframundo...");
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
      makeRequest('POST', 'http://battlearena.danielamo.info/api/craft/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, newObj)
          .then(function (datums) {
            makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
          .then(function (datums) {
            var obj = JSON.parse(datums);
            
            var imagen = document.getElementById('selectedObject');
            imagen.src = obj.object.image;
            
            var nombreObjeto = document.getElementById('objectName');           
            nombreObjeto.textContent = obj.object.name;
                        
            var ataqueObjeto = document.getElementById('objectAttack');
            ataqueObjeto.textContent = 'Ataque: ' + obj.object.attack;

            var defensaObjeto = document.getElementById('objectDefense');
            defensaObjeto.textContent = 'Defensa: ' + obj.object.defense;
            
          });
          })
          .catch(function (err){
            console.log('Error: ' + JSON.stringify(err));
          });
      created=0;
  }else if(created===3){
    makeRequest('GET', 'http://battlearena.danielamo.info/api/move/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token + '/' +direction, null)
    .then(function (datums) {
      makeRequest('GET', 'http://battlearena.danielamo.info/api/player/'+constantes.TOKEN+'/'+constantes.PLAYER_INFO.player_token, null)
      .then(function (datums) {
        var obj = JSON.parse(datums);
        
        var xd = 'dir:'+obj.x+'-'+obj.direction;
        var yd = 'dir:'+obj.y+'-'+obj.direction;
        if((xd==='dir:0-O') || (xd==='dir:39-E') || (yd==='dir:0-S') || (yd==='dir:39-N')){
          document.getElementById("escena").style.backgroundImage = 'url('+pared+')';
        }else{
          document.getElementById("escena").style.backgroundImage = 'url('+noPared+')';
        }
        constantes.PLAYER_INFO.x = obj.x;
        constantes.PLAYER_INFO.y = obj.y;
        constantes.PLAYER_INFO.direction = obj.direction;
      });
      showMiniMap();
      findEnemy();
    })
    .catch(function (err){
      console.log('No puedes moverte en esta dirección: hay una pared!');
      document.getElementById("escena").style.backgroundImage = 'url('+pared+')';
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



function helpAlert(){
  Swal.mixin({
    confirmButtonText: 'Siguiente &rarr;',
    icon: 'info',
    progressSteps: ['1', '2', '3']
  }).queue([
    {
      title: 'Cómo Jugar',
      html: '<h5>Bienvenido a nuestra practica de PW!</h5><p><br/>El juego consiste en recorrer un mapa, matando tantos enemigos como puedas!<br/><br/>Dírigete hacia tus enemigos con el minimapa y no pares hasta derrotarlos!</p>'
    },
    {
      title: 'Objetos',
      html: `<p>A lo largo de tu aventura vas a poder ir crafteando diferentes objetos que te van a ayudar a seguir matando enemigos y cada vez hacerte mas poderoso...<br/><br/>Recuerda que los objetos que puedes craftear son los que estan en la zona inferior izquierda y los consigues pulsando las teclas pertinentes (Q, W, E, R, T, Y).</p>
             <p>Tambien debes tener en cuenta que si te encuentras un objeto en la casilla en la que estas tambien lo puedes coger!<br/><br/><b>IMPORTANTE!</b> Solo puedes tener un objeto!</p>`
    },
    {
      title: 'Controles',
      text: 'Chaining swal2 modals is easy',
      html: 
      `<p>Con las flechas del teclado mueves a tu jugador!<br/></p>
      <img src='https://www.flaticon.com/svg/static/icons/svg/2491/2491699.svg' alt="img" style="width: 200px; height: 60px;"/>
      <p><br/>Con el espacio atacas a los enemigos, <b>A por ellos!</b></p>
      <img src='https://userscontent2.emaze.com/images/116fcc9b-4071-4b73-9905-a74d7f865e36/cdcd0e7a-8986-4c3f-90cd-80308757aaa8.png' alt="img" style="width: 300px; height: 60px;"/>`  
    }
  ]).then((result) => {
    if (result.value) {
      Swal.fire(
        'Buen Trabajo!',
        'Ahora a jugar ;)',
        'success'
      )
    }
  });
}

function App() {
  return (
    <div className="App">

      <img id="imagenFondo" src={papeliko} className="imagenFondo" alt="imagen de fondo" />
      <img id="imagenFondoDerecha" src={papeliko} className="imagenFondoDerecha" alt="imagen de fondo" />


      <header id="header" className="App-header">
        <div className="header">
        

          <img src={logo} className="logo" alt='logo' height='70px'/>
          <div className="siteTitle">
            <h4>Practica 2</h4>
            <h6>Marti Ejarque · Rafael Morera · Victor Xirau</h6>
          </div>
          <Button variant="outline-light" onClick={helpAlert}>Ayuda</Button>{' '}
          <Button variant="outline-danger" onClick={eliminarJugador}>Salir de Partida</Button>{' '}
          <Button variant="outline-success" onClick={alertNovaPartida}>Nueva Partida</Button>{' '}

         

        </div>
        <div className="mapa">
          <img className="marquito" src={marco} alt="marquito"/>
          <div className="escena" id="escena"></div>
          <div className="enemigo" id="eneimgo">
          
           <img id="enemyAct" src="//:0" alt="" style={{width: '100%', height: '100%', display:"none"}}/>
          </div>
          
        
          <div className="bruju" id="bruju">
          
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

            <div className="imgBruju" id="bruhula">
              <img id="imgBruju" src={brujuNord} alt="bruju" style={{width: '70%', height: '70%'}}/>
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
        <div className="control" id="control">
          <div className="up" id="up"> 
            <img src={up} alt='up' style={{marginTop:'10%',height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="down" id="down"> 
            <img src={down} alt='down' style={{height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="left" id="left"> 
            <img src={left} alt="left" style={{marginLeft:'33%',height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="right" id="right"> 
            <img src={right} alt="right" style={{marginLeft:'-33%',height: "100%",width: "100%", display:'block'}}/> 
          </div>
          <div className="space" id="space">
            <img src={space} alt="space" style={{height: "100%", width: "100%",display:'block'}}/> 
          </div>

        </div>

      <div className="mini" id="mini">
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

        
        <div className="objetos" id="objetos">
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
