/** 15 puzzle 物件 */
type PuzzleData = {
  /** 字面數字 */
  number: number
  /** 數字對應陣列 */
  value: [number, number]
  /** 位置 */
  position: [number, number]
}

export {
  PuzzleData
}