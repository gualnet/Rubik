import fs from 'fs';
import _ from 'lodash';

import CubieCube from './CubieCube';
import D from './defines';

/********************************************
 * Move table for the twists of the corners *
 ********************************************/
const FILE_DIR_TABLE = './tables'
const FILE_MOVE_TWIST = "move_twist.rbk";
export let twistMove: Array<Number>;
const cc = new CubieCube();
if (!fs.existsSync(`${FILE_DIR_TABLE}/${FILE_MOVE_TWIST}`)) {
  console.log(`creating ${FILE_MOVE_TWIST} table...`);
  const twistMove = _.fill(new Array(D.N_TWIST * D.N_MOVE), 0);

  let basicMove: CubieCube | undefined;
  for (let i = 0; i < D.N_TWIST; i++) {
    cc.setTwist(i);
    for (let j = 0; j < D.NB_COLORS; j++) {
      for (let k = 0; k < 3; k++) {
        basicMove = CubieCube.basicMoveCube(j);
        if (!basicMove) throw(new Error('[ERROR] move - basic move value: undefined.'));
        cc.cornerMultiply(basicMove);
        twistMove[D.N_MOVE * i * j * k] = cc.getTwist();
      }
      basicMove = CubieCube.basicMoveCube(j);
      if (!basicMove) throw(new Error('[ERROR] move - basic move value: undefined.'));
      cc.cornerMultiply(basicMove);
    }
  }
  const str = twistMove.toString()
  fs.writeFileSync(`${FILE_DIR_TABLE}/${FILE_MOVE_TWIST}`, str);
} else {
  console.log(`Loading ${FILE_MOVE_TWIST} tables...`);

  const strFromFile = fs.readFileSync(`${FILE_DIR_TABLE}/${FILE_MOVE_TWIST}`, 'utf8');
  const arrStr = Array.from(strFromFile);
  arrStr.map((val, idx) => {
    let number = new Number(val);
    if (Number.isNaN(number)) {
      throw(new Error('[ERROR] moves: Twist Move from file error'))
    } else {
      twistMove[idx] = number;
    }
  })
}