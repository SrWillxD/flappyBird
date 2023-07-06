const imgBird = document.querySelector('.imgBird');
const tagMain = document.querySelector('main');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;

    document.addEventListener('mousedown',(event)=>{
        if (event.button === 0 && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
            //generatePipes();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
            //generatePipes();
        }
    });
}
let heightBirdInPx = 350;
let rotationBirdAngle = +5
let gravitySpeed = 0;

function gravity(){
    const intervalGravity = setInterval(()=>{
        gravitySpeed += 0.01;
        heightBirdInPx += gravitySpeed + 0.1;
        imgBird.style.top = heightBirdInPx + 'px';

        if(rotationBirdAngle > -90){
            rotationBirdAngle -= 0.2;
            imgBird.style.transform = `scaleX(-1) rotate(${rotationBirdAngle}deg)`;
        }

        if (heightBirdInPx >= 643) {
            clearInterval(intervalGravity);
        }
    }, 1);
}

function flapTheWings (){
    document.addEventListener('mousedown',(event)=>{
        if(event.button === 0){
            flap();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            flap();
        }
    });
    //! TODO: Change the wingbeat logic as it goes over the edge
    const flap = ()=>{
        if (heightBirdInPx - 150 >= 0) {
            let flapSetInterval= setInterval(() => {
                heightBirdInPx -=4;
                imgBird.style.top = heightBirdInPx + 'px';
            }, 6);
            
            gravitySpeed = 0;
            rotationBirdAngle = +10;
            imgBird.style.transform = `scaleX(-1) rotate(${rotationBirdAngle}deg)`;
            
            setTimeout(() => {
                clearInterval(flapSetInterval);
            }, 300);
        }else{
            heightBirdInPx -= heightBirdInPx;
            imgBird.style.top = heightBirdInPx + 'px';
            gravitySpeed = 0;
            rotationBirdAngle = +10;
            imgBird.style.transform = `scaleX(-1) rotate(${rotationBirdAngle}deg)`;
        }
        
    }
}
//! TODO: Translate the names
/*function generatePipes(){
    let parDeBarreiras = document.createElement('div');
    tagMain.appendChild(parDeBarreiras);
    parDeBarreiras.classList.add('parDeBarreiras');

    let corpoCima = document.createElement('div');
    corpoCima.classList.add('corpo')
    let corpoBaixo = document.createElement('div');
    corpoBaixo.classList.add('corpo')

    let bordaCima = document.createElement('div');
    bordaCima.classList.add('borda')
    let bordaBaixo = document.createElement('div');
    bordaBaixo.classList.add('borda')

    let barreiraCima = document.createElement('div');
    barreiraCima.classList.add('barreira');
    parDeBarreiras.appendChild(barreiraCima);
    barreiraCima.appendChild(corpoCima)
    barreiraCima.appendChild(bordaCima)

    let barreiraBaixo = document.createElement('div');
    barreiraBaixo.classList.add('barreira');
    parDeBarreiras.appendChild(barreiraBaixo);
    barreiraBaixo.appendChild(bordaBaixo)
    barreiraBaixo.appendChild(corpoBaixo)
}*/
//! TODO: Translate the names
function newElement(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}
//! TODO: Translate the names
function Barrier(reverse = false){
    this.element = newElement('div', 'barreira');

    const borda = newElement('div', 'borda');
    const corpo = newElement('div', 'corpo');
    this.element.appendChild(reverse ? corpo : borda);
    this.element.appendChild(reverse ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`
}
//! TODO: Translate the names
function PairOfBarriers(altura, abertura, x){
    this.element = newElement('div', 'parDeBarreiras');

    this.superior = new Barrier(true);
    this.inferior = new Barrier(false);

    this.element.appendChild(this.superior.element);
    this.element.appendChild(this.inferior.element);

    this.sortearAbertura = () =>{
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = (x) => this.element.style.left = `${x}px`;
    this.getLargura = () => this.element.clientWidth;

    this.sortearAbertura();
    this.setX(x);
}

/*const b = new PairOfBarriers(700, 200, 400);
tagMain.appendChild(b.element);*/

function Barriers(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new PairOfBarriers(altura, abertura, largura),
        new PairOfBarriers(altura, abertura, largura + espaco),
        new PairOfBarriers(altura, abertura, largura + espaco * 2),
        new PairOfBarriers(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3;
    this.animar = () => {
        this.pares.forEach(par=>{
            par.setX(par.getX() - deslocamento);

            if(par.getX() < -par.getLargura()){
                //! This can cause problems as the width will be different
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            }
            //!The bird is not positioned in the middle, it will probably cause problems
            const meio = largura / 2;
            const cruzouOMeio = par.getX() + deslocamento <=meio && par.getX() < meio;
            //if(cruzouOMeio)notificarPonto
        })
    }
}

const barreiras = new Barriers(700, 550, 250, 400);

barreiras.pares.forEach(par => tagMain.appendChild(par.element));

setInterval(()=>{
    barreiras.animar();
}, 20)
