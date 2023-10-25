import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {

    @property({ type: [Node] }) obstacles: Node[] = [];             // List of all the game objects obstacles
    @property({ type: CCFloat }) obstacleSpeed: number = 1.0;                // obstacleSpeed of the obstacles
    @property({ type: CCFloat }) spawnDistance: number = 5.0;        // Distance between each spawn of an obstacle
    @property({ type: CCFloat }) spawnHeightMin: number = 42;          // Height of the spawn of an obstacle
    @property({ type: CCFloat }) spawnHeightMax: number = 256;          // Height of the spawn of an obstacle
    @property({ type: CCFloat }) disappearDistance: number = -5.0;    // Distance between the obstacle and the player before it disappears

    // Background
    @property({ type: Node }) background: Node = null;                // Background of the game
    @property({ type: CCFloat }) backgroundSpeed: number = 0.5;        // Speed of the background
    @property({ type: CCFloat }) backgroundSpawnPosition: number = 0;    // where the background will spawn
    @property({ type: CCFloat }) backgroundDisappearPosition: number = -3200;    // where the background will disappear

    start() {
        
    }

    update(deltaTime: number) {
        this._move_background();
    }



    private _move_background() {
        this.background.setPosition(this.background.position.x - this.backgroundSpeed, this.background.position.y, this.background.position.z);

        if (this.background.position.x < this.backgroundDisappearPosition) {
            this.background.setPosition(this.backgroundSpawnPosition, this.background.position.y, this.background.position.z);
        }
    }
}


