import {AdvancedDynamicTexture, Control, Style, TextBlock} from "@babylonjs/gui";
import State from "./State";

export class GameGUI {

  texture;
  canvasWidth;
  canvasHeight;
  textScore;
  textLevel;
  textLives;
  textHigh;
  textMissile;
  textScale = 1;

  constructor() {
    this.texture = AdvancedDynamicTexture.CreateFullscreenUI("UI", false);
    this.getCanvasSize();
    this.createTextNodes();
    this.fixTextScale();
    window.onresize = () => {
      this.getCanvasSize();
      this.fixTextScale();
    }
  }

  createTextNodes() {
    let fontSize = 22 * this.textScale;
    let spacing = 150 * this.textScale;
    //Score
    this.textScore = new TextBlock();
    this.textScore.color = "white";
    this.textScore.fontFamily = '"Press Start 2P"';
    this.textScore.fontSize = fontSize;
    this.textScore.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.textScore.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.textScore.left = -spacing * 3;
    this.textScore.top = 40;
    this.texture.addControl(this.textScore);

    // Level
    this.textLevel = new TextBlock();
    this.textLevel.color = "white";
    this.textLevel.fontSize = fontSize;
    this.textLevel.fontFamily = '"Press Start 2P"';
    this.textLevel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.textLevel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    this.textLevel.left = -spacing;
    this.textLevel.top = 40;
    this.texture.addControl(this.textLevel);

    // Lives
    this.textLives = new TextBlock();
    this.textLives.color = "white";
    this.textLives.fontSize = fontSize;
    this.textLives.fontFamily = '"Press Start 2P"';
    this.textLives.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.textLives.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    this.textLives.left = spacing;
    this.textLives.top = 40;
    this.texture.addControl(this.textLives);

    // High score
    this.textHigh = new TextBlock();
    this.textHigh.color = "white";
    this.textHigh.fontSize = fontSize;
    this.textHigh.fontFamily = '"Press Start 2P"';
    this.textHigh.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.textHigh.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    this.textHigh.left = spacing * 3;
    this.textHigh.top = 40;
    this.texture.addControl(this.textHigh);

    // Missile availability
    this.textMissile = new TextBlock();
    this.textMissile.color = "white";
    this.textMissile.fontSize = fontSize;
    this.textMissile.fontFamily = '"Press Start 2P"';
    this.textMissile.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.textMissile.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.textMissile.top = -40;
    this.texture.addControl(this.textMissile);

  }

  update() {
    this.textScore.text = "SCORE:" + State.score;
    this.textLevel.text = "LEVEL:" + State.level;
    this.textLives.text = "LIVES:" + Math.max(0,State.lives);
    this.textHigh.text = "HIGH:" + (window.localStorage.getItem('highScore') ?? 0);
    this.textMissile.text = State.missileAvailable ? "MISSILE: READY" : "MISSILE: USED";
    this.textMissile.color = State.missileAvailable ? "#00FF00" : "#FF0000";
  }

  getCanvasSize() {
    this.canvasWidth = document.querySelector("canvas").width;
    this.canvasHeight = document.querySelector("canvas").height;
  }

  fixTextScale() {
    this.textScale = Math.min(1, this.canvasWidth / 1280);
    let fontSize = 22 * this.textScale;
    let spacing = 150 * this.textScale;
    this.textScore.fontSize = fontSize;
    this.textLives.fontSize = fontSize;
    this.textLevel.fontSize = fontSize;
    this.textHigh.fontSize = fontSize;
    this.textMissile.fontSize = fontSize;
    this.textScore.left = -spacing * 3;
    this.textLevel.left = -spacing;
    this.textLives.left = spacing;
    this.textHigh.left = spacing * 3;
  }
}
