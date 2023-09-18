const carColors = ['red', 'lightskyblue', 'yellow', 'orange', 'purple', 'pink', 'forestgreen'];
const carInfo = [[0.5, [1]], [1, [1]], [2, [1,2]], [3,[1,2,3]], [4,[1,2]], [6,[2]], [9,[3]]];
var prevRoad = 0;
var score = 0;
var passed = [];
var gameActive = true;
var muted = true;
const trafficSound = new Audio('sounds/traffic.mp3');
trafficSound.loop = true;
trafficSound.volume = 0;
const crashSound = new Audio('sounds/crash.mp3');
crashSound.volume = 0;


function updatePlayer() {
    var player = document.querySelector('#player');
    var square = player.getBoundingClientRect();
    this.playerTop = square.top;
    this.playerLeft = square.left;
    this.playerBottom = square.bottom;
    this.playerRight = square.right;
}

function updateScore() {
    updatePlayer();
    document.querySelectorAll('.car').forEach(function (cars) {
        var car = cars.getBoundingClientRect();
        
        if (car.top <= this.playerBottom && car.bottom >= this.playerTop && car.left <= this.playerRight && car.right >= this.playerLeft) {
            if (gameActive) { 
                gameOver();
            }
        }
    });
    
    document.querySelectorAll('.road').forEach(function (road) {
        if (road.getBoundingClientRect().bottom < this.playerTop && !passed.includes(road)) {
            score++;
            document.querySelector('#score').innerHTML = score;
            passed.push(road);
        }
    });
};

function gameOver() {
    gameActive = false;
    crashSound.play();
    trafficSound.volume = 0;
    document.querySelector('html').style.overflow = 'hidden';
    document.querySelector('#gameover-score').innerHTML = 'Score: ' + score;
    document.querySelector('#gameover-dialog').style.display = 'block';
}

function removeComponents() {
    document.querySelectorAll('.component').forEach(function (component) {
        if (component.getBoundingClientRect().bottom < -200) { 
            component.remove();
            if (component.classList.contains('road')) {
                passed.shift();
            }
        }
    });
}

function addPavement() {
    prevRoad = 0;
    var pavement = document.createElement('div');
    pavement.classList.add('component');
    pavement.classList.add('pavement');
    if (Math.floor(Math.random() * 4) + 1 == 2) {
        var rocks = document.createElement('div');
        rocks.classList.add('rocks');
        rocks.appendChild(document.createElement('div'));
        rocks.appendChild(document.createElement('div'));
        rocks.appendChild(document.createElement('div'));
        rocks.style.top = Math.floor(Math.random() * 60) + 20 + '%';
        rocks.style.left = Math.floor(Math.random() * 60) + 20 + '%';
        rocks.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
        pavement.appendChild(rocks);
    }

    if (Math.floor(Math.random() * 4) + 1 == 3) {
        var bush = document.createElement('div');
        bush.classList.add('bush');
        bush.style.top = Math.floor(Math.random() * 50) + 10 + '%';
        bush.style.left = Math.floor(Math.random() * 60) + 20 + '%';
        bush.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
        pavement.appendChild(bush);
    }

    if (Math.floor(Math.random() * 4) + 1 == 1) {
        var flower = document.createElement('div');
        flower.classList.add('flower');
        flower.style.top = Math.floor(Math.random() * 50) + 20 + '%';
        flower.style.left = Math.floor(Math.random() * 60) + 20 + '%';
        flower.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
        pavement.appendChild(flower);
    }


    document.querySelector('#main').appendChild(pavement);
}

function addRoad() {
    if (prevRoad == 1) {
        const stripes = document.createElement('ul');
        stripes.classList.add('component');
        stripes.classList.add('stripes');
        for (i = 0; i < 13; i++) {
            stripes.appendChild(document.createElement('li'));
        }
        document.querySelector('#main').appendChild(stripes);
    } 

    prevRoad = 1;
    var randomColor = carColors[Math.floor(Math.random() * carColors.length)];
    var randomCarInfo = carInfo[Math.floor(Math.random() * carInfo.length)];
    var randomSpeed = randomCarInfo[0];
    var randomNumber = randomCarInfo[1][Math.floor(Math.random() * randomCarInfo[1].length)];
    var randomDirection = Math.floor(Math.random() * 2) + 1;

    var road = document.createElement('div');
    road.classList.add('component');
    road.classList.add('road');

    var car = document.createElement('div');
    car.classList.add('car');

    car.style.backgroundColor = randomColor;
    car.style.animation = 'car-move-' + randomDirection + ' ' + randomSpeed + 's linear infinite';

    delay = 0;
    for (i = 0; i < randomNumber; i++) {
        var carClone = car.cloneNode(true);
        carClone.style.animationDelay = delay + 's';
        road.appendChild(carClone);
        delay += randomSpeed / randomNumber;
    }

    document.querySelector('#main').appendChild(road);
}

function generate() {
    var loadPoint = 2 * window.innerHeight;
    var currentPoint = document.querySelector('#main').getBoundingClientRect().bottom;
    if (currentPoint < loadPoint) {
        for (j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
            addRoad();
        }

        for (j = 0; j < Math.floor(Math.random() * 2) + 1; j++) {
            addPavement();

        }
        loadPoint += window.innerHeight;
    }
}

function changeMute() {
    if (muted) {
        trafficSound.volume = 0.1;
        crashSound.volume = 0.5;
        document.querySelector('#mute').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" fill="currentColor"/></svg>';
        muted = false;
    }

    else {
        trafficSound.volume = 0;
        crashSound.volume = 0;
        document.querySelector('#mute').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" fill="currentColor"/></svg>';
        muted = true;
    }
}
document.querySelector('#mute').addEventListener('click', changeMute);

document.querySelector('#restart').addEventListener('click', function () {
    score = 0;
    document.querySelector('#score').innerHTML = score;
    prevRoad = 0;
    passed = [];
    document.querySelectorAll('.component').forEach(function (component) {
        component.remove();
    });
    document.querySelector('#gameover-dialog').style.display = 'none';
    document.querySelector('html').style.overflow = 'auto';
    gameActive = true;
    trafficSound.volume = muted ? 0 : 0.1;
});

window.addEventListener('scroll', function () {
    trafficSound.play();
});

setInterval(generate, 10);
setInterval(updateScore, 10);
setInterval(removeComponents, 1000);