class Diaporama {
    constructor(idContainer) {
        const container = document.getElementById(idContainer);
        this.prev = container.querySelector(".prev");
        this.next = container.querySelector(".next");
        this.play = container.querySelector(".play");
        this.pause = container.querySelector(".pause");
        this.figures = container.querySelectorAll("figure");
        this.affiche(); 
    }
    affiche(){
        // Boucle pour que image 1 = visible le reste pas visible
        this.figures[0].style.display = "block";
        for(let i = 1; i < this.figures.length; i++) {
            this.figures[i].style.display = "none"; 
        }
        this.timer = setInterval(()=>{this.nextButton()},5000);
        this.prev.addEventListener('click',() => {this.prevButton()});// () => {prevButton()})
        this.next.addEventListener('click',() => {this.nextButton()});
        this.pause.addEventListener('click',() => {this.pauseButton()});
        this.play.addEventListener('click',() => {this.playButton()});
        document.addEventListener('keydown',(e) => {this.clavier(e)});
    }
    nextButton(){
        for (let i = 0; i < this.figures.length - 1; i++) {
            if (this.figures[i].style.display === "block") {
                this.figures[i].style.display = "none";
                this.figures[i + 1].style.display = "block";
                return;
            }
        }
        this.figures[this.figures.length - 1].style.display = "none";
        this.figures[0].style.display = "block";
    }
    prevButton(){
        for (let i = this.figures.length-1; i > 0 ; i--) {
            if (this.figures[i].style.display === "block") {
                this.figures[i].style.display = "none";
                this.figures[i - 1].style.display = "block";
                return;
            }
        }
        this.figures[0].style.display = "none";
        this.figures[this.figures.length - 1].style.display = "block";
    }
    playButton(){
        this.timer = setInterval(() =>{this.nextButton()},5000);
    }
    pauseButton(){
        clearInterval(this.timer);
    }
    // Fonction clavier
    clavier(e){
        if( e.keyCode === 37){
            this.prevButton();
        }
        else if(e.keyCode === 39){
            this.nextButton();
        }
    }
}
