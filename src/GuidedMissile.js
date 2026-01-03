import {Axis, Color3, MeshBuilder, Scalar, Space, Vector3, StandardMaterial} from "@babylonjs/core";
import spaceinvadersConfig from "../spaceinvaders.config";
import {Explosion} from "./Explosion";
import State from "./State";

export class GuidedMissile {

  constructor(gameAssets, scene, playerMesh, alienFormationController) {
    this.scene = scene;
    this.gameAssets = gameAssets;
    this.alienFormationController = alienFormationController;
    this.maxY = 120;
    if (spaceinvadersConfig.actionCam) {
      this.maxY = 400;
    }
    this.offset = 2;
    this.baseSpeed = 1.0;
    this.trackingSpeed = 0.15; // How aggressively it tracks
    this.target = null;

    // Create a larger, more distinctive missile
    this.missile = new MeshBuilder.CreateBox("guidedMissile", {
      width: 1.5,
      height: 6,
      depth: 1.5
    }, this.scene);

    // Add visual distinction - create a glowing effect
    this.missile.material = new StandardMaterial("missileMaterial", this.scene);
    this.missile.material.emissiveColor = new Color3(1, 0.3, 0.3); // Red glow
    this.missile.material.diffuseColor = new Color3(0.8, 0.1, 0.1);

    this.missile.position = new Vector3(
      playerMesh.position.x,
      playerMesh.position.y + this.offset,
      playerMesh.position.z
    );
    this.missile.metadata = {"type": "guidedmissile"};
    this.missile.collisionGroup = 4;
    this.missile.collisionMask = 18;
    this.startMissileLoop();
  }

  findNearestAlien() {
    if (!this.alienFormationController.aliens.length) {
      return null;
    }

    let nearestAlien = null;
    let shortestDistance = Infinity;

    for (let alien of this.alienFormationController.aliens) {
      let distance = Vector3.Distance(this.missile.position, alien.mesh.position);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestAlien = alien;
      }
    }

    return nearestAlien;
  }

  startMissileLoop() {
    this.missileObserver = this.scene.onBeforeRenderObservable.add(() => {
      // Find or update target
      if (!this.target || !this.alienFormationController.aliens.find(a => a.id === this.target.id)) {
        this.target = this.findNearestAlien();
      }

      // Calculate movement direction
      let moveDirection = new Vector3(0, this.baseSpeed, 0);

      if (this.target) {
        // Calculate direction to target
        let targetDirection = this.target.mesh.position.subtract(this.missile.position).normalize();

        // Blend upward movement with tracking
        moveDirection.x = targetDirection.x * this.trackingSpeed * State.delta;
        moveDirection.y = this.baseSpeed * State.delta;
        moveDirection.z = targetDirection.z * this.trackingSpeed * State.delta;

        // Rotate missile to face target for visual effect
        this.missile.lookAt(this.target.mesh.position);
      }

      this.missile.moveWithCollisions(moveDirection);

      if (this.missile.position.y > this.maxY) {
        this.destroyMissile();
      }
      if (this.missile.collider.collidedMesh) {
        this.handleCollision();
      }
      this.missile.checkCollisions = true;
    });
  }

  handleCollision() {
    let collidedWithType = (this.missile.collider.collidedMesh.metadata).type;

    // If the collidedMesh has lives, destroy the missile and subtract a life and exit the function
    if (this.missile.collider.collidedMesh.metadata?.lives > 0) {
      this.missile.collider.collidedMesh.metadata.lives -= 1;

      if (spaceinvadersConfig.oldSchoolEffects.enabled) {
        if (this.missile.collider.collidedMesh.metadata.type ==="mothership"){
          this.missile.collider.collidedMesh.rotate(Axis.Z, Scalar.RandomRange(-0.25, 0.25), Space.WORLD);
        } else {
          this.missile.collider.collidedMesh.rotate(Axis.Z, Scalar.RandomRange(-0.25, 0.25), Space.LOCAL);
        }
      } else {
        this.missile.collider.collidedMesh.rotate(Axis.X, Scalar.RandomRange(-0.3, 0.3), Space.LOCAL);
      }
      new Explosion(this.missile, 20, 1.5, this.scene); // Bigger explosion for missile
      this.destroyMissile();
      this.gameAssets.sounds.alienExplosion.play(0, 0.15, 1);
      return;
    }

    // No lives left so destroy the collidedMesh.
    if (collidedWithType === "alien") {
      this.missile.collider.collidedMesh.dispose(); // perform action with meshes onDispose event.
      this.destroyMissile();
    }
    if (collidedWithType === "barrier") {
      this.missile.collider.collidedMesh.dispose(); // perform action with meshes onDispose event.
      this.destroyMissile();
    }
    if (collidedWithType === "mothership") {
      this.missile.collider.collidedMesh.dispose(); // perform action with meshes onDispose event.
      this.destroyMissile();
    }
  }

  destroyMissile() {
    this.scene.onBeforeRenderObservable.remove(this.missileObserver);
    this.missile.dispose();
    this.disposed = true; // Tells our game loop to destroy this instance.
  }
}
