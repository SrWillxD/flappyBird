const imgBird = document.querySelector('.imgBird');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;

    document.addEventListener('mousedown',(event)=>{
        if (event.button === 0 && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            gameAlreadyStarted = true;

            gravity();
        }
    });
}

function gravity(){
    let heightBirdInPx = 350;
    let rotationBirdAngle = 0
    
    const intervalGravity = setInterval(()=>{
        heightBirdInPx += 1.2;
        imgBird.style.top = heightBirdInPx + 'px';

        if(rotationBirdAngle > -90){
            rotationBirdAngle -= 0.4;
            console.log(rotationBirdAngle);
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
            
        }
    });
}