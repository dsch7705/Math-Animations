// Canvas
var c, ctx, cw, ch 
// Element colliders
const colliders = []

// Event listeners
window.addEventListener('resize', (event) => {
    cw = c.width = window.innerWidth;
    ch = c.height = window.innerHeight;

    document.querySelectorAll('.collider').forEach((c, i) => {
        colliders[i] = (c.getBoundingClientRect());
    })
});



var maxV = 125;

var appTime = 0.0;
var frmStart = Date.now();
var dT = 0;

function pick_rand(min, max)
{
    return Math.random() * (max - min) + min;
}
class Vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    
    add(other)
    {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other)
    {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    scale(factor)
    {
        return new Vec2(this.x * factor, this.y * factor);
    }
    dot(other)
    {
        return this.x * other.x + this.y * other.y;
    }
    mag()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    norm()
    {
        return this.scale(1 / this.mag());
    }
    dist(other)
    {
        
        return other.sub(this).mag();
    }
}

// event listeners
var mouse = new Vec2(0, 0);
var mouseRadius = 75;
document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

class Dot
{
    constructor(x, y, r)
    {
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(pick_rand(-maxV, maxV), pick_rand(-maxV, maxV));
        this.r = r;
    }
    
    draw(dT)
    {
        // Move
        this.pos = this.pos.add(this.vel.scale(dT));
        
        // Bounce
        // Edges
        if (this.pos.x + this.vel.x * dT > cw || this.pos.x + this.vel.x < 0)
            this.vel.x = -this.vel.x;
        if (this.pos.y + this.vel.y * dT > ch || this.pos.y + this.vel.y * dT < 0)
            this.vel.y = -this.vel.y;
        // Colliders
        colliders.forEach((c) => {
            let bL, tL, tR, bR;
            bL = new Vec2(c.left, c.bottom);
            tL = new Vec2(c.left, c.top);
            tR = new Vec2(c.right, c.top);
            bR = new Vec2(c.right, c.bottom);

            let lEdge, tEdge, rEdge, bEdge, lDot, tDot, rDot, bDot;
            lEdge = tL.sub(bL);
            tEdge = tR.sub(tL);
            rEdge = bR.sub(tR);
            bEdge = bL.sub(bR);
            lDot = this.pos.sub(bL).dot(lEdge) / Math.pow(lEdge.mag(), 2);
            tDot = this.pos.sub(tL).dot(tEdge) / Math.pow(tEdge.mag(), 2);
            rDot = this.pos.sub(tR).dot(rEdge) / Math.pow(rEdge.mag(), 2);
            bDot = this.pos.sub(bR).dot(bEdge) / Math.pow(bEdge.mag(), 2);
            lDot = Math.max(0, Math.min(1, lDot));
            tDot = Math.max(0, Math.min(1, tDot));
            rDot = Math.max(0, Math.min(1, rDot));
            bDot = Math.max(0, Math.min(1, bDot));

            let closestL, closestT, closestR, closestB, closestP;
            closestL = bL.add(lEdge.scale(lDot));
            closestT = tL.add(tEdge.scale(tDot));
            closestR = tR.add(rEdge.scale(rDot));
            closestB = bR.add(bEdge.scale(bDot));
            
            closestP = closestL;
            if (this.pos.dist(closestT) < this.pos.dist(closestP)) { closestP = closestT; }
            if (this.pos.dist(closestR) < this.pos.dist(closestP)) { closestP = closestR; }
            if (this.pos.dist(closestB) < this.pos.dist(closestP)) { closestP = closestB; }

            // Reflection
            if (this.pos.add(this.vel.scale(dT)).dist(closestP) < this.r)
            {
                let normal = this.pos.sub(closestP).norm();
                this.vel = this.vel.sub(normal.scale(this.vel.dot(normal) * 2));
            }
            // Tunneling correction
            if (rectContainsPoint(c, this.pos))
            {
                let normal = closestP.sub(this.pos).norm();
                this.pos = closestP.add(normal.scale(this.r));
                this.vel = this.vel.sub(normal.scale(this.vel.dot(normal) * 2));
            }
        });

        ctx.fillStyle = 'rgba(158, 178, 207, 0.5)';
        circle(this.pos, this.r);
    }
}

const dotCnt = 100;
var dots = [dotCnt];
function setup()
{
    // Canvas
    c = document.createElement('canvas');
    ctx = c.getContext('2d');
    cw = c.width = window.innerWidth;
    ch = c.height = window.innerHeight;
    // Dots
    for (let i = 0; i < dotCnt; i++)
    {
        dots[i] = new Dot(Math.random() * cw, Math.random() * ch, pick_rand(10, 50));
    }
    // Collider elements
    document.querySelectorAll('.collider').forEach((c) => {
        colliders.push(c.getBoundingClientRect());
    });

    // Start
    requestAnimationFrame(update)
}
function update() 
{
    // delta time
    var current = Date.now();
    dT = (current - frmStart) / 1000;
    if (dT > 1.5)   // lag spike, tabbed out
        dT = 0;
    frmStart = current;
    
    clear_bg('rgb(207, 187, 158)');
    for (let i = 0; i < dotCnt; i++)
    {
        dots[i].draw(dT);
    }
    
    document.body.style.background = 'url(' + c.toDataURL() + ')';
    requestAnimationFrame(update);
}
function clear_bg(color)
{
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, c.width, c.height);
}
function circle(pos, r)
{
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fill();
}
function rectContainsPoint(rect, point)
{
    if (point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom)
        return true;

    return false;
}

window.onload = setup();