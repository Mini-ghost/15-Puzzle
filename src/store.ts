import Vue from 'vue';
import Vuex from 'vuex';

import { PuzzleData } from './siteFuture'

Vue.use(Vuex);

/** 產生二微陣列 [x, y]: 座標 */
const initMultiArrays = (num: number): [number, number] => {
  return [ num % 4, Math.floor(num / 4) ]
}

/**
 * 原始 15 + 1 筆 puzzle 資料
 * number: number
 * value: [x, y]
 * position: [x, y]
 * */
const initPuzzle = (num: number): PuzzleData[] => {
  const sum = num * num
  const puzzle: PuzzleData[] = []
  for (let number: number = 1; number <= sum; number++) {
    const value = initMultiArrays(number - 1)
    puzzle.push({ number, value, position: [0, 0]})
  }
  return puzzle
}

/**
 * 檢查資料是否有解答
 * ary: puzzle 陣列,
 * */
const checkResolvable = (ary: PuzzleData[]): boolean => {
  /** 16 的序號 */
  const space: number = ary.findIndex(item => item.number === 16)
  /** 16 的列（X軸位置） */
  const spaceX: number = initMultiArrays(space)[0]
  /**
   * 切掉空格，
   * splice 會動到原本的陣列，所以這裡解構出一個陣列來操作 
   * */
  const newAry: PuzzleData[] = [...ary].splice(space, 1)
  /** 逆序列數 */
  const count: number = countComputed(newAry)
  return count % 2 + spaceX % 2 === 0
}

/** 逆序列累加 */
const countComputed = (ary: PuzzleData[]): number => {
  let count: number = 0
  ary.forEach((item: PuzzleData, index: number, _ary: PuzzleData[]) => {
    const length: number = ary.length
    let _index: number = index + 1
    while (_index < length) {
      // item.number 後面的數字只要有比我小的就加 1
      if (item.number > _ary[_index].number) count++
      _index++
    }
  })
  return count
}

export default new Vuex.Store({
  state: {
    puzzle: [],
    moves: 0,
    empty: [0, 0],
    complete: false,
    play: false
  },
  mutations: {
    /** 改變滑塊定位 */
    SET_ITEM_POS(state, data) {
      const { position, index } = data
      const puzzle: PuzzleData = state.puzzle[index]
      puzzle.position = position
    },
    /** 初始化 Puzzle */
    SAVE_PUZZLE(state, data) {
      state.puzzle = data
    },
    /** 設定空格座標 */
    SET_EMPTY(state, id) {
      state.empty = id
    },
    /** 更新移動次數 */
    SET_MOVE(state, num) {
      state.moves = state.moves + num
    },
    /** 切換遊戲狀態 */
    SET_PLAY_TYPE(state, type) {
      state.play = type
    },
    /** 遊戲是否完成判斷 */
    SET_COMPLETE(state, data) {
      state.complete = data
    },
    RESET_MOVE(state, num) {
      state.moves = num
    }
  },
  actions: {
    INIT_PUZZLE({ commit }) {
      /** 初始化 puzzle 資料 */
      const puzzle: PuzzleData[] = initPuzzle(4)
      let emptyIndex: number = 0
      let emptyArray: [number, number] = [0, 0]
      let resolvable: boolean = false
      while (!resolvable) {
        /** 打亂初始化的 puzzle 資料 */
        puzzle.sort(() => (Math.random() > 0.5 ? 1 : -1))
        resolvable = checkResolvable(puzzle)
      }
      /** 設定空格資料 */
      emptyIndex = puzzle.findIndex(item => item.number === 16)
      emptyArray = initMultiArrays(emptyIndex)
      /** 排組亂數後賦予定位 */
      puzzle.splice(emptyIndex, 1)
      puzzle.forEach((item, index) => {
        let id = index < emptyIndex? index : index + 1
        item.position = initMultiArrays(id)
      })
      commit('SAVE_PUZZLE', puzzle)
      commit('SET_EMPTY', emptyArray)
    }
  }
});
