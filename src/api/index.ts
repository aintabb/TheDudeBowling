import { Router } from 'express';
import game from './routes/game.route';

export default () => {
	const app = Router();
	game(app);

	return app
}