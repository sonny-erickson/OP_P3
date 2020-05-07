
class Map {
    constructor(lat,lng){
        this.lat = lat;
        this.lng = lng;
        this.init();
        this.marker();
        document.getElementById("inputName").value = localStorage.getItem("nom");
        document.getElementById("inputSurname").value = localStorage.getItem("prenom");
        document.getElementsByTagName('span')[0].innerHTML = sessionStorage.getItem("nomStation");
        document.getElementsByTagName('span')[1].innerHTML = sessionStorage.getItem("adresse"); 
        if(sessionStorage.getItem("timerEnd") != null) { //si y'a quelque dans session storage
            firstCanvas.repriseTimer(sessionStorage.getItem("timerEnd"));// demande au canvas de recreer un timer avec l'heure de fin sauvegardé.....
        }
    }
    //API leaflet
    init() {
        // On initialise la carte
        this.carte = L.map("maCarte").setView([this.lat,this.lng], 13);
        // On charge les tuiles
        L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
            // le lien vers la source des données
            attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 8,
            maxZoom: 20
        }).addTo(this.carte);
    }
    // Création des marqueurs
    marker() {
        let iconGreen = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        let iconRed = L.icon({
             iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
             iconSize: [25, 41],
             iconAnchor: [12, 41],
        });
        let iconOrange = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        //API JCDecaux
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ddc2346b150d33e9e8a0cdca3def17cc45f17bb2", (reponse) => {
            const stations = JSON.parse(reponse);// transforme en objet JavaScript
            let marker;
            for(let i = 0; i < stations.length; i++){
                const infoStations = stations[i];
                if(infoStations.status === "CLOSED"){
                    marker = L.marker(infoStations.position,{icon:iconRed})
                    .addTo(this.carte);
                }else{
                    if(infoStations.available_bikes < 3){
                        marker = L.marker(infoStations.position,{icon:iconOrange})
                        .addTo(this.carte);
                    }
                    else{
                        marker = L.marker(infoStations.position,{icon:iconGreen})
                        .addTo(this.carte);
                    }
                }
                 //  chq infos à chq station
                marker.info = infoStations; 
                // A partir du moment ou on clique sur un marqueur
                marker.addEventListener("click", (e) =>{
                    this.station = infoStations;
                    // Toutes les infos apparaisent
                    document.getElementById("status").innerHTML = infoStations.status;
                    if(infoStations.status === "OPEN"){
                        document.getElementById("status").innerText = "OUVERTE";
                        document.getElementById("status").className = "text-success";
                        // On fait apparaitre le formulaire ou pas selon si des vélos sont dispos
                        if(infoStations.available_bikes > 0){
                            document.getElementById("form").className="";
                        }else{
                            document.getElementById("form").className="d-none";
                        }
                    }if(infoStations.status === "CLOSED"){
                        document.getElementById("status").innerText = "FERMEE";
                        document.getElementById("status").className = "text-danger";
                        document.getElementById("form").className="d-none";
                    }
                    // Affichage des infos au bon endroit et sauvegarde de l'adresse et nom station en sessionStorage (setIn)
                    document.getElementById("adresse").innerHTML = infoStations.address;
                    sessionStorage.setItem('adresse',infoStations.address);
                    document.getElementById("nom").innerHTML =infoStations.name;
                    sessionStorage.setItem('nomStation',infoStations.name);
                    document.getElementById("nbVelos").innerHTML = infoStations.bike_stands;
                    document.getElementById("dispo").innerHTML = infoStations.available_bikes;
                });
            };
            // raccourcies(sélecteur DOM)
            this.boutonReserver = document.querySelector("#reservez");
            this.boutonRetour = document.querySelector("#retour"),
            this.book = document.getElementById("book");
            this.stations = document.getElementById("stations");
            let reg = /^[a-zA-Z0-9_-]{3,16}$/;// regex(expressions régulières)
            //Evénement clique sur reserver
            this.boutonReserver.addEventListener("click", (e) => {
                e.preventDefault();
                // Vérification condition si nom et prénom sont inscris + regex
                if(this.station.available_bikes > 0){
                    if((document.querySelector("#inputName").value.length > 0) && (reg.test(document.querySelector("#inputName").value))){
                        if((document.querySelector("#inputSurname").value.length > 0) && (reg.test(document.querySelector("#inputSurname").value))){
                            // Sauvegardes en LocalStorage des noms et prenoms (setIn)
                            localStorage.setItem("nom",document.getElementById("inputName").value);
                            localStorage.setItem("prenom",document.getElementById("inputSurname").value);
                            this.book.className  = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-block";
                            this.stations.className = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-none";
                            document.getElementById("adresseCanvas").innerHTML = this.station.address;
                            document.getElementById("nomCanvas").innerHTML = this.station.name;
                             //Evénement clique sur retour
                            this.boutonRetour.addEventListener("click", (e) => {
                                this.book.className = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-none";
                                this.stations.className = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-block";
                            });
                        }else{
                            alert("Vous avez oublié d'inscrire votre Prénom ou ne respectez pas * !!");
                        }
                    }else{
                        alert("Vous avez oublié d'inscrire votre Nom ou ne respectez pas * !!");
                    }
                }else{
                    alert("aucun vélos de disponible dans cette station");
                }
            });
            //Evénement clique sur valider après le canvas
            this.validation = document.getElementById("validation");
            this.validation.addEventListener('click', () => {
                //affichage dans partie du bas de la sauvegarde du nom et adresse station (getIn)
                document.querySelector('#reservationInfo .affichageStation').innerHTML = (sessionStorage.getItem("nomStation"));
                document.querySelector('#reservationInfo .affichageAdresse').innerHTML = (sessionStorage.getItem("adresse"));
            });
        });
    }
}

