import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameManager')
export class gameManager extends Component {

    @property({ type: [Node] }) obstacles_prefab: Node[] = [];                        // List of all the game objects obstacles
    @property({ type: CCFloat }) obstacle_speed: number;                    // obstacle_speed of the obstacles
    @property({ type: CCFloat }) obstacle_spawn_distance: number;           // Distance between each spawn of an obstacle
    @property({ type: CCFloat }) obstacle_disappear_distance: number;       // Distance between the obstacle and the player before it disappears

    // Background
    @property({ type: Node }) background: Node;                             // Background of the game
    @property({ type: CCFloat }) background_speed: number;                  // Speed of the background
    @property({ type: CCFloat }) background_spawn_position: number;         // where the background will spawn
    @property({ type: CCFloat }) background_disappear_position: number;     // where the background will disappear

    start() {

    }

    update(deltaTime: number) {
        this._move_background();
    }



    private _move_background() {
        this.background.setPosition(this.background.position.x - this.background_speed, this.background.position.y, this.background.position.z);

        if (this.background.position.x < this.background_disappear_position) {
            this.background.setPosition(this.background_spawn_position, this.background.position.y, this.background.position.z);
        }
    }
}


