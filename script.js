const imgBird = document.querySelector('.imgBird');
const tagMain = document.querySelector('main');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;
    let points = 0;
    
    document.addEventListener('mousedown',(event)=>{
        if (event.button === 0 && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;
            gravity();
            flapTheWings();
            const progress = new Progress();
            const barreiras = new Barriers(700, 550, 250, 400, ()=>progress.updatePoints(++points));
            
            tagMain.appendChild(progress.element);
            barreiras.pares.forEach(par => tagMain.appendChild(par.element));
            
            const animaGame = setInterval(()=>{
                if(colidiu(imgBird,barreiras)){
                    clearInterval(animaGame);
                }
                barreiras.animar();
            }, 20)
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;
            
            gravity();
            flapTheWings();
            const progress = new Progress();
            const barreiras = new Barriers(700, 550, 250, 400, ()=>progress.updatePoints(++points));
            
            tagMain.appendChild(progress.element);
            barreiras.pares.forEach(par => tagMain.appendChild(par.element));
            
            const animaGame = setInterval(()=>{
                if(colidiu(imgBird,barreiras)){
                    clearInterval(animaGame);
                }
                barreiras.animar();
            }, 20)
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
    //* Maybe implement a logic that when hitting the top or the ground, it is considered as game over
    const flap = ()=>{
        if (heightBirdInPx - 150 >= 0) {
            let flapSetInterval= setInterval(() => {
                heightBirdInPx -=4;
                imgBird.style.top = heightBirdInPx + 'px';
            }, 8);
            
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
            const meio = (largura / 2) -200;
            const cruzouOMeio = par.getX() + deslocamento >=meio && par.getX() < meio;
            
            if(cruzouOMeio){
                notificarPonto();
            } 
        })
    }
}

function Progress(){
    this.element = newElement('span', 'progress');
    this.updatePoints = (points) =>{
        this.element.innerHTML = points;
    }
    this.updatePoints(0);
}

//! TODO: Translate the names
function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
    
    return horizontal && vertical;
}
//! TODO: Translate the names
function colidiu(passaro, barreiras){
    let colidiu = false;

    barreiras.pares.forEach(parDeBarreiras =>{
        if (!colidiu) {
            const superior = parDeBarreiras.superior.element;
            const inferior = parDeBarreiras.inferior.element;
            colidiu = estaoSobrepostos(passaro, superior) || estaoSobrepostos(passaro, inferior);
        }
    })
    return colidiu;
}