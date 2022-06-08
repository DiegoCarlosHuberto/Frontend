
var imagenes = ["Images/btc.png", "Images/pera.png", "Images/berenjena.png", "Images/sandia.png", "Images/tomate.png", "Images/banana.png", "Images/caca.png"];

var ruleta;
var user;

function slot() {


    var spin = new Audio("audio/Spin.WAV");
    var http;
    http = new XMLHttpRequest();

    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

            ruleta = JSON.parse(http.responseText);

            spin.play();
            document.getElementById("num1").setAttribute("src", imagenes[ruleta.num1 - 1]);
            document.getElementById("num4").setAttribute("src", imagenes[ruleta.num4 - 1]);
            document.getElementById("num7").setAttribute("src", imagenes[ruleta.num7 - 1]);


            setTimeout(function () {
                spin.play();
                document.getElementById("num2").setAttribute("src", imagenes[ruleta.num2 - 1]);
                document.getElementById("num5").setAttribute("src", imagenes[ruleta.num5 - 1]);
                document.getElementById("num8").setAttribute("src", imagenes[ruleta.num8 - 1]);

            }, 600);

            setTimeout(function () {
                spin.play();
                document.getElementById("num3").setAttribute("src", imagenes[ruleta.num3 - 1]);
                document.getElementById("num6").setAttribute("src", imagenes[ruleta.num6 - 1]);
                document.getElementById("num9").setAttribute("src", imagenes[ruleta.num9 - 1]);

            }, 1200);

        }

    }
    http.open("GET", "http://162.19.66.61:8080/ProyectoCasino/SlotGame", true);
    http.send();



    setTimeout(function () {

        document.getElementById("text").innerHTML = "HAS GANADO: " + ruleta.reward;
        var sonido = new Audio("audio/BigWin.WAV")
        if (ruleta.reward >= document.getElementById("betbox").value * 5 && ruleta.reward != 0) {
            sonido.play();
        }
    }, 1200);
}

function bet() {

    var http;
    http = new XMLHttpRequest();

    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

            if (http.responseText != "0") {
                document.getElementById("spin").disabled = false;
            }
            else {
                alert("Crédito insuficiente! Ingrese crédito para continuar");
            }

        }



    }


    http.open("POST", "http://162.19.66.61:8080/ProyectoCasino/SlotGame", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("bet=" + document.getElementById("betbox").value + "&&id=" + localStorage.getItem("user") + "&&credito=" + localStorage.getItem("credito") + "&&dni=" + localStorage.getItem("dni"));

}

function login() {
    var http;
    http = new XMLHttpRequest();


    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

            if (http.readyState == 4 && http.status == 200) {

                user = JSON.parse(http.responseText);


                if (user.Check == true) {
                    alert("Sesión iniciada con éxito")
                    localStorage.setItem("user", user.ID);
                    localStorage.setItem("dni", user.DNI);
                    localStorage.setItem("credito",user.Credito);

                }
                else {
                    alert("Usuario y/o contraseña incorrecto")
                }


            }

        }
    };

    http.open("POST", "http://162.19.66.61:8080/ProyectoCasino/LoginAccess", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("password=" + document.getElementById("password").value + "&&username=" + document.getElementById("username").value);

}

function newUser() {

    var http;
    http = new XMLHttpRequest();

    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

            document.getElementById("Msg").style.visibility = "visible";
        }
    };

    http.open("POST", "http:/162.19.66.61:8080/ProyectoCasino/CreateUser", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("dni=" + document.getElementById("id").value + "&&nombre=" + document.getElementById("name").value
        + "&&surnames=" + document.getElementById("surnames").value + "&&date="
        + document.getElementById("date").value + "&&password=" + document.getElementById("password").value);

}

function ingresar() {

    var http;
    http = new XMLHttpRequest();

    http.onreadystatechange = function () {

        if (http.readyState == 4 && http.status == 200) {

        }
    }

    if (user == null) {
        alert("INICIA SESIÓN ANTES DE INGRESAR!")
    }
    else {

        http.open("POST", "http:/162.19.66.61:8080/ProyectoCasino/InsertCredit", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("credito=" + document.getElementById("creditbox").value + "&&dni=" + localStorage.getItem("dni"));

    }

}

var puntaje = 0;
var puntajeBanca = "";
var numCartas = 0;
var apuesta = "0";
var cartaInBanca = "&&rango=";
function Pedir() {
    let sxmlhttp;
    let DNI = localStorage.getItem("dni");
    sxmlhttp = new XMLHttpRequest();

    sxmlhttp.onreadystatechange = function () {
        if (sxmlhttp.readyState == 4 && sxmlhttp.status == 200) {
            let respuesta = sxmlhttp.responseText;
            let carta = "";
            let puntos = "";
            let i = 0;
            for (i; i < respuesta.length; i++) {
                if (respuesta.charAt(i) == "$") {
                    i++
                    for (i; i < respuesta.length; i++) {
                        puntos += respuesta.charAt(i);
                    }
                }
                else {
                    carta += respuesta.charAt(i);
                }
            }
            puntaje = parseInt(puntos);
            document.getElementById("mano").removeChild(document.getElementById("puntos"));
            let x = document.createElement("li");
            let cartaX = document.createTextNode(carta);
            x.appendChild(cartaX);
            document.getElementById("mano").appendChild(x);
            let D = document.createElement("li");
            D.setAttribute("id", "puntos");
            let puntosJ = document.createTextNode("puntos " + puntaje);
            D.appendChild(puntosJ);
            document.getElementById("mano").appendChild(D);
            numCartas++;
        }

        if (puntaje > 20) {
            Plantarse();
        }
    }
    sxmlhttp.open("POST", "http://162.19.66.61:8080/ProyectoCasino/Pedir", true);
    sxmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    sxmlhttp.send("puntos=" + puntaje);
}

function Jugar() {
    if ((localStorage.getItem("dni")==null) && (localStorage.getItem("dni")) == "") {
        alert("Debes iniciar sesión");
    }
    else {
        let sxmlhttp;
        sxmlhttp = new XMLHttpRequest();

        sxmlhttp.onreadystatechange = function () {
            if (sxmlhttp.readyState == 4 && sxmlhttp.status == 200) {
                let respuesta = sxmlhttp.responseText;
                if (respuesta == "No") {
                    alert("Saldo insuficiente");
                }
                else {
                    let carta1 = "";
                    let carta2 = "";
                    let puntos = "";
                    let cartaBanca = "";
                    let i = 0;
                    for (i; i < respuesta.length; i++) {
                        if (respuesta.charAt(i) == "&") {
                            i++
                            for (i; i < respuesta.length; i++) {
                                if (respuesta.charAt(i) == "$") {
                                    i++
                                    for (i; i < respuesta.length; i++) {
                                        if (respuesta.charAt(i) == "%") {
                                            i++
                                            for (i; i < respuesta.length; i++) {
                                                cartaBanca += respuesta.charAt(i);
                                            }
                                        }
                                        else {
                                            puntos += respuesta.charAt(i);
                                        }
                                    }
                                }
                                else {
                                    carta2 += respuesta.charAt(i);

                                }
                            }
                        }
                        else {
                            carta1 += respuesta.charAt(i);
                        }
                    }
                    for (let j = 0; j < cartaBanca.length; j++) {
                        if (cartaBanca.charAt(j) == " ") {
                            j += 4
                            cartaInBanca += "&&palo="
                            for (j; j < cartaBanca.length; j++) {
                                cartaInBanca += cartaBanca.charAt(j);
                            }
                        }
                        else {
                            cartaInBanca += cartaBanca.charAt(j);
                        }
                    }

                    puntaje += parseInt(puntos);
                    let mano = document.createElement("ul");
                    mano.setAttribute("id", "mano");
                    let manoB = document.createElement("ul");
                    manoB.setAttribute("id", "manoB");
                    let nombre = document.createElement("p");
                    nombre.setAttribute("id", "nombre");
                    let banca = document.createElement("p");
                    let A = document.createElement("li");
                    let B = document.createElement("li");
                    let C = document.createElement("li");
                    let D = document.createElement("li");
                    D.setAttribute("id", "puntos");
                    let Nbanca = document.createTextNode("Banca")
                    let cartaA = document.createTextNode(carta1);
                    let cartaB = document.createTextNode(carta2);
                    let cartaC = document.createTextNode(cartaBanca);
                    let user = document.createTextNode(localStorage.getItem("dni"));
                    let puntosJ = document.createTextNode("puntos " + puntaje)
                    A.appendChild(cartaA);
                    B.appendChild(cartaB);
                    D.appendChild(puntosJ);
                    C.appendChild(cartaC);
                    banca.appendChild(Nbanca);
                    nombre.appendChild(user);
                    mano.appendChild(nombre);
                    mano.appendChild(A);
                    mano.appendChild(B);
                    mano.appendChild(D);
                    banca.appendChild(C);
                    manoB.appendChild(banca);
                    document.getElementById("sect1").appendChild(mano);
                    document.getElementById("sect1").appendChild(manoB);

                    document.getElementById("jugar").style.visibility = "hidden";
                    document.getElementById("apuesta").style.visibility = "hidden";
                    document.getElementById("apostar").style.visibility = "hidden";
                    document.getElementById("plantarse").style.visibility = "visible";
                    document.getElementById("pedir").style.visibility = "visible";
                    numCartas += 2;
                }

            }
            if (puntaje > 20) {
                Plantarse();
            }
        }


        sxmlhttp.open("POST", "http://162.19.66.61:8080/ProyectoCasino/NuevaPartida", true);
        sxmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        sxmlhttp.send("id=" + localStorage.getItem("dni") + "&&apuesta=" + apuesta);
    }
}

function Plantarse() {
    let sxmlhttp;
    sxmlhttp = new XMLHttpRequest();

    sxmlhttp.onreadystatechange = function () {
        if (sxmlhttp.readyState == 4 && sxmlhttp.status == 200) {
            let respuesta = sxmlhttp.responseText;
            let carta = "";
            var resultado = "";

            let i = 0;
            for (i; i < respuesta.length; i++) {
                if (respuesta.charAt(i) == "&") {
                    let li = document.createElement("li");
                    let naipe = document.createTextNode(carta);
                    li.appendChild(naipe);
                    document.getElementById("manoB").appendChild(li);
                    carta = "";
                }
                else if (respuesta.charAt(i) == "$") {
                    i++
                    for (i; i < respuesta.length; i++) {
                        if (respuesta.charAt(i) == "%") {
                            i++
                            for (i; i < respuesta.length; i++) {
                                puntajeBanca += respuesta.charAt(i);
                            }
                        }
                        else {
                            resultado += respuesta.charAt(i);
                        }
                    }
                }

                else {
                    carta += respuesta.charAt(i);
                }
            }
            let D = document.createElement("li");
            D.setAttribute("id", "puntosB");
            let puntosJ = document.createTextNode("puntos " + puntajeBanca);
            D.appendChild(puntosJ);
            document.getElementById("manoB").appendChild(D);
            alert(resultado);

        }
        document.getElementById("plantarse").style.visibility = "hidden";
        document.getElementById("pedir").style.visibility = "hidden";
        document.getElementById("rejugar").style.visibility = "visible";


    }
    sxmlhttp.open("POST", "http://162.19.66.61:8080/ProyectoCasino/Plantarse", true);
    sxmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    sxmlhttp.send("puntos=" + puntaje + "&&numCartas=" + numCartas + "&&apuesta=" + apuesta + "&&id=" + localStorage.getItem("dni") + cartaInBanca);
}



function Apostar() {
    if (document.getElementById("apuesta").value.length > 0) {
        apuesta = document.getElementById("apuesta").value;

        document.getElementById("jugar").style.visibility = "visible";

    }
    else {
        alert("Introduzca una apuesta")
    }
}

function ReJugar() {
    let sec = document.getElementById("sect1");
    let m = document.getElementById("mano");
    let mB = document.getElementById("manoB");
    sec.removeChild(m);
    sec.removeChild(mB);
    puntaje = 0;
    numCartas = 0;
    cartaInBanca = "&&rango=";
    puntajeBanca = "";
    document.getElementById("apostar").style.visibility = "visible";
    document.getElementById("apuesta").style.visibility = "visible";
    document.getElementById("rejugar").style.visibility = "hidden";


}

function logIn() {
    let usuario = document.getElementById("username").value;
    let clave = document.getElementById("password").value;
    let sxmlhttp;
    sxmlhttp = new XMLHttpRequest();

    sxmlhttp.onreadystatechange = function () {
        if (sxmlhttp.readyState == 4 && sxmlhttp.status == 200) {
            let respuesta = sxmlhttp.responseText;
            if (respuesta == "Si") {
                localStorage.setItem("DNI",document.getElementById('username').value);
                alert("Bienvenido " + localStorage.getItem("DNI"));
            }
            else {
                alert(respuesta);
            }
        }
    }
    sxmlhttp.open("POST", "http://162.19.66.61:8080/ProyectoCasino/LoginAccess", true);
    sxmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    sxmlhttp.send("id=" + usuario + "&&clave=" + clave);
}

function logOut(){
    sessionStorage.clear();
    localStorage.clear();
    loged()
}

function loged(){
    let DNI = localStorage.getItem("dni");
    if((DNI != "")&&(DNI != null)){
        document.getElementById("login").style.visibility="hidden";
        let p = document.createElement("p");
        p.setAttribute("id","saludo");
        let texto = document.createTextNode("Bienvenido " + DNI);
        p.appendChild(texto);
        document.getElementById("header").appendChild(p);
    }
    else{
        document.getElementById("header").removeChild(document.getElementById("saludo"));
        document.getElementById("login").style.visibility="visible";
    }
}


function mostrar() {
  var http;
  http = new XMLHttpRequest();

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      document.getElementById();
    }
  };
}

function ApostarR() {
  var http;
  var bet;
  http = new XMLHttpRequest();

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      bet = JSON.parse(http.responseText);

      var prime = (document.getElementById("prime").innerHTML =
        "Has ganado; " + bet.prime);
      var numer = (document.getElementById("numberW").innerHTML =
        "El numero ha sido: " + bet.numberW);
      var color = (document.getElementById("colorW").innerHTML =
        "El color ha sido: " + bet.color);
      var grupo = (document.getElementById("grupoW").innerHTML =
        "Grupo Ganador: " + bet.grupo);
      var x = document.getElementById("resultado");
      x.style.display = "block";
    }
  };
  http.open(
    "GET",
    "http://162.19.66.61:8080/ProyectoCasino/Conexion?nums=" +
      document.getElementById("numbers").value +
      "&moneyN=" +
      document.getElementById("moneyNum").value +
      "&groups=" +
      document.getElementById("groups").value +
      "&moneyG=" +
      document.getElementById("moneyGroup").value +
      "&colorA=" +
      document.getElementById("color").value +
      "&moneyColorA=" +
      document.getElementById("moneyColor").value,
    true
  );
  http.send();
}

function betR() {
  var http;
  http = new XMLHttpRequest();

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
      if (http.responseText != "0") {
        var x = document.getElementById("apostar");
        x.style.display = "block";
      } else {
        alert("Crédito insuficiente! Ingrese crédito para continuar");
      }
    }
  };

  var bet = document.getElementById;

  http.open("POST", "http://162.19.66.61:8080/ProyectoCasino/Conexion", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send(
    "moneyN=" +
      document.getElementById("moneyNum").value +
      "&&moneyG=" +
      document.getElementById("moneyGroup").value +
      "&&moneyColorA=" +
      document.getElementById("moneyColor").value +
      "&&id=" +
      localStorage.getItem("user") +
      "&&credito=" +
      localStorage.getItem("credito") +
      "&&dni=" +
      localStorage.getItem("dni")
  );
}