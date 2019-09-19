<template>
  <transition name="fade" @after-enter="handleAfterEnter" appear>
    <div class="puzzle-group__item" :style="styleObj" @click="handleClick">
      <div class="puzzle-group__content">{{ item.number }}</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PuzzleData } from './../siteFuture';

@Component
export default class PuzzleItem extends Vue {
  @Prop({ default: 0 }) private index!: number;
  @Prop({ default: 75 }) private itemWidth!: number;
  @Prop() private item!: PuzzleData;

  get complete(): boolean {
    return this.$store.state.complete
  }

  get propItem(): PuzzleData {
    return this.item;
  }
  set propItem(data: PuzzleData) {
    const { index, $store } = this;
    const { position } = data
    $store.commit('SET_ITEM_POS', { position, index });
  }

  get styleObj(): object {
    const { itemWidth } = this
    const { position, number } = this.item;
    const left = position[0] * itemWidth + 'px';
    const top = (position[1] % 4) * itemWidth + 'px';
    const transitionDelay = number * 0.0667 + 's'
    return { top, left, transitionDelay };
  }

  /** 滑塊物件點擊 */
  private handleClick(): void {
    const { propItem } = this;
    const position = this.$store.state.empty;
    const oldPosition = this.propItem.position;
    /** 差幾列 */
    const col = Math.abs(position[0] - oldPosition[0]);
    /** 差幾行 */
    const row = Math.abs(position[1] - oldPosition[1]);
    /** 判斷該物件是否相鄰 */
    const isNeighbor = col + row === 1;
    if(this.$store.state.complete) return
    if (isNeighbor) {
      this.propItem = { ...propItem, position };
      this.$store.commit('SET_EMPTY', oldPosition);
      this.$store.commit('SET_MOVE', 1)
    }
  }

  /** 動畫結束後清除動畫延遲 */
  private handleAfterEnter(el: HTMLElement): void {
    el.style.transitionDelay = ''
  }
}
</script>

<style lang="sass">

%transition
  transition: .5s

.puzzle
  &-group
    &__item
      width: 25%
      height: 25%
      padding: 10px
      position: absolute
      cursor: pointer
      @extend %transition
      @media (max-width: 667px)
        padding: 6px
    &__content
      width: 100%
      height: 100%
      display: flex
      justify-content: center
      align-items: center
      background-color: #6e7999
      color: white
      border-radius: 12px
      @extend %transition
      &:hover
        background-color: #005368
</style>
