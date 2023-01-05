import type {
  Vec2,
  GameObj,
  PosComp,
  Color,
  OutlineComp,
  AreaComp,
  BodyComp,
} from 'kaboom';
import kctx from './kctx';

const RING_HEIGHT = 40;

type TowerGameObj = GameObj<PosComp | TowerComp>;
type RingGameObj = GameObj<
  PosComp | OutlineComp | AreaComp | BodyComp | RingComp
>;

interface TowerComp {
  addRing: (ring: RingGameObj) => Vec2;
  getAvailableRing: () => RingGameObj;
}

function tower(): TowerComp {
  let rings: RingGameObj[] = [];

  return {
    addRing: function (this: TowerGameObj, ring) {
      rings = [...rings, ring];
      return kctx.vec2(
        this.pos.x,
        this.pos.y - (rings.length - 1) * RING_HEIGHT
      );
    },
    getAvailableRing: function () {
      return rings[rings.length - 1];
    },
  };
}

interface RingComp {
  select: () => void;
  placeOnTower: (tower: TowerGameObj) => void;
}

function ring(): RingComp {
  return {
    select: function (this: RingGameObj) {
      this.outline.color = kctx.CYAN;
      this.outline.width = 2;
    },
    placeOnTower: function (this: RingGameObj, tower: TowerGameObj) {
      const { x, y } = tower.addRing(this);
      this.pos.x = x;
      this.pos.y = y;
    },
  };
}

function createTower(position: Vec2): TowerGameObj {
  return kctx.add([
    kctx.pos(position),
    kctx.rect(50, 250),
    kctx.color(150, 150, 150),
    kctx.origin('bot'),
    tower(),
    'tower',
  ]);
}

function createRing(settings: {
  color: Color;
  size: 'large' | 'medium' | 'small';
}): RingGameObj {
  const { color, size } = settings;

  let width = 0;
  switch (size) {
    case 'large':
      width = 150;
      break;
    case 'medium':
      width = 110;
      break;
    case 'small':
      width = 70;
      break;
  }

  return kctx.add([
    kctx.pos(),
    kctx.outline(1, kctx.BLACK),
    kctx.rect(width, RING_HEIGHT),
    kctx.origin('bot'),
    kctx.color(color),
    kctx.area(),
    kctx.body(),
    ring(),
    'ring',
  ]);
}

function gameScene(): void {
  // Ground
  kctx.add([
    kctx.pos(0, 500),
    kctx.rect(kctx.width(), 100),
    kctx.color(0, 0, 0),
  ]);
  kctx.add([
    kctx.pos(0, 550),
    kctx.rect(kctx.width(), 100),
    kctx.color(255, 255, 0),
    kctx.area(),
    kctx.solid(),
  ]);

  const tower1 = createTower(kctx.vec2(150, 550));
  const tower2 = createTower(kctx.vec2(400, 550));
  const tower3 = createTower(kctx.vec2(650, 550));

  const ring1 = createRing({
    color: kctx.RED,
    size: 'large',
  });

  const ring2 = createRing({
    color: kctx.YELLOW,
    size: 'medium',
  });

  const ring3 = createRing({
    color: kctx.GREEN,
    size: 'small',
  });

  ring1.placeOnTower(tower1);
  ring2.placeOnTower(tower1);
  ring3.placeOnTower(tower1);

  let selectedRing: RingGameObj | null = null;

  onUpdate('tower', (tower) => {
    const availableRing = (tower as TowerGameObj).getAvailableRing();
    if (availableRing) {
      console.log(availableRing._id);
    }
  });

  onKeyPress('space', () => {
    if (!selectedRing || !selectedRing.isGrounded()) {
      return;
    }

    selectedRing.jump(1000);
  });

  onKeyDown('right', () => {
    if (!selectedRing || selectedRing.isGrounded()) {
      return;
    }

    selectedRing.moveBy(10, 0);
  });

  onKeyDown('left', () => {
    if (!selectedRing || selectedRing.isGrounded()) {
      return;
    }

    selectedRing.moveBy(-10, 0);
  });

  onKeyDown('enter', () => {});
}

export default gameScene;
