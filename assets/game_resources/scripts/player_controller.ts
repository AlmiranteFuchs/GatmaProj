import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, RigidBody2D, Vec2, Contact2DType, Collider2D, SpriteFrame, IPhysics2DContact, Sprite, AudioClip, AudioSource, find, log, Vec3 } from 'cc';
import { gameManager } from './game_manager';
const { ccclass, property } = _decorator;

@ccclass('player_controller')
export class player_controller extends Component {
    @property public force: number = 100;
    @property([SpriteFrame]) public clips: SpriteFrame[] = [];
    @property(AudioClip) public jumpAudio: AudioClip = null;
    @property(AudioClip) public dieAudio: AudioClip = null;
    @property(AudioClip) public coinAudio: AudioClip = null;
    @property(AudioSource) public audioSource: AudioSource = null;
    @property(gameManager) public gameManager: gameManager = null;

    // Player stuff
    private _rigidBody: RigidBody2D = null;
    private _sprite: Sprite = null;

    // Input 
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start() {
        // Collider setup
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onPostSolve , this);
        }

        // Set components
        this._rigidBody = this.node.getComponent(RigidBody2D);
        this._sprite = this.node.getComponent(Sprite);

    }

    update(deltaTime: number) {
        this._player_visual();
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this._player_up();
                break;
        }
    }
    // on finger touch
    onTouchStart(Touch) {
        this._player_up();
    }


    onPostSolve (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        // if coin 
        if (otherCollider.node.name == "coin") {
            // Play coin audio
            this.audioSource.clip = this.coinAudio;
            this.audioSource.play();
            // Score +1
            // TODO: Score +1

        } else {
            // Play die audio
            this.audioSource.clip = this.dieAudio;
            this.audioSource.play();

            // find game manager
            // Game over
            this.gameManager.player_died();
        }
    }

    // On this script enabled
    onEnable() {
        // Can make this shit up, ffsk
        setTimeout(()=>{
            this._player_up();
        }, 100);
    }



    // Player movement
    private _player_up(): void {
        // Set the force to 0
        this._rigidBody.linearVelocity = new Vec2(0, 0);

        // Add force to rigidbody
        this._rigidBody.applyLinearImpulseToCenter(new Vec2(0, this.force), true);

        // Set user angle to 90
        this.node.angle = 30;

        // Play jump audio
        this.audioSource.clip = this.jumpAudio;
        this.audioSource.play();
    }

    // Player visual
    private _player_visual(): void {
        // Rotate the player face to ground
        if (this.node.angle > -90) {
            this.node.angle -= 1;
        }

        // Change the sprite
        if (this._rigidBody.linearVelocity.y > 0) {
            this._sprite.spriteFrame = this.clips[1];
        } else {
            this._sprite.spriteFrame = this.clips[0];
        }
    }


}


