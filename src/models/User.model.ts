import { Roll } from '../type';
import Game from './Game.model';

export default class User {
    private _id: number;
    private _name?: string;

    constructor(_id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    get id() {
        return this._id;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }
}
