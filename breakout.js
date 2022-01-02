const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    heigth: 640,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      preload,
      create,
      update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false
      },
    }
  };

  let player, ball, violetBricks, yellowBricks, redBricks;
  let openingText, gameOverText, playerWonText, s;
  let gameStarted = false;
  const game = new Phaser.Game(config);
  var disabledBricks = {};

  function preload() { 
      this.load.image('ball', 'assets/images/ball_32_32.png');
      this.load.image('paddle', 'assets/images/paddle_128_32.png');
      this.load.image('brick1', 'assets/images/brick1_64_32.png');
      this.load.image('brick2', 'assets/images/brick2_64_32.png');
      this.load.image('brick3', 'assets/images/brick3_64_32.png');
  }
  
  function create() { 
      player = this.physics.add.sprite(400,600,'paddle');
      player.setImmovable(true);
      ball = this.physics.add.sprite(
        400, // x position
        565, // y position
        'ball' // key of image for the sprite
      );

      yellowBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        immovable: true,
        setXY: {
          x: 80,
          y: 90,
          stepX: 70
        }
      });
      
      redBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        immovable: true,
        setXY: {
          x: 80,
          y: 40,
          stepX: 70
        }
      });
    
    blueBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 9,
        immovable: true,
        setXY: {
          x: 80,
          y: 140,
          stepX: 70
        }
      });

    cursors = this.input.keyboard.createCursorKeys();
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    this.physics.world.checkCollision.down = false;

    this.physics.add.collider(ball, blueBricks, hitBrick, null, this);
    this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
    this.physics.add.collider(ball, redBricks, hitBrick, null, this);
    this.physics.add.collider(ball, player, hitPlayer, null, this);



    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Press SPACE to Start',
        {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        fill: '#fff'
        },
    );
    
    openingText.setOrigin(0.5);

    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Game Over',
        {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        fill: '#fff'
        },
    );
  
    gameOverText.setOrigin(0.5);
    
    gameOverText.setVisible(false);
    
    playerWonText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'You won!',
        {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '50px',
        fill: '#fff'
        },
    );
    
    playerWonText.setOrigin(0.5);
    
  playerWonText.setVisible(false);
  
  }
  
  function update() { 
    if (isGameOver(this.physics.world)) {
        gameOverText.setVisible(true);
        ball.disableBody(true, true);
      } else if (isWon()) {
        playerWonText.setVisible(true);
        ball.disableBody(true, true);
      }
      else {
        if (!gameStarted) {
            ball.setX(player.x);
          
            if (cursors.space.isDown) {
                gameStarted = true;
                ball.setVelocityY(-200);
                openingText.setVisible(false);
              }
        }

        if(gameStarted) {
            player.body.setVelocityX(0);
            if (cursors.left.isDown) {
            player.body.setVelocityX(-350);
            } else if (cursors.right.isDown) {
            player.body.setVelocityX(350);
            }
        }
      }
  }

  function isGameOver(world) {
      return ball.body.y > world.bounds.height;
  }

  function isWon() {
      return yellowBricks.countActive() + redBricks.countActive() + blueBricks.countActive() == 0;
  }

  function hitBrick(ball, brick) {
    brick.disableBody(true, true);
    if (ball.body.velocity.x == 0) {
      randNum = Math.random();
      if (randNum >= 0.5) {
        ball.body.setVelocityX(150);
      } else {
        ball.body.setVelocityX(-150);
      }
    }
  }

  function hitPlayer(ball, player) {
    ball.setVelocityY(ball.body.velocity.y - 5);
  
    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    if (ball.x < player.x) {
      ball.setVelocityX(-newXVelocity);
    } else {
      ball.setVelocityX(newXVelocity);
    }
  }