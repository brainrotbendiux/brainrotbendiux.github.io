// --- Elementos DOM ---
const contadorMonedas = document.getElementById("monedas");
const musicaIcono = document.getElementById("musica-icono");
const personajeImg = document.getElementById("personaje-img");
const valorPersonaje = document.getElementById("valor-personaje");
const produccionPersonaje = document.getElementById("produccion");
const panelBase = document.getElementById("panel-base");
const listaExclusivas = document.getElementById("lista-exclusivas");
const panelExclusivas = document.getElementById("panel-exclusivas");
const xCerrarExterna = document.getElementById("x-cerrar-externa");
const exclusividadesBtn = document.getElementById("exclusividades-btn");
const contadorBloqueo = document.getElementById("contador-bloqueo");

// --- Sonidos ---
const musica = document.getElementById("musica");
const sonidoCompra = document.getElementById("sonido-compra");
const sonidoCompraFallida = document.getElementById("sonido-comprafallida");
const sonidoCerrada = document.getElementById("sonido-cerrada");

// --- Personajes normales ---
const personajes = {
  "personaje1": {precio:300000, produccion:100}, "personaje2": {precio:200, produccion:10},
  "personaje3": {precio:700000, produccion:900}, "personaje4": {precio:720000, produccion:950},
  "personaje5": {precio:900000, produccion:1200}, "personaje6": {precio:1200000, produccion:2000},
  "personaje7": {precio:400000, produccion:400}, "personaje8": {precio:2000000, produccion:20000},
  "personaje9": {precio:20000000, produccion:100000}, "personaje10": {precio:70000000, produccion:400000},
  "personaje11": {precio:20000, produccion:300}, "personaje12": {precio:30000000, produccion:1000000},
  "personaje13": {precio:100000000, produccion:10000000}, "personaje14": {precio:500000000, produccion:40000000},
  "personaje15": {precio:5000000, produccion:500000}, "personaje19": {precio:700000, produccion:400000},
  "personaje20": {precio:900000000, produccion:30000000}, "personaje21": {precio:10000, produccion:3000},
  "personaje22": {precio:5000, produccion:1000}, "personaje23": {precio:2000000000, produccion:900000000, probabilidad:0.1},
  "personaje26": {precio:900000, produccion:200000}, "personaje27": {precio:1000000, produccion:700000, startDate:new Date('2025-10-01')},
  "personaje30": {precio:0, produccion:100000000000} // solo por canje
};

// --- Variables ---
let monedas = 10000;
let personajesComprados = [];
let produccionTotal = 0;
let plazas = 20;
let musicaActiva = false;
let bloqueoActivo = false;
let tiempoRestante = 0;
let roboActivo = false;
let personajeActual = null;

// --- Bases externas ---
const basesExternas = [
  {nombre:"Base 1", abierta:true, contador:0, personajes:[]},
  {nombre:"Base 2", abierta:true, contador:0, personajes:[]},
  {nombre:"Base 3", abierta:true, contador:0, personajes:[]}
];

// --- Exclusividades ---
const exclusivas = [
  {nombre:"personaje16", precio:2000000000, produccion:500000000, horas:19, diasCada:2, comprado:false},
  {nombre:"personaje17", precio:20000000000, produccion:5000000000, horas:15, diasCada:3, comprado:false},
  {nombre:"personaje18", precio:200000000000, produccion:150000000000, horas:21, diasCada:7, comprado:false},
  {nombre:"personaje24", precio:400000000000, produccion:200000000000, horas:12, diasCada:7, comprado:false},
  {nombre:"personaje25", precio:100000000000000, produccion:20000000000, horas:14, diasCada:21, comprado:false}
];

// --- Codigos de canje ---
const codigosValidos = [
  "7A9F4D2B8E1C3F0A","F0E1D2C3B4A59687","A1B2C3D4E5F60718",
  "9F8E7D6C5B4A3F2E","1234ABCD5678EFGH","0F1E2D3C4B5A6978",
  "89AB67CD45EF23AB","CDEF0123456789AB","A1B3C5D7E9F0A246",
  "B0A9C8D7E6F54321"
];

// --- Funciones ---
function mostrarMensaje(texto){
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.display = "block";
  setTimeout(()=>{ msg.style.display="none"; },3000);
}

function actualizarMonedas(){
  contadorMonedas.textContent = monedas.toLocaleString();
  contadorMonedas.classList.add("animacion");
  setTimeout(()=>{contadorMonedas.classList.remove("animacion");},500);
}

function guardarDatos(){
  localStorage.setItem("datosJuego",JSON.stringify({monedas, personajesComprados, produccionTotal, plazas, musicaActiva}));
}

function cargarDatos(){
  const datos = JSON.parse(localStorage.getItem("datosJuego"))||{};
  monedas = datos.monedas || 10000;
  personajesComprados = datos.personajesComprados || [];
  produccionTotal = datos.produccionTotal || 0;
  plazas = datos.plazas || 20;
  musicaActiva = datos.musicaActiva || false;
  actualizarMonedas();
  actualizarPanel();
  actualizarIconoMusica();
}

// --- Panel base ---
function actualizarPanel(){
  const lista = document.getElementById("lista-personajes");
  lista.innerHTML = "";
  personajesComprados.forEach(p=>{
    const div = document.createElement("div");
    div.className = "personaje-item";
    const img = document.createElement("img");
    img.src = `${p}.png`;
    div.appendChild(img);
    lista.appendChild(div);
  });
}

// --- Música ---
musicaIcono.addEventListener("click", ()=>{
  if(musicaActiva){ musica.pause(); musicaActiva=false; }
  else{ musica.play().catch(()=>{}); musicaActiva=true; }
  actualizarIconoMusica();
  guardarDatos();
});
function actualizarIconoMusica(){
  musicaIcono.src = musicaActiva?"musica_on.png":"musica_off.png";
}

// --- Cambio de personaje ---
function cambiarPersonaje(){
  const keys = Object.keys(personajes).filter(p=>p!=="personaje30");
  let nuevo;
  do{
    nuevo = keys[Math.floor(Math.random()*keys.length)];
    if(personajes[nuevo].startDate && new Date()<personajes[nuevo].startDate) continue;
    if(personajes[nuevo].probabilidad && Math.random()>personajes[nuevo].probabilidad) continue;
  }while(nuevo===personajeActual);
  personajeActual = nuevo;
  personajeImg.classList.remove("mostrar");
  setTimeout(()=>{
    personajeImg.src = `${personajeActual}.png`;
    personajeImg.classList.add("mostrar");
    valorPersonaje.textContent = `Valor: ${personajes[personajeActual].precio.toLocaleString()} monedas`;
    produccionPersonaje.textContent = `+${personajes[personajeActual].produccion.toLocaleString()}/seg`;
  },100);
}
cambiarPersonaje();
setInterval(cambiarPersonaje,5000);

// --- Compra ---
document.getElementById("comprar-btn").addEventListener("click",()=>{
  if(!personajeActual) return;
  const data = personajes[personajeActual];
  if(personajesComprados.length>=plazas){ mostrarMensaje("No hay huecos ⚠️"); sonidoCompraFallida.play(); return; }
  if(monedas>=data.precio){
    monedas -= data.precio;
    personajesComprados.push(personajeActual);
    produccionTotal += data.produccion;
    actualizarMonedas();
    guardarDatos();
    actualizarPanel();
    mostrarMensaje("¡Comprado! ✅");
    sonidoCompra.play();
  }else{ mostrarMensaje("No tienes suficientes monedas ❌"); sonidoCompraFallida.play(); }
});

// --- Producción ---
setInterval(()=>{
  if(produccionTotal>0){ monedas+=produccionTotal; actualizarMonedas(); guardarDatos(); }
},1000);

// --- Base propia ---
document.getElementById("base-btn").addEventListener("click", ()=>{
  panelBase.style.display = panelBase.style.display==="block"?"none":"block";
  actualizarPanel();
});

document.getElementById("bloqueo-btn").addEventListener("click", ()=>{
  if(!bloqueoActivo) activarBloqueoBase();
  else desbloquearBase();
});

function activarBloqueoBase(){
  bloqueoActivo = true;
  tiempoRestante = 60;
  contadorBloqueo.textContent = `Base cerrada: ${tiempoRestante}s`;
  sonidoCerrada.play();
  const timer = setInterval(()=>{
    tiempoRestante--;
    contadorBloqueo.textContent = `Base cerrada: ${tiempoRestante}s`;
    if(tiempoRestante<=0){ clearInterval(timer); desbloquearBase(); mostrarMensaje("Bloqueo terminado"); }
  },1000);
}

function desbloquearBase(){
  bloqueoActivo=false;
  contadorBloqueo.textContent="";
}

// --- Comprar plazas ---
document.getElementById("comprar-plazas").addEventListener("click", ()=>{
  const precio = 500000, cantidad=10;
  if(monedas>=precio){
    monedas -= precio;
    plazas += cantidad;
    actualizarMonedas();
    guardarDatos();
    mostrarMensaje(`¡Compraste ${cantidad} plazas! ✅`);
    sonidoCompra.play();
  }else{ mostrarMensaje("No tienes monedas suficientes ❌"); sonidoCompraFallida.play(); }
});

// --- Bases externas ---
document.querySelectorAll(".bases-exteriores button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const index = parseInt(btn.getAttribute("data-index"));
    abrirPanelExterna(index);
  });
});

function abrirPanelExterna(index){
  const base = basesExternas[index];
  const panel = document.getElementById("panel-externa");
  panel.style.display="block";
  xCerrarExterna.style.display="block";
  const lista = document.getElementById("lista-externa");
  lista.innerHTML="";
  const estado = base.abierta?"Abierta":`Cerrada (${base.contador}s)`;
  panel.querySelector("h3").textContent = `${base.nombre} - ${estado}`;
  base.personajes.forEach((p,idx)=>{
    const div = document.createElement("div");
    div.className="personaje-externa";
    const img = document.createElement("img");
    img.src = `${p}.png`;
    const btnR = document.createElement("button");
    btnR.textContent="Robar";
    btnR.className="boton-robar";
    btnR.disabled = !base.abierta || roboActivo;
    btnR.addEventListener("click",()=>{ iniciarRoboExterno(base,idx); });
    div.appendChild(img); div.appendChild(btnR); lista.appendChild(div);
  });
}

xCerrarExterna.addEventListener("click", ()=>{
  document.getElementById("panel-externa").style.display="none";
  xCerrarExterna.style.display="none";
});

// --- Simulación progresiva bases externas ---
setInterval(()=>{
  basesExternas.forEach(base=>{
    if(base.contador>0){ base.contador--; }
    else{ base.abierta = Math.random()<0.5; base.contador = Math.floor(Math.random()*20+10); }
    if(base.personajes.length<15){
      const keys = Object.keys(personajes);
      const p = keys[Math.floor(Math.random()*keys.length)];
      if(p!=="personaje30") base.personajes.push(p);
    }
  });
},1000);

// --- Robo externo ---
function iniciarRoboExterno(base,idx){
  if(roboActivo) return;
  roboActivo=true;
  const p = base.personajes[idx];
  mostrarMensaje("Intentando robar... ⏳");
  let tiempoRobo = 10;
  const intervalo = setInterval(()=>{
    tiempoRobo--;
    if(tiempoRobo<=0){
      clearInterval(intervalo);
      const valor = personajes[p].precio;
      const chance = Math.min(0.95,0.5 + valor/100000000);
      if(Math.random() > chance){
        personajesComprados.push(p);
        produccionTotal += personajes[p].produccion;
        actualizarPanel();
        guardarDatos();
        mostrarMensaje("¡Robo exitoso! ✅");
        sonidoCompra.play();
      } else{
        mostrarMensaje("Robo fallido ❌");
        sonidoCompraFallida.play();
      }
      roboActivo=false;
    }
  },1000);
}

// --- Exclusividades y canje ---
function calcularProximaFecha(ex){
  const ahora=new Date();
  let f=new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), ex.horas,0,0);
  while(f<ahora) f.setDate(f.getDate()+ex.diasCada||1);
  return f;
}

function actualizarExclusivasPanel(){
  listaExclusivas.innerHTML="";
  const ahora = new Date();
  exclusivas.forEach(ex=>{
    if(!ex.proximaSalida) ex.proximaSalida = calcularProximaFecha(ex);
    const div = document.createElement("div"); div.className="exclusiva-item";
    const img = document.createElement("img"); img.src = `${ex.nombre}.png`;
    const span = document.createElement("span"); span.className="exclusiva-timer";
    if(ahora>=ex.proximaSalida && !ex.comprado){
      span.textContent = "Disponible!";
      const boton = document.createElement("button");
      boton.textContent="Comprar"; boton.className="boton-comprar";
      boton.addEventListener("click",()=>{
        if(monedas>=ex.precio){
          monedas-=ex.precio;
          personajesComprados.push(ex.nombre);
          produccionTotal+=ex.produccion;
          actualizarMonedas(); actualizarPanel();
          mostrarMensaje("¡Comprado exclusivo! ✅");
          sonidoCompra.play(); ex.comprado=true;
          guardarDatos();
        }else{ mostrarMensaje("No tienes suficientes monedas ❌"); sonidoCompraFallida.play(); }
      });
      div.appendChild(img); div.appendChild(span); div.appendChild(boton);
    }else{
      const diff=Math.floor((ex.proximaSalida-ahora)/1000);
      const h=Math.floor(diff/3600), m=Math.floor((diff%3600)/60), s=diff%60;
      span.textContent = `Sale en ${h}h ${m}m ${s}s`;
      div.appendChild(img); div.appendChild(span);
    }
    listaExclusivas.appendChild(div);
  });
  // --- Canje ---
  const divCanje = document.createElement("div"); divCanje.id="canje-codigo";
  const input = document.createElement("input"); input.type="text"; input.placeholder="Introduce código"; input.id="codigo-input";
  const boton = document.createElement("button"); boton.textContent="Canjear Código"; boton.id="canjear-btn";
  divCanje.appendChild(input); divCanje.appendChild(boton);
  listaExclusivas.appendChild(divCanje);

  boton.addEventListener("click",()=>{
    const codigo = input.value.trim();
    if(codigosValidos.includes(codigo)){
      monedas+=1000000000;
      codigosValidos.splice(codigosValidos.indexOf(codigo),1);
      if(!personajesComprados.includes("personaje30")){
        personajesComprados.push("personaje30");
        produccionTotal+=personajes["personaje30"].produccion;
        mostrarMensaje("¡Código canjeado! Personaje30 desbloqueado ✅");
      } else mostrarMensaje("¡Código canjeado! 1 billón añadido ✅");
      actualizarMonedas();
      guardarDatos();
      input.value="";
    } else mostrarMensaje("Código inválido ❌");
  });
}

setInterval(actualizarExclusivasPanel,1000);
exclusividadesBtn.addEventListener("click", ()=>{
  panelExclusivas.style.display = panelExclusivas.style.display==="block"?"none":"block";
  actualizarExclusivasPanel();
});

// --- Inicializar ---
cargarDatos();
