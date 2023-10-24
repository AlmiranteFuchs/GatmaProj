import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {

    @property({ type: [Node] }) obstacles: Node[] = [];             // List of all the game objects obstacles
    @property({ type: Number }) obstacleSpeed: number = 1.0;                // obstacleSpeed of the obstacles
    @property({ type: Number }) spawnDistance: number = 5.0;        // Distance between each spawn of an obstacle
    @property({ type: Number }) spawnHeightMin: number = 42;          // Height of the spawn of an obstacle
    @property({ type: Number }) spawnHeightMax: number = 256;          // Height of the spawn of an obstacle
    @property({ type: Number }) disappearDistance: number = -5.0;    // Distance between the obstacle and the player before it disappears

    // Background
    @property({ type: Node }) background: Node = null;                // Background of the game
    @property({ type: Number }) backgroundSpeed: number = 0.5;        // Speed of the background
    @property({ type: Number }) backgroundSpawnPosition: number = 0;    // where the background will spawn
    @property({ type: Number }) backgroundDisappearPosition: number = -3200;    // where the background will disappear

    start() {

    }

    update(deltaTime: number) {
        this._move_obs();
        this._move_background();
    }



    private _move_obs() {
        this.obstacles.forEach(obs => {
            // Move the transform of the obstacle
            obs.setPosition(obs.position.x - this.obstacleSpeed, obs.position.y, obs.position.z);

            if (obs.position.x < this.disappearDistance) {
                var randomRange: number = Math.random() * (this.spawnHeightMax - this.spawnHeightMin) + this.spawnHeightMin;
                obs.setPosition(this.spawnDistance, randomRange, obs.position.z);
            }
        });

    }

    private _move_background() {
        this.background.setPosition(this.background.position.x - this.backgroundSpeed, this.background.position.y, this.background.position.z);

        if (this.background.position.x < this.backgroundDisappearPosition) {
            this.background.setPosition(this.backgroundSpawnPosition, this.background.position.y, this.background.position.z);
        }
    }
}


