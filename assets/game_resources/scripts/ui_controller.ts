import { _decorator, Color, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ui_controller')
export class ui_controller extends Component {
    // Nodes
    @property({ type: Node }) ui_start_menu: Node;
    @property({ type: Node }) ui_main_menu: Node;
    @property({ type: Node }) ui_game_over: Node;
    @property({ type: Node }) ui_credit: Node;
    @property({ type: Node }) ui_how_to_play: Node;
    @property({ type: Node }) ui_questions: Node;
    @property({ type: Node }) ui_music_settings: Node;
    @property({ type: Node }) ui_fade: Node;
    @property({ type: Node }) ui_score: Node;
    @property({ type: Node }) ui_menu: Node;

    // Methods
    public toggle_ui_start_menu() {
        this.ui_start_menu.active = !this.ui_start_menu.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_main_menu() {
        this.ui_main_menu.active = !this.ui_main_menu.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_game_over() {
        this.ui_game_over.active = !this.ui_game_over.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_credit() {
        this.ui_credit.active = !this.ui_credit.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_how_to_play() {
        this.ui_how_to_play.active = !this.ui_how_to_play.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_questions() {
        this.ui_questions.active = !this.ui_questions.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_music_settings() {
        this.ui_music_settings.active = !this.ui_music_settings.active;
        this.toggle_ui_menu();
    }

    public toggle_ui_fade() {
        // Get sprite of node
        // Fade in
        let i = 0;
        setInterval(() => {
            if (i >= 254) {
                return;
            }
            i++;
            this.ui_fade.getComponent(Sprite).color = new Color(0, 0, 0, i);

        }, 5);
    }

    public toggle_ui_menu() {
        if (this.ui_credit.active || this.ui_how_to_play.active || this.ui_questions.active ||
            this.ui_music_settings.active || this.ui_game_over.active || this.ui_main_menu.active || this.ui_start_menu.active) {
            this.ui_menu.active = false;
            return;
        }
        this.ui_menu.active = true;
    }




    start() {
    }

    update(deltaTime: number) {

    }
}


