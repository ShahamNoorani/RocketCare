var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

var start = false
var timedMode = false
var endlessMode = false
var impossibleMode = false

var lives = 3
var score = 0
var lastScore = 0
var time = 0
var level = 1
var lose = false
var levelBuffer = 0
var mid = false

var big = false
var bigTimer = 0

var show = false
var showing = 60
var fail = false
var failing = 60

var gravity = -0.1
var mouseX = 0
var mouseY = 0
var click = false

var endlessButtonColor = "rbg(255, 255, 255)"
var timedButtonColor = "#2d25a8"
var impossibleButtonColor = "rgb(160, 0, 0)"

var targets = []
for (var i = 0; i < level * 4; i++) {
    targets[i] = {
      x: Math.random() * (canvas.width-100),
      y: Math.random() * (canvas.height-100)
    }
  }
  
var stars = []
for (var i = 0; i < 500; i++) {
    stars[i] = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.sqrt(Math.random() * 2),
      alpha: 1.0,
      decreasing: true
    }
  }

  var spaceship =
  {
      color: "skyblue",
      width: 8,
      height: 22,
      position:
      {
          x: 400,
          y: 300
      },
      angle: 0,
      velocity: 
      {
          x: 0,
          y: 0
      },
      engineOn: false,
      rotatingLeft: false,
      rotatingRight: false,
      thrust: -0.3
  }

canvas.addEventListener('click', function(evt) {  
    click = true
})

function setMouseXY(event)
{
    mouseX = event.clientX
    mouseY = event.clientY
}

function titleScreen()
{
    if(start == false)
    {
        requestAnimationFrame(titleScreen)
    }   
    else
    {
        restart()
        draw()
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStars()
    context.fillStyle = "gray"
    context.font = "normal 60px Lato"
    context.fillText("Rocket Care", 250, 240)
    context.font = "normal 10px Lato"
    context.fillText("Use the arrow keys to manuever your ship to collect the hearts. When you collect all the hearts,", 15, 550)
    context.fillText("you go to the next level. Click enter to return to the title screen.", 15, 575)
    context.closePath()
    context.beginPath()
    // endless mode button
    context.fillStyle = endlessButtonColor
    context.rect(100, 380, 160, 40)
    context.fill()
    context.closePath()
    context.beginPath()
    // timed mode button
    context.fillStyle = timedButtonColor
    context.rect(300, 380, 160, 40)
    context.fill()
    context.closePath()
    context.beginPath()
    // impossible mode button
    context.fillStyle = impossibleButtonColor
    context.rect(500, 380, 160, 40)
    context.fill()
    context.closePath()
    // Text
    context.fillStyle = "#2d25a8"
    context.font = "normal 15px Lato"
    context.fillText("Endless Mode", 120, 405)
    context.font = "normal 15px Lato"
    context.fillStyle = "white"
    context.fillText("Timed Mode", 320, 405)
    context.font = "normal 15px Lato"
    context.fillStyle = "black"
    context.fillText("Impossible Mode", 520, 405)
    // endless mode button
    
    if(mouseX > 100 && mouseX < 260 && mouseY > 365 && mouseY < 440)
    {
        endlessButtonColor = "white"
        if(click == true)
        {
            endlessMode = true
            start = true
        }
    }
    else{
        endlessButtonColor = "rbg(240, 240, 240)"
    }
    // timed mode button
    if(mouseX > 300 && mouseX < 460 && mouseY > 365 && mouseY < 440)
    {
        timedButtonColor = "#4d44d6"
        if(click == true)
        {
            lives = 3
            timedMode = true
            start = true
        }
    }
    else{
        timedButtonColor = "#2d25a8"

    }
    // impossible mode button
    if(mouseX > 500 && mouseX < 660 && mouseY > 365 && mouseY < 440)
    {
        impossibleButtonColor = "rgb(255, 0, 0)"
        if(click == true)
        {
            impossibleMode = true
            lives = 0
            start = true
        }
    }
    else{
        impossibleButtonColor = "rgb(160, 0, 0)"

    }
    click = false
}


function drawSpaceship()
{
    context.save()
    context.beginPath()
    context.translate(spaceship.position.x, spaceship.position.y)
    context.rotate(spaceship.angle)
    context.rect(spaceship.width * -0.5, spaceship.height * -0.5, spaceship.width, spaceship.height)
    context.fillStyle = spaceship.color
    context.fill()
    context.closePath()

    // Draw the flame if engine is on
    if(spaceship.engineOn)
    {
        context.beginPath()
        context.moveTo(spaceship.width * -0.5, spaceship.height * 0.5)
        context.lineTo(spaceship.width * 0.5, spaceship.height * 0.5)
        context.lineTo(0, spaceship.height * 0.5 + Math.random() * 10)
        context.lineTo(spaceship.width * -0.5, spaceship.height * 0.5)
        context.closePath()
        context.fillStyle = "orange"
        context.fill()
    }
    context.restore()
}

function drawStars() 
{
  context.save()
  context.fillStyle = "black"
  context.fillRect(0, 0, canvas.width, canvas.height)
  for (var i = 0; i < stars.length; i++) {
    var star = stars[i]
    context.beginPath()
    context.arc(star.x, star.y, star.radius, 0, 2*Math.PI)
    context.closePath()
    context.fillStyle = "rgba(0, 191, 255, " + star.alpha + ")"
    if (star.decreasing == true)
    {
      star.alpha -=Math.random() * 0.05
      if (star.alpha < 0.1)
      { star.decreasing = false }
    }
    else
    {
      star.alpha += Math.random() * 0.05
      if (star.alpha > 0.95)
      { star.decreasing = true }
    }
    //star.alpha = Math.sin(Math.random() * Math.PI * 2)
    context.fill()
  }
  context.restore()
}

function drawTargets()
{
    context.save()
    for(var i = 0; i < targets.length; i++)
    {
        var target = targets[i]
        var imageObj = new Image(10, 10)
        imageObj.src = "logo.png"
        context.drawImage(imageObj, target.x, target.y)
      context.fill()
    }
    context.restore()
}

function writeScore()
{
    context.fillStyle = "gray"
    context.font = "normal 15px Lato"
    context.fillText('Your Score is: ' + score, 100, 20)
    if(timedMode == true || impossibleMode == true){
    context.fillText("Time Remaining: " + ((level-1) * 5 + 10 - (time / 60).toFixed(0)), 600, 20)
    context.fillText("Lives: " + lives, 500, 20)}
    context.fillText("Level: " + level, 400, 20)
    context.font = "normal 10px Lato"
    context.fillText("Use the arrow keys to manuever your ship to collect the hearts. When you collect all the hearts,", 15, 550)
    context.fillText("you go to the next level. Click enter to return to the title screen.", 15, 575)
    if(show == true)
    {   context.fillStyle = "turquoise"
        context.font = "normal 100px Lato"
        context.fillText("Level " + level + "!", 160, 300)
        showing -= 1
    }
    if(fail == true)
    {
        context.fillStyle = "gray"
        context.font = "normal 100px Lato"
        context.fillText("YOU'VE FAILED!", 30, 300)
        failing -= 1
    }
    if(showing <= 0)
    {
        show = false
        showing = 60
        for (var i = 0; i < level * 4; i++) 
                {
                    targets[i] = {
                    x: Math.random() * (canvas.width-100),
                    y: Math.random() * (canvas.height-100)
                    }
                }
    }
    if(failing <= 0)
    {
        fail = false
    }
    if(targets.length == 0 && lose == false)
    {
        context.fillStyle = "gray"
        context.font = "normal 100px Lato"
        if(score == lastScore + (level) * 4 || score == 4 && level == 1)
        {
            show = true
            context.fillText("Level " + (level + 1) + "!", 160, 300)
            spaceship.position.x = 400
            spaceship.position.y = 300
            spaceship.velocity.x = 0
            spaceship.velocity.y = 0
            spaceship.angle = 0
            level += 1
            time = 0 
            lastScore = score
        }
        context.font = "normal 100px Lato"  
    }
    else if(lose == false){
        time += 1
    }
    if((time / 60).toFixed(0) >= (level-1) * 5 + 10 && (timedMode == true || impossibleMode == true))
    {
        context.font = "normal 100px Lato"
        if(lives > 0)
        {
            fail = true
            lives -= 1
            //lose = true
            restart(level)
        }
        else if (lives == 0){
            context.fillText("GAME OVER!", 100, 300)
            lose = true
            for(var i = 0; i < targets.length; i++)
            {
            targets.pop()
            }
        }

    }
}

function isColliding()
{
    for(var i = 0; i < targets.length; i++)
    {
        target = targets[i]
        if(spaceship.position.x <= target.x + 40 && spaceship.position.x >= target.x)
        {
            if(spaceship.position.y <= target.y + 40 && spaceship.position.y >= target.y)
            {
                targets.splice(i, 1)
                score += 1
            }
        }
    }
}

function updateSpaceship()
{
    spaceship.position.x += spaceship.velocity.x
    spaceship.position.y += spaceship.velocity.y
    if(spaceship.rotatingRight)
    {
        spaceship.angle += Math.PI / 90
    }
    else if(spaceship.rotatingLeft)
    {
        spaceship.angle -= Math.PI / 90
    }

    if(spaceship.engineOn)
    {
        spaceship.velocity.x += spaceship.thrust * Math.sin(-spaceship.angle)
        spaceship.velocity.y += spaceship.thrust * Math.cos(spaceship.angle)
    }
    if(spaceship.position.x < 0)
    {
        spaceship.position.x = 10
        spaceship.velocity.x = -spaceship.velocity.x * 0.5
    }
    if(spaceship.position.y < 0)
    {
        spaceship.position.y = 10
        spaceship.velocity.y = -spaceship.velocity.y * 0.5
    }
    if(spaceship.position.x > 800)
    {
        spaceship.position.x = 790
        spaceship.velocity.x = -spaceship.velocity.x * 0.5
    }
    if(spaceship.position.y > 600)
    {
        spaceship.position.y = 590
        spaceship.velocity.y = -spaceship.velocity.y * 0.5
    }
    spaceship.velocity.y -= gravity
}


function draw()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateSpaceship()
    drawStars()
    drawTargets()
    drawSpaceship()
    writeScore()
    isColliding()
    if(start == true)
    {
        requestAnimationFrame(draw)
    }
    if(start == false)
    {
        timedMode = false
        endlessMode = false
        titleScreen()
    }
    
}

function keyLetGo(event)
{
    switch(event.keyCode)
    {
        case 37:
            // Left Arrow key
            spaceship.rotatingLeft = false;
            break;
        case 39:
            // Right Arrow key
            spaceship.rotatingRight = false;
            break;
        case 38:
            // Up Arrow key
            spaceship.engineOn = false;
            break;
    }
}

document.addEventListener('keyup', keyLetGo)

function keyPressed(event)
{
    switch(event.keyCode)
    {
        case 37:
            // Left Arrow key
            spaceship.rotatingLeft = true
            break
        case 39:
            // Right Arrow key
            spaceship.rotatingRight = true
            break
        case 38:
            // Up Arrow key
            spaceship.engineOn = true
            break
        case 13:
            start = false

    }
}

document.addEventListener('keydown', keyPressed)

function restart()
{
    level = 1
    score = 0
    for(var i = 0; i < targets.length; i++)
        {
            targets.pop()
        }
    for (var i = 0; i < 4; i++) {
        targets[i] = {
          x: Math.random() * (canvas.width-100),
          y: Math.random() * (canvas.height-100)
        }
      }
    lose = false  
    spaceship.position.x = 400
    spaceship.position.y = 300
    spaceship.velocity.x = 0
    spaceship.velocity.y = 0
    spaceship.angle = 0
    time = 0
}


titleScreen()