import kctx from './kctx';
import gameScene from './gameScene';
import './style.css';

kctx.scene('game', gameScene);

kctx.go('game');
