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
            generatePipes();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
            generatePipes();
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
    //TODO: Change the wingbeat logic as it goes over the edge
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
//TODO: Translate the names
function generatePipes(){
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
}