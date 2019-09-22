<template>
  <div id="app">
    <h1 class="title fz-40 fw-bold">15 puzzle</h1>
    <p class="moves fz-24 fw-bold">{{ moves > 1? 'MOVES' : 'MOVE' }} : {{ moves }}</p>
    <div class="puzzle">
      <PuzzleCover
        v-show="!play"
        :complete="complete"
        @play-change="playToggle"
      />
      <div class="puzzle-content">
        <div class="puzzle-group">
          <PuzzleItem
            v-for="(item, id) in puzzle"
            :itemWidth="itemWidth"
            :item="item"
            :index="id"
            :key="item.number"
          />
        </div>
      </div>
    </div>
    <transition name='fade' appear>
      <div class="reset" v-if="play" >
        <button class="reset-item fz-36 fw-bold" @click="handleRest">reset</button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import PuzzleCover from '@/components/PuzzleCover.vue'
import PuzzleItem from '@/components/PuzzleItem.vue'

import { PuzzleData } from './siteFuture'

@Component({
  components: {
    PuzzleCover,
    PuzzleItem
  }
})
export default class App extends Vue {

  private width: number = 0

  get puzzle(): PuzzleData[] {
    return this.$store.state.puzzle;
  }

  /** 遊戲完成狀態 */
  get complete(): boolean {
    return this.$store.state.complete;
  }
  set complete(val: boolean) {
    const { commit } = this.$store;
    commit('SET_COMPLETE', val);
  }

  /** 遊戲進行中flag */
  get play(): boolean {
    return this.$store.state.play;
  }
  set play(type: boolean) {
    const { commit } = this.$store;
    commit('SET_PLAY_TYPE', type);
  }

  /** 計步器 */
  get moves(): number {
    return this.$store.state.moves;
  }
  set moves(num: number) {
    this.$store.commit('RESET_MOVE', 0)
  }

  get itemWidth(): number {
    const { width } = this
    return width > 667? 120 : 77
  }

  mounted() {
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  }

  beforeDestory() {
    window.removeEventListener('resize', this.getWindowWidth)
  }

  private getWindowWidth(): void {
    this.width = window.innerWidth
  }

  /**
   * 開始新局
   * 如果是完成的狀態按下 play 就歸零計步器
   * 完成狀態改成：未完成
   * */
  private initePuzzleData(): void {
    this.$store.dispatch('INIT_PUZZLE');
    this.moves = 0
    this.complete = false
  }

  /** 遊戲開始結束 */
  private playToggle(): void {
    this.initePuzzleData()
    this.play = !this.play;
  }

  /** 重置 */
  private handleRest(): void {
    this.initePuzzleData()
  }

  /** 每移動一次就做一次檢查 */
  @Watch('puzzle', { deep: true })
  puzzleDataChange(val: PuzzleData[]): void {
    /** 這裡很麻煩不能直接拿兩個陣列相比，要比每一個值 */
    const complete = val.every(
      (item: PuzzleData) => item.value.join('') === item.position.join(''));
    if( complete ) {
      this.complete = true
      /** 等動畫做完 */
      setTimeout(() => { this.play = false }, 1000)
    }
  }
}
</script>

<style lang="sass">
@import "./assets/scss/variable/reset"
@import "./assets/scss/variable/font"
@import "./assets/scss/variable/animation"

$sec: .5s

*, *::before, *::after
  box-sizing: border-box

html
  background-color: #f1f1f1
  user-select: none
  height: 100vh
  overflow: hidden

button
  @include inputInit

#app
  font-family: "Shadows Into Light", "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px

%flexCenter
  @include flexCenter

.title
  animation: slideInUp $sec both

.moves
  animation: slideInUp $sec $sec both

.reset
  &-item
    position: relative
    color: #344951
    &:hover
      color: #41b883

.puzzle
  position: relative
  width: 500px
  height: 500px
  margin-top: 2.5vw
  margin-right: auto
  margin-left: auto
  box-shadow: 0 0 10px rgba(black, .25)
  border-radius: 16px
  overflow: hidden
  animation: slideInUp $sec $sec*2 both
  transition: $sec
  @media (max-width: 667px)
    width: 320px
    height: 320px
  &:hover
    box-shadow: 0 0 20px rgba(black, .25), 0 0 5px rgba(black, .75)
  &-content
    padding: 5px
    width: 100%
    height: 100%
    background-color: #344951
    @extend %flexCenter
  &-group
    position: relative
    width: calc(100% - 10px)
    height: calc(100% - 10px)
    display: flex
    flex-wrap: wrap
    font-size: 2.125rem
    @media (max-width: 667px)
      width: calc(100% - 6px)
      height: calc(100% - 6px)

.fade
  &-enter,
  &-leave-to
    opacity: 0

  &-enter-active,
  &-leave-active
    transition: $sec
</style>
