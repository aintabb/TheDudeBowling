import Frame from './Frame.model';
import Game from './Game.model';
import { Roll } from '../type';

// Depending on the rolls, tenth frame might have 3 rolls.
// That's why it created and represented in a different class.
export default class TenthFrame extends Frame {
    private _roll3? : Roll;

    constructor (game: Game) {
        super(game, 10);
    }

    get rollThree() {
        return this._roll3;
    }

    set rollThree(roll) {
        this._roll3 = roll;
    }

    get score() {
        return (this.rollOne || 0) +
        (this.rollTwo || 0) +
        (this.rollThree || 0);
    }
}