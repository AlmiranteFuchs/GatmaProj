import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, RigidBody2D, Vec2, Contact2DType, Collider2D, SpriteFrame, IPhysics2DContact, Sprite, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    @property public force: number = 100;
    @property([SpriteFrame]) public clips: SpriteFrame[] = [];
    @property(AudioClip) public jumpAudio: AudioClip = null;
    @property(AudioClip) public dieAudio: AudioClip = null;
    @property(AudioClip) public coinAudio: AudioClip = null;    
    @property(AudioSource) public audioSource: AudioSource = null;

    // Input 
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {
        // Rotate the player face to ground
        if (this.node.angle > -90) {
            this.node.angle -= 1;
        }

        const rigidBody = this.node.getComponent(RigidBody2D);
        if (rigidBody.linearVelocity.y > 0) {
            this.node.getComponent(Sprite).spriteFrame = this.clips[1];
        } else {
            this.node.getComponent(Sprite).spriteFrame = this.clips[0];
        }
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this._player_up();
                break;
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // will be called once when two colliders begin to contact
        // if coin 
        if (otherCollider.node.name == "coin") {
            // Play coin audio
            this.audioSource.clip = this.coinAudio;
            this.audioSource.play();
            // Score +1
            // TODO: Score +1

            // Else game over
            // TODO: Game over


        }
    }



    // Player movement
    private _player_up(): void {
        const rigidBody = this.node.getComponent(RigidBody2D);
        // Set the force to 0
        rigidBody.linearVelocity = new Vec2(0, 0);


        // Add force to rigidbody
        rigidBody.applyLinearImpulseToCenter(new Vec2(0, this.force), true);

        // Set user angle to 90
        this.node.angle = 30;

        // Play jump audio
        this.audioSource.clip = this.jumpAudio;
        this.audioSource.play();

    }


}


