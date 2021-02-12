import Frame from './Frame.model';
import Game from './Game.model';
import { Roll } from '../type';

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
        return Number.parseInt((this.rollOne || 0)) +
        Number.parseInt((this.rollTwo || 0)) +
        Number.parseInt((this.rollThree || 0));
    }
}