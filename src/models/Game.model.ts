import { Roll } from '../type';
import Frame from './Frame.model';
import TenthFrame from './TenthFrame.model';

export default class Game {
    constructor(id: number) {
        this._id = id;
        this._rolls = [];
        this._frames = [];
        const NUM_OF_REG_FRAMES = 9;
        for (let index = 1; index <= NUM_OF_REG_FRAMES; index++) {
            this._frames.push(new Frame(this, index));
        }
        this._frames.push(new TenthFrame(this));
        this._frameNumber = 1;
        this._pinsRemaining = 10;
        this._rollCount = 0;
        this._tenthFrameMark = false;
        this._gameOver = false;
    }

    private _id: number;
    private _rolls: Array<Roll>;
    private _frames: Array<Frame>;
    private _frameNumber: number;
    private _pinsRemaining: number;
    private _rollCount: number;
    private _tenthFrameMark: boolean;
    private _gameOver = false;

    get id() {
        return this._id;
    }

    get pinsRemaining() {
        return this._pinsRemaining;
    }

    get frames() {
        return this._frames;
    }

    get gameOver() {
        return this._gameOver;
    }

    get frameNumber() {
        return this._frameNumber;
    }

    get rollCount() {
        return this._rollCount;
    }

    get totalScore() {
        return this
                .frames
                .reduce((accResult, frame) =>
                    accResult + frame.score, 0);
    }

    private get isFirstRoll() {
        return this.rollCount == 0;
    }

    private get currentFrame() {
        return this.frames[this._frameNumber - 1];
    }

    public roll(...rolls: Roll[]) {
        this._rolls.push(...rolls);

        for (let i = 0; i < rolls.length; i++) {
            let roll = rolls[i];
            if (roll > this.pinsRemaining) throw new Error('Invalid roll.');

            if (this._frameNumber != 10) this.handleStandardFrameRoll(roll);
            else this.handleTenthFrameRoll(roll);
        }
    }

    private handleStandardFrameRoll(roll: Roll) {
        if (this.isFirstRoll) {
            this.currentFrame.rollOne = roll;
            if (roll == 10) {
                // Strike
                this.switchToNextFrame();
            }
            else {
                // Prepare pins and roll counter
                // for the Second roll
                this._pinsRemaining -= roll;
                this._rollCount++;
            }
        }
        else {
            // Second Roll
            this.currentFrame.rollTwo = roll;
            this.switchToNextFrame();
        }
    }

    private handleTenthFrameRoll(roll: Roll) {
        const tenthFrame = this.currentFrame as TenthFrame;
        if (this.rollCount == 0) {
            tenthFrame.rollOne = roll;
        }
        else if (this.rollCount == 1) {
            tenthFrame.rollTwo = roll;
            if (this._pinsRemaining - roll > 0) this._gameOver = true;
        // TenthFrameMark specifies that there is a strike
        // in tenth frame.
        } else if (this._tenthFrameMark) {
            tenthFrame.rollThree = roll;
            this._gameOver = true;
        }

        this._pinsRemaining -= roll;
        this._rollCount++;

        if (this._pinsRemaining == 0) {
            this._tenthFrameMark = true;
            this._pinsRemaining = 10;
        }
    }

    private switchToNextFrame() {
        this._frameNumber++;
        this._pinsRemaining = 10;
        this._rollCount = 0;
    }
}