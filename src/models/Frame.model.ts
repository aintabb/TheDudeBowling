import { Roll } from '../type';
import Game from './Game.model';

export default class Frame {
    private _roll1?: Roll;
    private _roll2?: Roll;
    private _game: Game;
    private _order: number;

    constructor(game: Game, number: number) {
        this._game = game;
        this._order = number;
    }

    get order() {
        return this._order;
    }

    get rollOne() {
        return this._roll1;
    }
    set rollOne(roll) {
        this._roll1 = roll;
    }

    get rollTwo() {
        return this._roll2;
    }
    set rollTwo(roll) {
        this._roll2 = roll;
    }

    get framePoints() {
        const frameIndex = this._game.frames.indexOf(this);
        let points : number = 0;
        for (let j = 0; j <= frameIndex; j++) {
            points += this._game.frames[j].score;
        }

        return points;
    }

    private get strikeBonus() {
        const frames = this._game.frames;
        const frameIndex = frames.indexOf(this);
        const bonus1 = frames[frameIndex + 1].rollOne;
        let bonus2;
        if (bonus1 != 10) {
            bonus2 = frames[frameIndex + 1].rollTwo;
        }
        else {
            bonus2 =
                (frames[frameIndex + 2] && frames[frameIndex + 2].rollOne) ||
                frames[frameIndex + 1].rollTwo;
        }

        return Number.parseInt((bonus1 || 0)) + Number.parseInt((bonus2 || 0));
    }

    private get spareBonus() {
        const frameIndex = this._game.frames.indexOf(this);
        return Number.parseInt(this._game.frames[frameIndex + 1].rollOne) || 0;
    }

    get isSpare() {
        return this.rollOne != 10 &&
                Number.parseInt((this.rollOne || 0)) + Number.parseInt((this.rollTwo || 0)) == 10;
    }

    get isStrike() {
        return Number.parseInt((this.rollOne || 0)) == 10;
    }

    get score() {
        let baseScore = Number.parseInt((this.rollOne || 0)) + Number.parseInt((this.rollTwo || 0));
        let strikeBonus = this.isStrike ? this.strikeBonus : 0;
        let spareBonus = this.isSpare ? this.spareBonus : 0;

        return baseScore + strikeBonus + spareBonus;
    }

    /*
    toString() {
        return `${this._roll1}, ${this._roll2}`;
    }
    */
}
