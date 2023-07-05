const imgBird = document.querySelector('.imgBird');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;

    document.addEventListener('mousedown',(event)=>{
        if (event.button === 0 && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
        }
    });
}
let heightBirdInPx = 350;
let rotationBirdAngle = 0
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

    const flap = ()=>{
        gravitySpeed = 0;

        heightBirdInPx -= 150;
        imgBird.style.top = heightBirdInPx + 'px';

        rotationBirdAngle = 0;
        imgBird.style.transform = `scaleX(-1) rotate(${rotationBirdAngle}deg)`;
    }
}