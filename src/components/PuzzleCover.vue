<template>
  <transition name='fade' appear>
    <div class="puzzle-cover fw-bold">
      <transition name='fade' appear>
        <div class="puzzle-cover__completed" v-show="synceComplete">
          <h2 class="puzzle-cover__title fz-36">Congratulations</h2>
          <p class="puzzle-cover__depiction">You have successfully completed this <strong>15 puzzle</strong></p>
        </div>
      </transition>
      <button
        class="puzzle-cover__play"
        style="animation: jackInTheBox 0.5s 1.5s both;"
        @click="playToggle"
        @animationend="handleAnimationend"
      >Play</button>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Emit } from 'vue-property-decorator'
@Component
export default class PuzzleCover extends Vue {
  @PropSync('complete', { type: Boolean }) synceComplete!: boolean

  @Emit('play-change')
  private playToggle() {}

  /** 動畫結束後清除 style */
  private handleAnimationend({ target }: { target: HTMLElement }): void {
    setTimeout(() => target.removeAttribute('style'), 500)
  }
}
</script>

<style lang="sass">
$sec: .5s

.puzzle
  &-cover
    @include flexCenter
    @include absFull
    flex-direction: column
    background-color: rgba(#082342, 0.8)
    border-radius: 16px
    z-index: 9
    &__completed
      margin: 2rem 0
    &__play
      color: #00988a
      font-size: rem(72px)
      transition: $sec
      &:hover
        transform: scale(1.2) rotate(-10deg)
      &:active
        transform: scale(1) rotate(10deg)
        color: #055
    &__title
      color: #ffff00
      animation: slideInUp $sec both
    &__depiction
      color: #00988a
      animation: slideInUp $sec $sec both
</style>
