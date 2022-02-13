'use strict';
//モージュルの呼び出し
const fs = require('fs'); //FileSystem ファイルを扱うためのモジュール
const readline = require('readline');  //ファイルを1行ずつ読み込むモジュール

const rs = fs.createReadStream('./popu-pref.csv'); //CSVファイルからファイル読み込みを行うストリームを生成
const rl = readline.createInterface({ input: rs, output: {} } ); //

const prefectureDataMap = new Map(); //key:都道府県 value:集計データのオブジェクト

rl.on('line', lineString => {
  const columns = lineString.split(',');
const year = parseInt(columns[0]);
const prefecture = columns[1];
const popu = parseInt(columns[3]);
if (year === 2010 || year === 2015) {
  let value = prefectureDataMap.get(prefecture);
  if (!value) {
    value = {
      popu10: 0,
      popu15: 0,
      change: null
    };
  }
  if (year === 2010) {
    value.popu10 = popu;
  }
  if (year === 2015) {
    value.popu15 = popu;
  }
  prefectureDataMap.set(prefecture, value);
}
}); //rlオブジェクトでlineというイベントが発生したら無名関数を呼んでねえー－！

rl.on('close', ()=> {
  for(let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return (
      key +
      ': ' +
      value.popu10 +
      '=>' +
      value.popu15 +
      ' 変化率:' +
      value.change
      );
    });
    console.log(rankingStrings);
});
