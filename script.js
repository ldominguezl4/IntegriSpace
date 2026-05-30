let map = L.map('map').setView(
    [-12.0464, -77.0428],
    13
);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:
    '&copy; OpenStreetMap contributors'
}).addTo(map);



let puntos = [];
let linea = null;
let distanciaTotal = 0;
let marcadores = [];



/* MODO DISTANCIA */

function cambiarModoDistancia(){

    let modo =

    document.getElementById(
        "modoDistancia"
    ).value;



    if(modo === "manual"){

        document.getElementById(
            "distanciaMapa"
        ).style.display = "none";



        document.getElementById(
            "distanciaManualContainer"
        ).style.display = "block";

    }

    else{

        document.getElementById(
            "distanciaMapa"
        ).style.display = "block";



        document.getElementById(
            "distanciaManualContainer"
        ).style.display = "none";

    }

}



/* MAPA */

map.on('click', function(e){

    let nuevoPunto =
    [e.latlng.lat, e.latlng.lng];

    puntos.push(nuevoPunto);



    let marcador =
    L.marker(nuevoPunto).addTo(map);

    marcadores.push(marcador);



    if(puntos.length > 1){

        let ultimo =
        puntos[puntos.length - 2];

        let actual =
        puntos[puntos.length - 1];

        let distancia =
        map.distance(
            ultimo,
            actual
        );

        distanciaTotal += distancia;
    }



    if(linea){

        map.removeLayer(linea);
    }



    linea = L.polyline(
        puntos,
        {
            color: 'blue',
            weight: 5
        }
    ).addTo(map);



    document.getElementById(
        "distancia"
    ).value =
    distanciaTotal.toFixed(2);

});



/* CALCULAR */

function calcular(){

    document.getElementById(
        "panelRecomendaciones"
    ).style.display = "block";



    document.getElementById(
        "panelIndicadores"
    ).style.display = "block";



    let masa =

    parseFloat(

        document.getElementById(
            "peso"
        ).value

    );



    let modo =

    document.getElementById(
        "modoDistancia"
    ).value;



    let distancia;



    if(modo === "manual"){

        distancia =

        parseFloat(

            document.getElementById(
                "distanciaManual"
            ).value

        );

    }

    else{

        distancia =

        parseFloat(

            document.getElementById(
                "distancia"
            ).value

        );

    }



    let pendiente =

    parseFloat(

        document.getElementById(
            "terreno"
        ).value

    );



    let usuario =

    document.getElementById(
        "usuario"
    ).value;



    if(
        isNaN(masa) ||
        isNaN(distancia)
    ){

        alert(
            "⚠️ Complete todos los campos"
        );

        return;
    }



    let gravedad = 9.8;

    let factorUsuario;
    let tipoUsuario;
    let velocidad;



    if(usuario == 1){

        factorUsuario = 1;

        tipoUsuario =
        "Usuario general";
    }

    else if(usuario == 2){

        factorUsuario = 1.3;

        tipoUsuario =
        "Adulto mayor";
    }

    else{

        factorUsuario = 1.6;

        tipoUsuario =
        "Movilidad reducida";
    }



    if(pendiente < 0){

        velocidad = 1.8;
    }

    else if(pendiente == 0){

        velocidad = 1.5;
    }

    else if(pendiente <= 5){

        velocidad = 1.3;
    }

    else if(pendiente <= 10){

        velocidad = 1.0;
    }

    else{

        velocidad = 0.7;
    }



    let altura =

    distancia *
    (pendiente / 100);



    let energiaPotencial =

    masa *
    gravedad *
    altura;



    let energiaCinetica =

    0.5 *
    masa *
    velocidad *
    velocidad;



    let energiaTotal =

    Math.abs(

        (
            energiaPotencial +
            energiaCinetica
        )

        * factorUsuario

    );



    let calorias =

    Math.abs(

        energiaTotal / 4.184

    );



    let esfuerzo;
    let claseEsfuerzo;
    let agua;
    let equivalencia;



    if(calorias < 100){

        esfuerzo = "Bajo";

        claseEsfuerzo =
        "esfuerzo-bajo";

        agua = "250 ml";

        equivalencia =
        "🍌 1 plátano";
    }

    else if(calorias < 300){

        esfuerzo = "Moderado";

        claseEsfuerzo =
        "esfuerzo-medio";

        agua = "500 ml";

        equivalencia =
        "🍌 2 plátanos o 1 yogur";
    }

    else{

        esfuerzo = "Alto";

        claseEsfuerzo =
        "esfuerzo-alto";

        agua = "750 ml";

        equivalencia =
        "🥪 1 sándwich pequeño";
    }



    let recomendaciones = [];

        /* SEGUN PENDIENTE */

    if(pendiente > 10){

        recomendaciones.push(
            "🔴 Ruta con alta inclinación."
        );

        recomendaciones.push(
            "⚠️ Reducir velocidad durante el recorrido."
        );

        recomendaciones.push(
            "💧 Mantener hidratación constante."
        );

    }

    else if(pendiente > 0){

        recomendaciones.push(
            "🟡 Ruta moderada."
        );

        recomendaciones.push(
            "🚶 Mantener un ritmo estable."
        );

    }

    else if(pendiente < 0){

        recomendaciones.push(
            "🔵 Ruta en descenso."
        );

        recomendaciones.push(
            "⚠️ Tener cuidado al descender."
        );

        recomendaciones.push(
            "👟 Utilizar calzado adecuado."
        );

    }

    else{

        recomendaciones.push(
            "🟢 Ruta accesible y cómoda."
        );

        recomendaciones.push(
            "🚶 Adecuada para desplazamiento cotidiano."
        );

    }



    /* SEGUN USUARIO */

    if(usuario == 2){

        recomendaciones.push(
            "👴 Realizar pausas cortas durante el recorrido."
        );

        recomendaciones.push(
            "💧 Llevar agua para mantenerse hidratado."
        );

    }



    if(usuario == 3){

        recomendaciones.push(
            "♿ Verificar rampas y superficies accesibles."
        );

        recomendaciones.push(
            "🦽 Mantener desplazamiento moderado."
        );

    }



    if(usuario == 1){

        recomendaciones.push(
            "✅ Mantener ritmo de caminata seguro."
        );

    }



    let recomendacionesHTML = "";


    recomendaciones.forEach(function(rec){

        recomendacionesHTML +=

        `
        <div class="recomendacion">
            ${rec}
        </div>
        `;
    });



    /* RESULTADOS */

    document.getElementById(
        "resultado"
    ).innerHTML =

`
👤 Usuario:
${tipoUsuario}

<br><br>

🚶 Velocidad estimada:
${velocidad} m/s

<br><br>

📏 Distancia recorrida:
${distancia.toFixed(2)} metros

<br><br>

🛣️ Tipo de terreno:
${document.getElementById("terreno").selectedOptions[0].text}

<br><br>

🔋 Energía utilizada:
${energiaTotal.toFixed(2)} J

<br><br>

🔥 Calorías aproximadas:
${calorias.toFixed(2)}

<div class="caja-recomendaciones">

    <h3>
        💡 Recomendaciones
    </h3>

    ${recomendacionesHTML}

</div>

`;



    /* INDICADORES COMPLEMENTARIOS
       PANEL TOTALMENTE INDEPENDIENTE */

    document.getElementById(
        "indicadores"
    ).innerHTML =

`
📊 Nivel de esfuerzo:

<span class="${claseEsfuerzo}">

    ${esfuerzo}

</span>

<br><br>

💧 Agua recomendada:

${agua}

<br><br>

🍎 Equivalencia calórica:

${equivalencia}
`;

}



/* LIMPIAR RUTA */

function limpiarRuta(){

    puntos = [];

    distanciaTotal = 0;

    document.getElementById(
        "distancia"
    ).value = "";


    if(linea){

        map.removeLayer(linea);
    }


    marcadores.forEach(function(m){

        map.removeLayer(m);
    });

    marcadores = [];
}



/* REINICIAR */

function limpiar(){

    location.reload();
}



/* MENU ACCESIBILIDAD */

function mostrarMenu(){

    let menu =

    document.getElementById(
        "menuAccesibilidad"
    );



    if(menu.style.display == "flex"){

        menu.style.display = "none";
    }

    else{

        menu.style.display = "flex";
    }

}



/* ACCESIBILIDAD */

function altoContraste(){

    document.body.classList.toggle(
        "alto-contraste"
    );

}



function letrasGrandes(){

    document.body.classList.toggle(
        "letras-grandes"
    );

}



function botonesGrandes(){

    document.body.classList.toggle(
        "botones-grandes"
    );

}



/* SERVICE WORKER */

if("serviceWorker" in navigator){

    navigator.serviceWorker.register(
        "service-worker.js"
    )

    .then(function(){

        console.log(
            "PWA activada"
        );

    });

}



/* INSTALAR APP */

let deferredPrompt;

const btnInstalar =

document.getElementById(
    "btnInstalar"
);



window.addEventListener(
    "beforeinstallprompt",

    (e) => {

        e.preventDefault();

        deferredPrompt = e;

        btnInstalar.style.display =
        "block";

    }
);



btnInstalar.addEventListener(
    "click",

    async () => {

        if(deferredPrompt){

            deferredPrompt.prompt();

            const {
                outcome
            } = await deferredPrompt.userChoice;


            if(outcome === "accepted"){

                console.log(
                    "App instalada"
                );
            }

            deferredPrompt = null;
        }

    }
);