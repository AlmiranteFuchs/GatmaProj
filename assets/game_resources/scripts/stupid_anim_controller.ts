import { _decorator, Animation, AnimationClip, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('stupid_anim_controller')
export class stupid_anim_controller extends Component {
    @property({ type: AnimationClip }) anim: AnimationClip = null;

    start() {
        
    }

    update(deltaTime: number) {
        // Check if animation is playing
        if ((this.getComponent(Animation)).getState(this.anim.name).isPlaying) {
            // Stop animation
            
        }else{
            // Play animation
            (this.getComponent(Animation)).play(this.anim.name);
        }
    }
}


