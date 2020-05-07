let timer = null;
class Timer {
    constructor(endTime = null) { // endTime = heure de fin optionelle
        this.timer;
        this.endTime = endTime;
        this.manageTimer();
        this.btnAnnuler = document.getElementById('annuler');
        this.showResult();
        this.etatReservation = document.querySelector('#reservationInfo .affichageTimer');
    }
    // Méthode pour canvas, click événement bouton valider, si déjà réservation(Tmer tourne) = clearInterval (une seule réser)
    stop = () => {
        clearInterval(this.timer);
    }
    manageTimer = () => {
        if (this.endTime === null) { //si pas heure de fin au constructeur alors creation d'un new timer de 20 min
            this.now = new Date(); // créer Date du moment(depuis jan 1970 en millisecondes)
            this.endTime = this.now.getTime() + 20 * 60 * 1000; // ajout 20 min à this.now en transformant le calcul en milli-sec
        }
        sessionStorage.setItem("timerEnd", this.endTime);
        this.timer = setInterval(this.showResult, 1000);

        // addEvent sur le bouton annuler
        document.getElementById('annuler').addEventListener('click', () => {
            sessionStorage.clear("timerEnd");
            clearInterval(this.timer);
            sessionStorage.clear('adresse');
            sessionStorage.clear('nomStation');
            document.querySelector('#reservationInfo .affichageStation').innerHTML = "";
            document.querySelector('#reservationInfo .affichageAdresse').innerHTML = "";
            this.etatReservation.innerHTML = "Votre annulation a bien été prit en compte"
        })
    }
    showResult = () => {
        this.now = new Date(); // créer Date du moment(depuis jan 1970 en millisecondes)
        this.timerNow = this.now.getTime();//envoie la valeur numérique correspondant au temps pour la date renseignée

        this.remainingSeconds = (this.endTime - this.timerNow) / 1000;
        if (this.remainingSeconds <= 0) {
            clearInterval(this.timer);
            document.querySelector('#reservationInfo .affichageTimer').innerHTML = "Réservation terminée";
            sessionStorage.clear("timerEnd");
            return;
        }
        this.min = Math.floor(this.remainingSeconds / 60);//Retourne l'entier le plus proche
        this.sec = Math.floor(this.remainingSeconds - this.min * 60);
        // if (min<10) min = '0' + min;
        // if (sec<10) sec = '0' + sec;
        this.textContent = this.min.toString().padStart(2, '0') + ":" + this.sec.toString().padStart(2, '0');
        document.querySelector('#reservationInfo .affichageTimer').innerHTML = this.textContent;
    }
}