const imgBird = document.querySelector('.imgBird');
let wingIndex = 0;

function wingBeat() {
    const imageName = `yellowbird-${wingIndex}`;
    const imagePath = `assets/img/birds/${imageName}.png`;
    imgBird.src = imagePath;

    wingIndex = (wingIndex + 1) % 3;
    console.log(wingIndex);
}

setInterval(()=>{
    wingBeat();
}, 180);

