<template>
  <div class="add-tags">
    <input
      class="add-tags__input"
      type="text"
      placeholder="Добавить тег..."
      v-model="tag"
      ref="input"
      @change="addTag"
    />

    <div class="add-tags__block">
      <div class="add-tags__item" v-for="(tag, index) in tags" :key="index">
        #{{ tag }}
        <span class="add-tags__delete" @click="deleteTag(index)"> &#10005; </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTags',
  props: {
    tags: Array,
  },

  data: () => ({
    tagsComponent: [],
    tag: '',
  }),

  mounted() {
    this.tagsComponent = this.tags;
  },

  methods: {
    deleteTag(index) {
      this.tagsComponent = this.tags.filter((tag) => tag !== this.tags[index]);
      this.$emit('change-tags', this.tagsComponent);
    },

    addTag() {
      if (this.tag.length <= 0) return;
      if (this.tags.find((tag) => tag === this.tag)) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Такой тег уже есть',
        });
        setTimeout(() => {
          this.$refs.input.focus();
        }, 0);
        return;
      }
      this.tagsComponent = [...this.tags, this.tag];
      this.tag = '';
      this.$emit('change-tags', this.tagsComponent);
      setTimeout(() => {
        this.$refs.input.focus();
      }, 0);
    },
  },
};
</script>

<style lang="stylus">
@import '../../assets/stylus/base/vars.styl'

.add-tags__input
  border-bottom 1px solid rgba(0, 0, 0, 0.12)
  padding-bottom 5px
  font-size 13px
  color steel-gray
  margin-bottom 15px

  &::placeholder
    color #B0B0BC

.add-tags__block
  margin 0 -4px 10px
  min-height 32px

.add-tags__item
  display inline-block
  align-items center
  color eucalypt
  font-size 13px
  background-color #F5F7FB
  padding 5px
  margin 0 5px 10px

.add-tags__delete
  margin-left 5px
  color #B0B0BC
  font-size 10px
  font-weight 600
  cursor pointer
</style>
