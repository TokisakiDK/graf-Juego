const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("contador");
const levelElement = document.getElementById("nivel");
const timeElement = document.getElementById("temporizador");

canvas.width = 1100;
canvas.height = 600;

// Variables de juego
let puntos = 0, currentLevel = 1, timeLeft = 60, gameActive = false, timerInterval;
let tiempoRelentizado = 0;
let clickDerechoListo = true;
let effectRings = []; 
let musicaIniciada = false;

// Sonidos
const sndLowShoot = new Audio('assets/sound/LowShoot.wav');
const sndHighShoot = new Audio('assets/sound/HighShoot.mp3');
const sndPlusPower = new Audio('assets/sound/PlusPower.wav');
const sndLowPower = new Audio('assets/sound/LowPower.wav');
const sndGameOver = new Audio('assets/sound/GameOver.wav');
const sndBGMusic = new Audio('assets/BGMusic.wav'); 

sndBGMusic.loop = true;
sndBGMusic.volume = 0.5; 
sndBGMusic.load(); 

// Fondos de Niveles
const bgPaths = [
    'assets/bg/Bedroom.png', 
    'assets/bg/Room.png',    
    'assets/bg/Bed.png',     
    'assets/bg/Party.png',   
    'assets/bg/RoomN.png',   
    'assets/bg/RoomH.png',   
    'assets/bg/Star.png'     
];
const bgImgs = bgPaths.map(src => {
    const img = new Image(); img.src = src; return img;
});

// Imágenes de Enemigos (Neru incluida)
const enemyImgs = ['Kurumi.png', 'Lugia.png', 'Miku.png', 'Rayquaza.png', 'Teto.png', 'Neru.png']
    .map(name => { const img = new Image(); img.src = `assets/obj/${name}`; return img; });

// SISTEMA DE NIVELES CENTRALIZADO
function addPoints(amount) {
    puntos += amount;
    scoreElement.innerText = puntos;
    
    let newLevel = Math.floor(puntos / 20) + 1;
    if (newLevel > currentLevel) {
        currentLevel = newLevel;
        levelElement.innerText = currentLevel;
        
        timeLeft += 15; 
        timeElement.innerText = timeLeft;
        
        sndPlusPower.currentTime = 0;
        sndPlusPower.play().catch(()=>{});
        
        for(let i=0; i<40; i++) {
            particles.push(new Particle(canvas.width/2, canvas.height/2, "#00fbff", false));
        }
    }
}

// CLASES
class Particle {
    constructor(x, y, color, isDiscreet = false) {
        this.x = x; this.y = y; this.color = color;
        this.size = isDiscreet ? Math.random() * 2 + 1 : Math.random() * 5 + 2;
        this.dx = (Math.random() - 0.5) * (isDiscreet ? 4 : 15); 
        this.dy = (Math.random() - 0.5) * (isDiscreet ? 4 : 15);
        this.life = 1.0;
        this.decayRate = isDiscreet ? 0.08 : 0.03; 
    }
    draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    update() { this.x += this.dx; this.y += this.dy; this.life -= this.decayRate; }
}

class PowerUp {
    constructor(type) {
        this.type = type; 
        this.radius = 20;
        this.x = Math.random() * (canvas.width - this.radius*2) + this.radius;
        this.y = -this.radius;
        this.speed = Math.random() * 2 + 1;
        this.hue = 0;
    }
    draw() {
        if (this.type === "RGB") {
            this.hue += 5;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        } else {
            ctx.fillStyle = "#a8a8a8";
        }
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    update() { this.y += this.speed; }
}

class AutoBullet {
    constructor(x, y, angle) {
        this.x = x; this.y = y;
        this.radius = 8;
        this.speed = 8;
        this.dx = Math.cos(angle) * this.speed;
        this.dy = Math.sin(angle) * this.speed;
        this.hue = 0;
    }
    draw() {
        this.hue += 15; 
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    update() { this.x += this.dx; this.y += this.dy; }
}

class Enemy {
    constructor() { this.init(); }
    init() {
        this.size = Math.random() * 20 + 50; 
        this.radius = this.size / 2;
        this.img = enemyImgs[Math.floor(Math.random() * enemyImgs.length)];
        this.x = Math.random() * (canvas.width - this.size) + this.radius;
        this.y = Math.random() * (canvas.height - this.size) + this.radius;
        
        this.moveType = Math.floor(Math.random() * 4);
        
        let baseSpeed = Math.random() * 2 + 1;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
        this.angle = Math.random() * Math.PI * 2;
        this.mass = this.size;
    }
    draw() {
        if (this.img.complete && this.img.naturalWidth !== 0) {
            ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.size, this.size);
        }
    }
    update() {
        let levelDifficulty = 1 + (currentLevel * 0.15); 
        let mult = tiempoRelentizado > 0 ? 0.2 : levelDifficulty; 

        if (this.moveType === 0) { this.y += Math.abs(this.dy) * mult; } 
        else if (this.moveType === 1) { this.y -= Math.abs(this.dy) * mult; } 
        else if (this.moveType === 2) { this.x += this.dx * mult; this.y += this.dy * mult; } 
        else if (this.moveType === 3) { 
            this.angle += 0.03 * mult;
            this.x += Math.cos(this.angle) * 3 * mult;
            this.y += Math.sin(this.angle) * 3 * mult;
        }

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.dx *= -1;
        if (this.y - this.radius > canvas.height) this.y = -this.radius;
        if (this.y + this.radius < 0) this.y = canvas.height + this.radius;
    }
}

let enemies = [], particles = [], powerups = [], autoBullets = [];

document.body.addEventListener("mousedown", () => {
    if (!musicaIniciada && timeLeft > 0) {
        let promesa = sndBGMusic.play();
        if (promesa !== undefined) {
            promesa.then(() => musicaIniciada = true).catch(e => console.log("Bloqueado: ", e));
        }
    }
});

function startGame() {
    if (gameActive) return;
    gameActive = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    sndBGMusic.pause();
    sndBGMusic.currentTime = 0; 
    sndGameOver.play();
}

function checkCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            let e1 = enemies[i], e2 = enemies[j];
            let dx = e1.x - e2.x;
            let dy = e1.y - e2.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            let minDist = e1.radius + e2.radius;

            if (dist < minDist) {
                let overlap = minDist - dist;
                e1.x += (dx/dist) * (overlap/2); e1.y += (dy/dist) * (overlap/2);
                e2.x -= (dx/dist) * (overlap/2); e2.y -= (dy/dist) * (overlap/2);
                e1.dx *= -1; e1.dy *= -1; e2.dx *= -1; e2.dy *= -1;
                particles.push(new Particle(e1.x - dx/2, e1.y - dy/2, "#ffffff", true));
            }
        }
    }
}

canvas.addEventListener("contextmenu", e => e.preventDefault());

canvas.addEventListener("mousedown", (e) => {
    if (timeLeft <= 0) return;
    if (sndBGMusic.paused) sndBGMusic.play().catch(()=>{});
    startGame();
    
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (e.button === 2 && clickDerechoListo) {
        sndHighShoot.currentTime = 0; sndHighShoot.play();
        clickDerechoListo = false;
        effectRings.push({x: mx, y: my, r: 0, maxR: 150, life: 1});
        
        enemies.forEach(en => {
            let dist = Math.sqrt((mx-en.x)**2 + (my-en.y)**2);
            if (dist < 150) {
                addPoints(1); 
                for(let k=0; k<10; k++) particles.push(new Particle(en.x, en.y, "#00fbff", false));
                en.init(); 
            }
        });
        setTimeout(() => clickDerechoListo = true, 5000); 
    } 
    else if (e.button === 0) {
        let caughtSomething = false;
        
        powerups.forEach((pu, i) => {
            if (Math.sqrt((mx-pu.x)**2 + (my-pu.y)**2) < pu.radius) {
                if (pu.type === "RGB") {
                    sndPlusPower.currentTime = 0; sndPlusPower.play();
                    // LÓGICA DE METRALLA (Se mantiene, pero ya NO suma tiempo)
                    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
                        autoBullets.push(new AutoBullet(pu.x, pu.y, angle));
                    }
                } else {
                    tiempoRelentizado = 300; 
                    sndLowPower.currentTime = 0; sndLowPower.play();
                }
                for(let k=0; k<15; k++) particles.push(new Particle(pu.x, pu.y, pu.type==="RGB"?"#ff0":"#fff", false));
                powerups.splice(i, 1);
                caughtSomething = true;
            }
        });

        enemies.forEach(en => {
            if (!caughtSomething && Math.sqrt((mx-en.x)**2 + (my-en.y)**2) < en.radius) {
                addPoints(1); 
                sndLowShoot.currentTime = 0; sndLowShoot.play();
                for(let k=0; k<10; k++) particles.push(new Particle(en.x, en.y, "#ff2d2d", false));
                en.init(); 
                caughtSomething = true;
            }
        });
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let bgIndex = (currentLevel - 1) % bgImgs.length; 
    let currentBg = bgImgs[bgIndex];
    
    if (currentBg && currentBg.complete) {
        ctx.globalAlpha = tiempoRelentizado > 0 ? 0.3 : 0.6; 
        ctx.drawImage(currentBg, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
    }

    if (timeLeft > 0) {
        if (tiempoRelentizado > 0) tiempoRelentizado--;
        
        if (gameActive && powerups.length < 2) {
            // --- ACTUALIZADO: Bolita RGB ahora es SÚPER RARA (0.0005) ---
            if (Math.random() < 0.0005) powerups.push(new PowerUp("RGB"));
            else if (Math.random() < 0.0008) powerups.push(new PowerUp("GREY"));
        }

        checkCollisions();

        powerups.forEach((pu, i) => { 
            pu.update(); pu.draw(); 
            if (pu.y > canvas.height + 50) powerups.splice(i, 1);
        });

        enemies.forEach(en => { en.update(); en.draw(); });

        autoBullets.forEach((bullet, bi) => {
            bullet.update(); bullet.draw();
            enemies.forEach(en => {
                let dist = Math.sqrt((bullet.x - en.x)**2 + (bullet.y - en.y)**2);
                if (dist < bullet.radius + en.radius) {
                    addPoints(1); 
                    sndLowShoot.currentTime = 0; sndLowShoot.play().catch(()=>{});
                    for(let k=0; k<10; k++) particles.push(new Particle(en.x, en.y, "#ff2d2d", false));
                    en.init(); 
                }
            });
            if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
                autoBullets.splice(bi, 1);
            }
        });

        particles.forEach((p, i) => { 
            p.update(); p.draw(); 
            if (p.life <= 0) particles.splice(i, 1); 
        });

        effectRings.forEach((ring, i) => {
            ring.r += 10; ring.life -= 0.05;
            ctx.globalAlpha = Math.max(0, ring.life);
            ctx.strokeStyle = "#00fbff"; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1.0;
            if (ring.life <= 0) effectRings.splice(i, 1);
        });

        if (!gameActive) {
            ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "bold 30px Arial";
            ctx.fillText("HAZ CLIC PARA COMENZAR LA CAZA", canvas.width/2, canvas.height/2);
        }
    } else {
        ctx.fillStyle = "red"; ctx.textAlign = "center"; ctx.font = "bold 50px Arial";
        ctx.fillText("¡TIEMPO AGOTADO!", canvas.width/2, canvas.height/2 - 20);
        ctx.fillStyle = "white"; ctx.font = "30px Arial";
        ctx.fillText(`Nivel alcanzado: ${currentLevel} | Puntos: ${puntos}`, canvas.width/2, canvas.height/2 + 30);
    }
    requestAnimationFrame(animate);
}

document.getElementById("btn-reset").addEventListener("click", () => location.reload());

for(let i=0; i<25; i++) enemies.push(new Enemy());
animate();