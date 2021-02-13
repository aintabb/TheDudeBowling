import { Router, Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import LoggerInstance from '../../loaders/logger';
import Game from '../../models/Game.model';
import { Roll } from '../../type'

const route = Router();
// Initialize an empty game object.
// # Note: We could've create a db instead and
// process the operations with it but I chose this way.
let activeGame : Game | undefined;
// Keep track of created games and assigned it
// to newly generated games.
let gameCount = 0;

export default (app: Router) => {
  app.use('/game', route);

  // Initialize a new game and return current stats.
  route.post('/createNewGame', (req: Request, res: Response, next: NextFunction) => {
    const logger : Logger = LoggerInstance;
    logger.debug('Initializing a new game!', req.body);

    activeGame = new Game(++gameCount);

    try {
      return res.status(201).send({
        id: activeGame.id,
        message: `New game with id: ${activeGame.id} has been created!`,
        totalScore: activeGame.totalScore,
        gameOver: activeGame.gameOver
      });
    } catch (e) {
      logger.error('Error!', e);
      return next(e);
    }
  });

  // Check if the game is active before playing the game.
  function isGameActive() {
    if (typeof activeGame === typeof undefined) {
      return false;
    }

    return true;
  }

  // Using POST b/c, roll the ball with the provided value.
  route.post('/roll/:rollValue', (req: Request, res: Response, next: NextFunction) => {
    const logger:Logger = LoggerInstance;
    logger.debug('Rolling the ball!', req.body);

    if (!isGameActive()) {
      console.log(`There is no active game! Create a new game`);
      return res.status(404).send({ message: "There is no active game! Create a new game"});
    }

    let rollValue = req.params.rollValue as unknown as Roll;
    if (rollValue === undefined || isNaN(rollValue) || rollValue > 10 || rollValue < 0)
    {
      if (rollValue > activeGame?.pinsRemaining) {
        console.log(`Invalid roll-${rollValue}!`);
        return res.status(400).send({ message: `Roll value should be in 1 - ${activeGame?.pinsRemaining}`});
      }
    }

    let remainingPinsForPreviousFrame = activeGame?.pinsRemaining - rollValue;
    let previousFrame = activeGame?.frameNumber;
    activeGame?.roll(req.params.rollValue as unknown as Roll);

    if(activeGame?.gameOver) {
      console.log(`Game Over! Score: ${activeGame?.totalScore}`);
      return res.status(400).send({ message: `Game Over! Total score is ${activeGame.totalScore}`});
    }

    try {
      return res.status(201).send({
        remainingPins: remainingPinsForPreviousFrame,
        frameNumber: previousFrame
      });
    } catch (e) {
      logger.error('Error!', e);
      return next(e);
    }
  });

  // Using POST, get specific frame score. 
  route.post('/frameScore/:frameNumber', (req: Request, res: Response, next: NextFunction) => {
    let frameNumber : number = Number.parseInt(req.params.frameNumber);
    const logger:Logger = LoggerInstance;
    logger.debug(`Getting the score of the Frame:${frameNumber}`);

    if (!isGameActive()) {
      logger.warn(`There is no active game! Create a new game`);
      return res.status(404).send({ message: "There is no active game! Please create a new game."});
    }

    if (isNaN(frameNumber) || frameNumber > 10 || frameNumber < 0)
    {
        logger.error(`Invalid Frame Number:${frameNumber}!`);
        return res.status(400).send({ message: `Frame value should be in 1 - 10`});
    }

    let frameScore : number = activeGame?.frames.
                                find(frame =>
                                   frame.order == frameNumber)?.
                                   framePoints;

    try {
      return res.status(201).send({
        id: activeGame.id,
        frameNumber: frameNumber,
        frameScore: frameScore
      });
    } catch (e) {
      logger.error('Error!', e);
      return next(e);
    }
  });

  // Auto-play, the game will roll the ball until end of the game and shows the result.
  route.post('/livePlay', (req: Request, res: Response, next: NextFunction) => {
    const logger:Logger = LoggerInstance;
    logger.debug(`Initializing a game with auto rolls!`);

    // Active game check for preventing any issues.
    if (!isGameActive()) {
      logger.warn(`There is no active game! Create a new game`);
      return res.status(404).send({ message: "There is no active game! Please create a new game."});
    }
    else {
      // Reset the current game!
      activeGame = new Game(gameCount);
    }

    while (!activeGame?.gameOver) {
      // Get a random number between the number of remaining pins and 0.
      let rollValue : Roll = Math.floor((Math.random() * activeGame?.pinsRemaining) + 1);
      let frameNumber = activeGame?.frameNumber;
      // Roll the ball and update the score
      activeGame?.roll(rollValue);

      // Get score of each frame for logging.
      let frameScore : number = activeGame?.frames.
                                find(frame =>
                                   frame.order == activeGame?.frameNumber)?.
                                   framePoints;

      logger.info(
        JSON.stringify({
          id: activeGame?.id,
          roll: rollValue,
          frameNumber: frameNumber,
          frameScore: frameScore
        })
      );
    }

    try {
      return res.status(201).send({
        message: `Game Over! Total Score: ${activeGame.totalScore}`,
        totalScore: activeGame?.totalScore
      });
    } catch (e) {
      logger.error('Error!', e);
      return next(e);
    }
  });

  // Tribute to the movie called "The Big Lebowski"
  route.get('/meetWithTheDude', (req: Request, res: Response, next: NextFunction) => {
    const logger:Logger = LoggerInstance;
    logger.debug(`Initializing a game with auto rolls!`);

    try {
      return res.status(201).send({
        message: `'The Dude abides.', 'Well, that\'s just, like, your opinion, man.',
                  'You are entering a world of pain.',`
      });
    } catch (e) {
      logger.error('Error!', e);
      return next(e);
    }
  });
};
