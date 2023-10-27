import { _decorator, CCFloat, Component, instantiate, math, Node, Prefab, Vec2, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {

    // Section Obstacles
    @property({ type: [Prefab] }) obstacles_prefab_bot: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the bottom
    @property({ type: [Prefab] }) obstacles_prefab_top: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the top
    @property({ type: [Prefab] }) obstacles_prefab_mid: Prefab[] = [];                          // Prefab of the obstacles that will spawn on the middle
    @property({ type: [Prefab] }) obstacles_prefab_trash: Prefab[] = [];                        // Prefab of the obstacles that will spawn on the middle

    private _obstacles_container: obstacle[] = [];                                  // Array of obstacles

    @property({ type: CCFloat }) obs_spawn_top_position: number;                    // Where the top obstacle will spawn on the y axis if it's a top obstacle
    @property({ type: CCFloat }) obs_spawn_bot_position: number;                    // Where the top obstacle will spawn on the y axis if it's a bottom obstacle
    @property({ type: CCFloat }) obs_spawn_position: number;                        // Where the obstacle will spawn on the x axis
    @property({ type: CCFloat }) obs_speed: number;                                 // obs_speed of the obstacles
    @property({ type: CCFloat }) obs_spawn_time: number;                            // When the obstacle will spawn
    @property({ type: CCFloat }) obs_spawn_trash_time: number;                            // When the obstacle will spawn
    @property({ type: CCFloat }) obs_disappear_time: number;                        // When the obstacle will disappear after spawning


    // Background
    @property({ type: Node }) background: Node;                                     // Background of the game
    @property({ type: Node }) terrain: Node;                                        // terrain of the game
    @property({ type: CCFloat }) background_speed: number;                          // Speed of the background
    @property({ type: CCFloat }) background_spawn_position: number;                 // where the background will spawn
    @property({ type: CCFloat }) background_disappear_position: number;             // where the background will disappear

    // Music
    @property({ type: AudioClip }) music_menu: AudioClip;                                // Music of the game
    @property({ type: AudioClip }) music_game: AudioClip;                                // Music of the game


    start() {
        setInterval(() => {
            this._create_obstacle();
        }, this.obs_spawn_time * 1000);
        setInterval(() => {
            this._create_trash();
        }, this.obs_spawn_trash_time * 1000);

        // Play the music
        let audio_source = this.getComponent(AudioSource);
        audio_source.clip = this.music_menu;
        audio_source.play();

    }

    update(deltaTime: number) {
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
    private _switch_music() {
        // Switch the music
        let audio_source = this.getComponent(AudioSource);

        let where_stop = audio_source.currentTime
        // stop the music	
        audio_source.stop();


        
        // switch the music
        if (audio_source.clip == this.music_menu) {
            audio_source.clip = this.music_game;
        } else {
            audio_source.clip = this.music_menu;
        }
        // set time
        audio_source.currentTime = where_stop;
        audio_source.play();
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


