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



function calcular(){

    document.getElementById(
        "panelRecomendaciones"
    ).style.display = "block";


    let masa =
    parseFloat(
        document.getElementById("peso").value
    );

    let distancia =
    parseFloat(
        document.getElementById("distancia").value
    );

    let pendiente =
    parseFloat(
        document.getElementById("terreno").value
    );

    let usuario =
    document.getElementById("usuario").value;


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
        tipoUsuario = "Usuario general";
    }

    else if(usuario == 2){

        factorUsuario = 1.3;
        tipoUsuario = "Adulto mayor";
    }

    else{

        factorUsuario = 1.6;
        tipoUsuario = "Movilidad reducida";
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
`;
}



/* LIMPIAR */

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



function limpiar(){

    location.reload();
}



/* ACCESIBILIDAD */

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



/* PWA */

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



/* INSTALAR */

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