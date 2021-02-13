import { Roll } from '../type';
import Game from './Game.model';

export default class Frame {
    private _roll1?: Roll;
    private _roll2?: Roll;
    private _game: Game;
    private _order: number;

    constructor(game: Game, number: number) {
        // Hold the reference of the current game for 
        // score calculation.
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
            // Calculate the score by checking any spare/strike roll
            points += this._game.frames[j].score;
        }

        return points;
    }

    private get strikeBonus() {
        const frames = this._game.frames;
        const frameIndex = frames.indexOf(this);
        // Get the second roll for strike bonus.
        const bonus1 = frames[frameIndex + 1].rollOne;
        let bonus2;
        // If the second roll is not a strike, get the third roll
        // from the same frame for strike bonus calculation
        if (bonus1 != 10) {
            bonus2 = frames[frameIndex + 1].rollTwo;
        }
        // If the second roll is a strike, get the last roll from the third frame.
        else {
            bonus2 =
                (frames[frameIndex + 2] && frames[frameIndex + 2].rollOne) ||
                frames[frameIndex + 1].rollTwo;
        }

        return (bonus1 || 0) + (bonus2 || 0);
    }

    // Get the spare bonus by adding next frame's first roll to spare score.
    private get spareBonus() {
        const frameIndex = this._game.frames.indexOf(this);
        return this._game.frames[frameIndex + 1].rollOne || 0;
    }

    get isSpare() {
        return this.rollOne != 10 &&
                (this.rollOne || 0) + (this.rollTwo || 0) == 10;
    }

    get isStrike() {
        return (this.rollOne || 0) == 10;
    }

    get score() {
        let baseScore = (this.rollOne || 0) + (this.rollTwo || 0);
        let strikeBonus = this.isStrike ? this.strikeBonus : 0;
        let spareBonus = this.isSpare ? this.spareBonus : 0;

        return baseScore + strikeBonus + spareBonus;
    }
}
