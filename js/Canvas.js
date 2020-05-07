class Canvas {
  constructor(idCanvas) {
    this.canvas = document.getElementById(idCanvas);
    this.ctx = this.canvas.getContext("2d");
    this.isSigned = false;
    this.initCanvas();
    this.getSignature();
    this.clear();
    this.validation();
    this.timer=null;
  }

  initCanvas() {
    this.ctx.strokeStyle = "aqua";
  }
  getSignature = () => {
    this.canvas.addEventListener('mousedown', e => { //met en place une fonction à appeler chaque fois que l'événement spécifié est activé
    this.mousedown(e);
    });
    // Quand évenement mouseup = on enléve/arrête/bloque le EventListener = stopDraw 
    this.canvas.addEventListener('mouseup', e => {
      this.canvas.removeEventListener('mousemove', this.draw)
    });
    this.canvas.addEventListener('touchstart', e => {
      this.mousedown(e);
    });
    // touch end
    this.canvas.addEventListener('touchend', e => {
      this.canvas.removeEventListener('touchmove', this.drawTouch);
    });
  }
    // Quand on appuie 
  mousedown(e){
    let rect = this.canvas.getBoundingClientRect(); // renvoie la taille de l'élément et sa position relative par rapport à la zone d'affichage 
    let x;
    let y;
    // Si souris = décalage sur l'axe X/Y du pointeur de la souris entre l'évènement et la bordure
    if (e.type == 'mousedown') {
      x = e.offsetX;//fournit le décalage sur l'axe X du pointeur de la souris
      y = e.offsetY;
    // Si touch
    }else {
      x = e.targetTouches[0].clientX - rect.left;
      y = e.targetTouches[0].clientY - rect.top;
    }
    this.ctx.beginPath();//initialisation un nouveau chemin
    this.ctx.moveTo(x, y);//on déplace le « crayon » à l'endroit où on souhaite commencer le tracé, c'est le point de départ du chemin
    if (e.type == 'mousedown') {
    this.canvas.addEventListener('mousemove', this.draw) // méthode souris
    }else{
      this.canvas.addEventListener('touchmove', this.drawTouch);// ou méthode touch
    } 
  }

    draw = (e) => {
    this.ctx.lineTo(e.offsetX, e.offsetY);//indique un deuxième point, un troisième, etc.
    this.isSigned = true;
    this.ctx.stroke();//dessine le chemin actuel
  }
   drawTouch = e => {
     e.preventDefault();//son action par défaut ne doit pas être prise en compte comme elle le serait normalement
     e.stopPropagation();//Évite que l'évènement courant ne se propage plus loin
    let rect = this.canvas.getBoundingClientRect(); // renvoie la taille d'un élément et sa position relative par rapport à la zone d'affichage 
    let x = e.targetTouches[0].clientX - rect.left;
    let y = e.targetTouches[0].clientY - rect.top;
    this.ctx.lineTo(x, y);
    this.isSigned = true;
    this.ctx.stroke();
  }
  // addEvent Bouton "delete"
  clear() {
    this.delete = document.getElementById("delete");
    this.delete.addEventListener('click', () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.isSigned = false;
    });
  }
  repriseTimer(endTimer) {
    this.timer = new Timer(endTimer);// on recreer un new timer avec heure de fin sauvé
  }
  //addEvent Bouton "valider"
  validation() {
    this.validation = document.getElementById("validation");
    this.validation.addEventListener('click', () => {
      // Vérif signature === true
      if(this.isSigned){
        alert("Votre reservation a bien été prise");
        // Si Timer est déja existant,(donc déjà réservation) clearInterval du Timer
        if(this.timer !== null){
          this.timer.stop();//clearInterval
        }
        // création du Timer
        this.timer = new Timer();                
        this.book = document.getElementById("book");
        this.stations = document.getElementById("stations");
        this.book.className = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-none";
        this.stations.className = "border m-4 shadow-lg p-3 mb-5 rounded bg-light d-block";
      }else{
      alert("Vous avez sûrement oublié de signer..");
      }
    });
  }         
}

