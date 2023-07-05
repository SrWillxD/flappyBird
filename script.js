const imgBird = document.querySelector('.imgBird');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0 && gameAlreadyStarted === false) {
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
            console.log('O pássaro atingiu o chão.');
        }
    }, 1);
}