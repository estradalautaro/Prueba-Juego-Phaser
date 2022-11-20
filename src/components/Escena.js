import Phaser from "phaser";

class Escena extends Phaser.Scene {

    plataforms = null;
    player = null;
    cursors = null;
    stars = null;
    bombs = null;
    gameOver = false;
    score = 0;
    scoreText;
    // Precarga todos los archivos que usaremos, en este caso solo Imagenes y Sprites
    preload() {
        this.load.image("sky", "img/sky.png");
        this.load.image("ground", "img/plataform.png");
        this.load.image("star", "img/star.png");
        this.load.image("bomb", "img/bomb.png");
        this.load.spritesheet("dude", "img/dude.png", { frameWidth: 32, frameHeight: 48 });
    }
    // Crea lo que se vera en la pantalla inicial
    create() {
        // Fondo/Plataformas y la manera de cargarlo en la precarga
        this.add.image(400, 300, "sky");
        this.plataforms = this.physics.add.staticGroup();
        this.plataforms.create(400, 568, "ground").setScale(2).refreshBody();
        this.plataforms.create(600, 400, "ground");
        this.plataforms.create(50, 250, "ground");
        this.plataforms.create(750, 220, "ground");

        // Personaje y se le asigna el Sprite de Dude
        this.player = this.physics.add.sprite(100, 300, "dude");

        // Se le otorga rebote y colision a nuestro Personaje
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(180);

        // Se le otorga movimientos a nuestro Personaje, cada uno con su respectivo Sprite
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // Se agrega el objeto Estrellas al juego
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 13,
            setXY: { x: 12, 7: 0, stepX: 60 }
        });

        // Se le genera el rebote del grupo de Estrellas
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Permite el rebote contra las plataformas del Juego
        this.physics.add.collider(this.player, this.plataforms);
        this.physics.add.collider(this.stars, this.plataforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Permite la colision de las Estrellas con el Personaje 
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Permite visualizar un texto que se le llamara Puntaje
        this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "32px", fill: "#000" });

        // Se agrega las Bombas al juego, cada una con su colision que se usara mas adelante
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.plataforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    // Se actualiza constantemente los movimientos, animaciones, y objetos
    update() {
        if (this.gameOver) {
            return;
        }
        // Movimientos de nuestro Personaje al presionar una tecla
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }
        // Permite a nuestro Personaje el poder Saltar mientras este en el suelo al presionar la Barra Espaciadora
        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
        }
    }
    // Verifica si nuestro Personaje a colisionado con una Bomba, este llamara al metodo gameOver
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
    // Verifica si nuestro Personaje a colisionado con una Estrella, esto sumara al Puntaje
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            // Se le otorga a las Bombas rebote y velocidad
            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
}
export default Escena;