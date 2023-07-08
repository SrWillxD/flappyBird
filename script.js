const imgBird = document.querySelector('.imgBird');
const tagMain = document.querySelector('main');

gameInit();

function gameInit(){
    let gameAlreadyStarted = false;
    let points = 0;
    //! Transfer the contents of these two events into a function and call the function within the events
    document.addEventListener('mousedown',(event)=>{
        if (event.button === 0 && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;

            gravity();
            flapTheWings();
            const progress = new Progress();
            const barriers = new Barriers(700, 500, 250, 400, ()=>progress.updatePoints(++points));
            
            tagMain.appendChild(progress.element);
            barriers.pairs.forEach(pair => tagMain.appendChild(pair.element));
            
            const moveBarriers = setInterval(()=>{
                if(collided(imgBird, barriers)){
                    clearInterval(moveBarriers);
                }
                barriers.animate();
            }, 20);
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && gameAlreadyStarted === false) {
            gameAlreadyStarted = true;
            
            gravity();
            flapTheWings();
            const progress = new Progress();
            const barriers = new Barriers(700, 500, 250, 400, ()=>progress.updatePoints(++points));
            
            tagMain.appendChild(progress.element);
            barriers.pairs.forEach(pair => tagMain.appendChild(pair.element));
            
            const moveBarriers = setInterval(()=>{
                if(collided(imgBird,barriers)){
                    clearInterval(moveBarriers);
                }
                barriers.animate();
            }, 20)
        }
    });
}


let heightBirdInPx = 350;
let rotationBirdAngle = +5;
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
            }, 10);
            
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

function newElement(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barrier(reverse = false){
    this.element = newElement('div', 'barrier');

    const barrierEdge = newElement('div', 'barrierEdge');
    const barrierBody = newElement('div', 'barrierBody');
    this.element.appendChild(reverse ? barrierBody : barrierEdge);
    this.element.appendChild(reverse ? barrierEdge : barrierBody);

    this.setHeight = height => barrierBody.style.height = `${height}px`;
}

function PairOfBarriers(displayHeight, barrierOpening, barrierXAxis){
    this.element = newElement('div', 'pairOfBarriers');

    this.upperBarrier = new Barrier(true);
    this.bottomBarrier = new Barrier(false);

    this.element.appendChild(this.upperBarrier.element);
    this.element.appendChild(this.bottomBarrier.element);

    this.raffleBarrierOpening = () =>{
        const heightOfUpperBarrier = Math.random() * (displayHeight - barrierOpening);
        const lowerBarrierHeight = displayHeight - barrierOpening - heightOfUpperBarrier;
        this.upperBarrier.setHeight(heightOfUpperBarrier);
        this.bottomBarrier.setHeight(lowerBarrierHeight);
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = (barrierXAxis) => this.element.style.left = `${barrierXAxis}px`;
    this.getWidth = () => this.element.clientWidth;

    this.raffleBarrierOpening();
    this.setX(barrierXAxis);
}


function Barriers(displayHeight, displayWidth, barrierOpening, spaceBetweenBarriers, notifyPoint){
    this.pairs = [
        new PairOfBarriers(displayHeight, barrierOpening, displayWidth),
        new PairOfBarriers(displayHeight, barrierOpening, displayWidth + spaceBetweenBarriers),
        new PairOfBarriers(displayHeight, barrierOpening, displayWidth + spaceBetweenBarriers * 2),
        new PairOfBarriers(displayHeight, barrierOpening, displayWidth + spaceBetweenBarriers * 3)
    ]

    const numberOfPixelsPerShift = 3;
    this.animate = () => {
        this.pairs.forEach( pair =>{
            pair.setX(pair.getX() - numberOfPixelsPerShift);

            if(pair.getX() < -pair.getWidth()){
                pair.setX(pair.getX() + spaceBetweenBarriers * this.pairs.length);
                pair.raffleBarrierOpening();
            }

            const scoringLocation = (displayWidth/2) -200;
            const crossedTheScoringSite = pair.getX() + numberOfPixelsPerShift >= scoringLocation && pair.getX() < scoringLocation;
            
            if(crossedTheScoringSite){
                notifyPoint();
            } 
        });
    }
}

function Progress(){
    this.element = newElement('span', 'progress');
    this.updatePoints = (points) =>{
        this.element.innerHTML = points;
    }
    this.updatePoints(0);
}

function areTheyOverlapping(bird, barrier){
    const a = bird.getBoundingClientRect();
    const b = barrier.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;
    
    return horizontal && vertical;
}

function collided(bird, barriers){
    let collided = false;

    barriers.pairs.forEach(pairOfBarriers =>{
        if (!collided) {
            const upperBarrier = pairOfBarriers.upperBarrier.element;
            const bottomBarrier = pairOfBarriers.bottomBarrier.element;
            collided = areTheyOverlapping(bird, upperBarrier) || areTheyOverlapping(bird, bottomBarrier);
        }
    })
    return collided;
}