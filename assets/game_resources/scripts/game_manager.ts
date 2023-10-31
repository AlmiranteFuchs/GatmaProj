import { _decorator, CCFloat, Component, instantiate, math, Node, Prefab, Vec2, AudioClip, AudioSource, RigidBody2D, BoxCollider2D, CircleCollider2D, RichText, director, Scene, resources, JsonAsset } from 'cc';
import { ui_controller } from './ui_controller';
import { player_controller } from './player_controller';
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {

    // Section Obstacles Prefabs
    @property({ type: [Prefab] }) obstacles_prefab_bot: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the bottom
    @property({ type: [Prefab] }) obstacles_prefab_top: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the top
    @property({ type: [Prefab] }) obstacles_prefab_mid: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the middle
    @property({ type: [Prefab] }) obstacles_prefab_trash: Prefab[] = [];                        // Prefab of the obstacles that will spawn on the middle
    private _obstacles_container: obstacle[] = [];                                  // Array of obstacles

    // Section Obstacles Properties
    @property({ type: CCFloat }) obs_spawn_top_position: number;                    // Where the top obstacle will spawn on the y axis if it's a top obstacle
    @property({ type: CCFloat }) obs_spawn_bot_position: number;                    // Where the top obstacle will spawn on the y axis if it's a bottom obstacle
    @property({ type: CCFloat }) obs_spawn_position: number;                        // Where the obstacle will spawn on the x axis
    @property({ type: CCFloat }) obs_speed: number;                                 // obs_speed of the obstacles
    @property({ type: CCFloat }) obs_spawn_time: number;                            // When the obstacle will spawn
    @property({ type: CCFloat }) obs_spawn_trash_time: number;                            // When the obstacle will spawn
    private _obs_spawn_timer: number = 0;                                            // Counter
    private _obs_spawn_trash_timer: number = 0;                                            // Counter


    // Background
    @property({ type: Node }) background: Node;                                     // Background of the game
    @property({ type: Node }) terrain: Node;                                        // terrain of the game
    @property({ type: CCFloat }) background_speed: number;                          // Speed of the background
    @property({ type: CCFloat }) background_spawn_position: number;                 // where the background will spawn
    @property({ type: CCFloat }) background_disappear_position: number;             // where the background will disappear


    // Music
    @property({ type: AudioClip }) music_menu: AudioClip;                                       // Music of the game
    @property({ type: AudioClip }) music_menu_1: AudioClip;                                     // Music of the game
    @property({ type: AudioClip }) music_menu_2: AudioClip;                                     // Music of the game


    // Components
    @property({ type: Node }) player: Node;                                                     // Obj of the game
    @property({ type: ui_controller }) ui: ui_controller;                                       // Obj of the game
    private _player_dead: boolean = false;
    private _player_died: boolean = false;
    public player_score: number = 0;

    // Questions
    @property({ type: Node }) question: Node;                                      // Obj of the game
    @property({ type: Node }) anwser_1: Node;                                      // Obj of the game
    @property({ type: Node }) anwser_2: Node;                                      // Obj of the game
    @property({ type: Node }) anwser_3: Node;                                      // Obj of the game
    @property({ type: Node }) anwser_right: Node;                                  // Obj of the game

    //#region Questions
    public questions = [
        {
            "question": `<b><outline color=#000000 width=2>\nQuantas gramas, em média uma pessoa\ndesperdiça almoçando no RU?</outline></b>`,
            "answers_wrong": ["35g", "20g", "65g"],
            "answer_right": "45g"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQual o  Dia Internacional de\nConscientização sobre Perdas e\nDesperdícios de Alimentos?</outline></b>`,
            "answers_wrong": ["5 de junho", "22 de abril", "15 de novembro"],
            "answer_right": "29 de setembro"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nOs resíduos orgânicos são destinados à\nlixeira de qual cor?</outline></b>`,
            "answers_wrong": ["vermelho", "verde", "cinza"],
            "answer_right": "marrom"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQuantas toneladas de alimentos o Brasil\ndesperdiça por ano? (dado: ONU)</outline></b>`,
            "answers_wrong": ["20 milhões", "23 bilhões", "35 milhões"],
            "answer_right": "27 milhões"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQuantas pessoas em 2022 estavam em\nestado de privação alimentar?\n(ONU, 2022)</outline></b>`,
            "answers_wrong": ["Entre 30 e 40 milhões", "Entre 20 e 33 milhões", "Entre 5 e 20 milhões"],
            "answer_right": "Entre 15 e 33 milhões"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQual a porcentagem correta de desperdício\nna respectiva fase da cadeia alimentar?\n(FAO,2014)</outline></b>`,
            "answers_wrong": ["28% na distribuição", "6% no consumo", "17% na produção"],
            "answer_right": "22% no manejo e armazenamento"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQuantos quilos (kg) de alimento por dia\nsão jogados fora no RU?</outline></b>`,
            "answers_wrong": ["350,8 kg", "152,6 kg", "146,5 kg"],
            "answer_right": "157,5 kg"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nO óleo vegetal usado no RU é destinado ao\nprocesso de reciclagem e retorna para\na universidade como sabão e detergente.</outline></b>`,
            "answers_wrong": ["Falso", "Não sei"],
            "answer_right": "Verdadeiro"
        },
        {
            "question": `<b><outline color=#000000 width=2>\nQuantas toneladas foram desperdiçadas\nmundialmente no ano de 2019?\n(UNEP, 2021)</outline></b>`,
            "answers_wrong": ["547 milhões", "1025 milhões", "1184 milhões"],
            "answer_right": "931 milhões"
        }
    ];

    public update_questions() {
        // Choose a random question
        let question = math.randomRangeInt(0, this.questions.length);
        // Set the question
        this.question.getComponent(RichText).string = this.questions[question].question;
        // choose a random anwser
        let anwser = math.randomRangeInt(0, 3);
        // Set the anwsers
        switch (anwser) {
            case 0:
                // get first children of node 
                this.anwser_1.children[0].getComponent(RichText).string = this.questions[question].answer_right;
                this.anwser_2.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[0];
                this.anwser_3.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[1];

                this.anwser_1.name += "right";
                this.anwser_right = this.anwser_1;
                break;
            case 1:
                // get first children of node 
                this.anwser_1.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[0];
                this.anwser_2.children[0].getComponent(RichText).string = this.questions[question].answer_right;
                this.anwser_3.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[1];

                this.anwser_2.name += "right";
                this.anwser_right = this.anwser_2;
                break;
            case 2:
                // get first children of node 
                this.anwser_1.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[0];
                this.anwser_2.children[0].getComponent(RichText).string = this.questions[question].answers_wrong[1];
                this.anwser_3.children[0].getComponent(RichText).string = this.questions[question].answer_right;

                this.anwser_3.name += "right";
                this.anwser_right = this.anwser_3;
                break;
        }
    }
    public check_anwser(event: Event, CustomEventData: CustomEvent) {
        let anwser = (event.currentTarget as any)._name;

        if (anwser == this.anwser_right.name) {
            // Play coin sound on player
            let audio_source = this.player.getComponent(AudioSource);
            audio_source.clip = (this.player.getComponent("player_controller") as player_controller).coinAudio;
            audio_source.play();

            setTimeout(() => {
                this.update_questions();
                this.ui.toggle_ui_questions();
                // Clear all the obstacles
                for (let i = 0; i < this._obstacles_container.length; i++) {
                    let obstacle = this._obstacles_container[i];
                    this._obstacles_container.splice(i, 1);
                    obstacle.object.destroy();
                }
                // Set position of the player
                this.player.setPosition(-230, 50, this.player.position.z);
                // Continue the game
                this.ui.toggle_ui_start_menu();

                this._player_dead = false;

                this._obstacles_container = [];
            }, 1000);
        } else {
            // Game over
            this.ui.toggle_ui_questions();
            this.ui.toggle_ui_game_over();
        }

        (event.currentTarget as any).name = this.anwser_right.name.replace("right", "");
    }

    //#endregion

    // Game state with get and set
    private _game_state: game_state = game_state.MENU;
    public get game_state() {
        return this._game_state;
    }
    public set game_state(game_states: game_state) {
        // Switch funcs
        switch (game_states) {
            case game_state.MENU:
                break;

            case game_state.GAME:
                // enable player rigidbody
                this.player.getComponent(RigidBody2D).enabled = true;
                // start obstacles rigidbody
                if (this._obstacles_container && this._obstacles_container.length > 0) {
                    for (let i = 0; i < this._obstacles_container.length; i++) {
                        let obstacle = this._obstacles_container[i];

                        if (obstacle.object.getComponent(RigidBody2D)) {
                            obstacle.object.getComponent(RigidBody2D).enabled = true;
                        }
                    }
                }
                // enable player controller
                this.player.getComponent("player_controller").enabled = true;
                this.player.getComponent(CircleCollider2D).enabled = true;

                break;

            case game_state.WAITING_TO_START:
                // set position of the player
                this.player.setPosition(-230, 50, this.player.position.z);
                this.player.getComponent("player_controller").enabled = false;
                setTimeout(() => {
                    this.player.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
                    this.player.getComponent(RigidBody2D).enabled = false;
                }, 100);


                // set position of background
                // this.background.setPosition(this.background_spawn_position, this.background.position.y, this.background.position.z);
                break;
            case game_state.PAUSE:
                // disable player controller
                this.player.getComponent("player_controller").enabled = false;
                // disable player rigidbody
                this.player.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
                this.player.getComponent(RigidBody2D).enabled = false;

                // Stop obstacles rigidbody
                for (let i = 0; i < this._obstacles_container.length; i++) {
                    let obstacle = this._obstacles_container[i];
                    if (obstacle.object.getComponent(RigidBody2D)) {
                        obstacle.object.getComponent(RigidBody2D).enabled = false;
                    }
                }
                break;
        }
        this._game_state = game_states;
    }
    // JESUS CHRIST MAN
    public set_state_game() {
        this.game_state = game_state.GAME;
    }
    public set_state_menu() {
        this.game_state = game_state.MENU;
    }
    public set_state_waiting_to_start() {
        this.game_state = game_state.WAITING_TO_START;
    }
    public set_state_pause() {
        this.game_state = game_state.PAUSE;
    }

    public player_died() {
        this.set_state_waiting_to_start();

        if (this._player_died) {
            // Game over
            this.ui.toggle_ui_game_over();
            return;
        }

        if (!this._player_dead) {
            // Set game state to menu

            // Show game over ui
            this.ui.toggle_ui_questions();

            // Destroy all the obstacles
            for (let i = 0; i < this._obstacles_container.length; i++) {
                let obstacle = this._obstacles_container[i];
                setTimeout(() => {
                    obstacle.object.destroy();
                }, 20);
            }
            this._player_dead = true;
            this._player_died = true;
        }
    }

    @property({ type: Scene }) public scene;
    public game_over() {
        setTimeout(() => {
            director.loadScene("main_game");
        }, 1500);
    }


    start() {
        // database 
        // Play the music
        let audio_source = this.getComponent(AudioSource);
        audio_source.clip = this.music_menu;
        audio_source.play();

        this.update_questions();
    }

    update(deltaTime: number) {
        if (this._game_state != game_state.GAME) {
            return;
        }


        // Create timers
        this._create_timers(deltaTime);
        this._move_background();
        this._move_obstacles();
    }

    // Private functions
    private _move_background() {
        // Moves the background
        this.background.setPosition(this.background.position.x - this.background_speed, this.background.position.y, this.background.position.z);
        this.terrain.setPosition(this.terrain.position.x - this.background_speed, this.terrain.position.y, this.terrain.position.z);

        if (this.background.position.x < this.background_disappear_position) {
            this.background.setPosition(this.background_spawn_position, this.background.position.y, this.background.position.z);
        }

        if (this.terrain.position.x < this.background_disappear_position) {
            this.terrain.setPosition(this.background_spawn_position, this.terrain.position.y, this.terrain.position.z);
        }

    }

    private _move_obstacles() {
        // Moves the obstacles
        for (let i = 0; i < this._obstacles_container.length; i++) {
            let obstacle = this._obstacles_container[i];

            // Move the obstacle
            if (obstacle.direction) {
                obstacle.object.setPosition(obstacle.object.position.x - this.obs_speed, obstacle.object.position.y - obstacle.direction.y * obstacle.direction_speed, obstacle.object.position.z);
            } else {
                obstacle.object.setPosition(obstacle.object.position.x - this.obs_speed, obstacle.object.position.y, obstacle.object.position.z);
            }

            if (obstacle.object.position.x < this.background_disappear_position) {
                // Remove the obstacle
                this._obstacles_container.splice(i, 1);
                obstacle.object.destroy();
            }
        }
    }

    private _create_timers(deltaTime: number) {
        // Spawn obstacles
        this._obs_spawn_timer += deltaTime;
        this._obs_spawn_trash_timer += deltaTime;

        if (this._obs_spawn_timer > this.obs_spawn_time) {
            this._create_obstacle();
            this._obs_spawn_timer = 0;

            this.player_score++;
            // Play coin sound on player
            let audio_source = this.player.getComponent(AudioSource);
            audio_source.clip = (this.player.getComponent("player_controller") as player_controller).coinAudio;
            audio_source.play();

            // update score on ui
            this.ui.ui_score.getComponent(RichText).string = `<b><outline color=#000000 width=2><color=#00DDF7>Score: ${this.player_score.toString()}</outline></b>`
        }

        if (this._obs_spawn_trash_timer > this.obs_spawn_trash_time) {
            this._create_trash();
            this._obs_spawn_trash_timer = 0;
        }
    }
    private _create_obstacle() {
        // Create a random obstacle
        // Choose if the obstacle will spawn on top, middle or bottom, roll 1d3
        let obstacle_type = math.randomRangeInt(0, 3);

        // Choose the obstacle prefab
        switch (obstacle_type) {
            case 0:
                // Spawn on top
                let obstacle_prefab_top = math.randomRangeInt(0, this.obstacles_prefab_top.length);
                let obstacle_top = instantiate(this.obstacles_prefab_top[obstacle_prefab_top]);
                this.node.addChild(obstacle_top);
                obstacle_top.setPosition(this.obs_spawn_position, this.obs_spawn_top_position, 0);

                // Add the obstacle to the array
                var obstacle: obstacle = {
                    object: obstacle_top,
                    type: obstacle_type
                }

                this._obstacles_container.push(obstacle);
                break;

            case 1:
                // Spawn on middle
                let obstacle_prefab_mid = math.randomRangeInt(0, this.obstacles_prefab_mid.length);
                let obstacle_mid = instantiate(this.obstacles_prefab_mid[obstacle_prefab_mid]);
                this.node.addChild(obstacle_mid);
                obstacle_mid.setPosition(this.obs_spawn_position, math.randomRangeInt(-250, 300), 0);

                // Choose the direction of the obstacl
                let obstacle_direction_x = math.randomRangeInt(-1, 2);
                let obstacle_direction_y = math.randomRangeInt(-1, 2);
                let obstacle_speed = 0.7;

                // Add the obstacle to the array
                var obstacle: obstacle = {
                    object: obstacle_mid,
                    direction: new Vec2(0, obstacle_direction_y),
                    direction_speed: obstacle_speed,
                    type: obstacle_type
                }

                this._obstacles_container.push(obstacle);
                break;

            case 2:
                // Spawn on bottom
                let obstacle_prefab_bot = math.randomRangeInt(0, this.obstacles_prefab_bot.length);
                let obstacle_bot = instantiate(this.obstacles_prefab_bot[obstacle_prefab_bot]);
                this.node.addChild(obstacle_bot);
                obstacle_bot.setPosition(this.obs_spawn_position, this.obs_spawn_bot_position, 0);

                // Add the obstacle to the array
                var obstacle: obstacle = {
                    object: obstacle_bot,
                    type: obstacle_type
                }

                this._obstacles_container.push(obstacle);
                break;
        }
    }

    private _create_trash() {
        let trash_prefab = math.randomRangeInt(0, this.obstacles_prefab_trash.length);

        let trash = instantiate(this.obstacles_prefab_trash[trash_prefab]);
        this.node.addChild(trash);
        trash.setPosition(this.obs_spawn_position, math.randomRangeInt(-250, this.obs_spawn_top_position), 0);

        // Add the obstacle to the array
        var obstacle: obstacle = {
            object: trash,
            type: obstacle_type.MID
        }

        this._obstacles_container.push(obstacle);
    }

    // Music 
    public switch_music() {
        // Switch the music
        let audio_source = this.getComponent(AudioSource);
        // stop the music	
        audio_source.stop();
        // switch the music
        audio_source.clip = this.music_menu;
        audio_source.play();
    }
    public switch_music_1() {
        // Switch the music
        let audio_source = this.getComponent(AudioSource);
        // stop the music	
        audio_source.stop();
        // switch the music
        audio_source.clip = this.music_menu_1;
        audio_source.play();
    }
    public switch_music_2() {
        // Switch the music
        let audio_source = this.getComponent(AudioSource);
        // stop the music	
        audio_source.stop();
        // switch the music
        audio_source.clip = this.music_menu_2;
        audio_source.play();
    }

    public toggle_music() {
        // Toggle the music
        let audio_source = this.getComponent(AudioSource);
        if (audio_source.playing) {
            audio_source.pause();
        } else {
            audio_source.play();
        }
    }

    public toggle_pause() {
        // Toggle the pause
        if (this._game_state == game_state.GAME) {
            this.game_state = game_state.PAUSE;
        } else {
            this.game_state = game_state.GAME;
        }
    }
}

interface obstacle {
    object: Node;
    direction?: Vec2 | null;
    direction_speed?: number;
    type: obstacle_type;
}


enum obstacle_type {
    TOP,
    MID,
    BOT
}

export enum game_state {
    MENU,
    GAME,
    WAITING_TO_START,
    OVER,
    PAUSE
}


