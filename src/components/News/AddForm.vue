<template>
  <div class="news-add-form">
    <div class="news-add__actions-buttons">
      <button class="close_modal bold" @click.prevent="closeAddForm">x</button>
    </div>

    <form class="news-add__main" action="#" @submit.prevent="" ref="form">
      <div class="news-add__text">
        <textarea
          class="news-add__text-title"
          type="textarea"
          placeholder="Дайте тему"
          v-model="title"
        />

        <div v-if="src">
          <img :src="src" :alt="'photo'" class="post-image" />
        </div>

        <div>
          <input
            class="user-info-form__input_stylus-photo"
            type="file"
            ref="photo"
            id="photo"
            @change="processFile($event)"
            accept="image/*"
          />
        </div>

        <editor-content class="news-add__text-main" :editor="editor" />

        <editor-menu-bar
          class="news-add__actions"
          :editor="editor"
          v-slot="{ commands, isActive }"
          @mouseleave.native="hideLinkMenu"
        >
          <div class="news-add__actions-buttons">
            <button class="bold" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
              ж
            </button>

            <button
              class="italic"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              к
            </button>

            <button
              class="underline"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              ч
            </button>

            <div class="news-add__actions-link">
              <div class="news-add__actions-link-hidden" :class="{ 'is-active': isOpenLinkMenu }">
                <form @submit.prevent="setLinkUrl(commands.link, linkUrl)">
                  <input
                    type="text"
                    v-model="linkUrl"
                    placeholder="https://"
                    ref="linkInput"
                    @keydown.esc="hideLinkMenu"
                  />

                  <button type="button" @click="setLinkUrl(commands.link, linkUrl)">
                    <simple-svg :filepath="'/static/img/add.svg'" />
                  </button>
                </form>
              </div>
            </div>

            <div class="news-add__block photo" @click.prevent="loadPhoto">
              <simple-svg :filepath="'/static/img/photo.svg'" />
            </div>

            <div class="news-add__block" v-if="src">
              <button class="bold" @click.prevent="deletePhoto">x</button>
            </div>
          </div>
        </editor-menu-bar>
      </div>

      <div class="news-add__settings">
        <h4 class="news-add__settings-title">Настройка публикации</h4>

        <add-tags :tags="tags" @change-tags="onChangeTags" />

        <div class="is_planing" v-if="isPlaning">
          <h6>Запланированное время</h6>

          <p>{{ day }} {{ month.text }} {{ year }}, {{ time }}</p>
        </div>

        <button-hover
          class="news-add__planning"
          variant="white"
          bordered
          @click.native="openModal"
          v-if="!edit || deffered"
        >
          Запланировать
        </button-hover>

        <button-hover @click.native="submitForm">Опубликовать</button-hover>
      </div>
    </form>

    <modal class="news-add__modal" v-model="modalShow">
      <input
        v-model="planingTime"
        @input="onChangeDatePicker"
        title-position="left"
        :min-date="new Date()"
        is-inline
        :attributes="attrs"
        :key="componentKey"
      />

      <div class="news-add__modal-selects">
        <select class="select news-add__modal-select day" v-model="day" @change="changeDate">
          <option v-for="d in days" :key="d">{{ d }}</option>
        </select>

        <select class="select news-add__modal-select month" v-model="month" @change="changeDate">
          <option v-for="month in months" :key="month.val" :value="month">
            {{ month.text }}
          </option>
        </select>

        <select class="select news-add__modal-select year" v-model="year" @change="changeDate">
          <option v-for="i in years" :key="i">{{ i }}</option>
        </select>

        <select class="select news-add__modal-select time" v-model="time" @change="changeDate">
          <option v-for="t in times" :key="t">{{ t }}</option>
        </select>
      </div>

      <template slot="actions">
        <button-hover @click.native="onPlaning">Планировать</button-hover>
        <button-hover variant="red" bordered @click.native="onCancelPlaning">Отмена</button-hover>
      </template>
    </modal>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Bold, Italic, Underline, Link } from 'tiptap-extensions';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import moment from 'moment';
import AddTags from '@/components/News/AddTags';
import Modal from '@/components/Modal';
export default {
  name: 'NewsAddForm',
  components: { AddTags, EditorContent, EditorMenuBar, Modal },
  props: {
    edit: Boolean,
    deffered: Boolean,
    info: Object,
  },
  data: () => ({
    title: '',
    tags: [],
    editor: null,
    linkUrl: '',
    isOpenLinkMenu: false,
    modalShow: false,
    isPlaning: false,
    planingTime: new Date(),
    componentKey: 0,
    photo: '',
    src: '',
    attrs: [
      {
        key: 'weekends',
        content: 'weekends',
        dates: {
          start: new Date(2018, 0, 1),
          end: new Date(2022, 0, 1),
          weekdays: [1, 7],
        },
      },
    ],
    day: 1,
    month: { val: 0, text: 'Января' },
    year: 2000,
    months: [
      { val: 0, text: 'Января' },
      { val: 1, text: 'Февраля' },
      { val: 2, text: 'Марта' },
      { val: 3, text: 'Апреля' },
      { val: 4, text: 'Мая' },
      { val: 5, text: 'Июня' },
      { val: 6, text: 'Июля' },
      { val: 7, text: 'Августа' },
      { val: 8, text: 'Сентября' },
      { val: 9, text: 'Октября' },
      { val: 10, text: 'Ноября' },
      { val: 11, text: 'Декабря' },
    ],
    time: '12:00',
    times: [
      '8:00',
      '9:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ],
  }),
  computed: {
    ...mapGetters('profile/info', ['getInfo']),
    years() {
      return Array.from({ length: 60 }, (value, index) => 1970 + index);
    },
    days() {
      return this.month.val === 2
        ? this.year & 3 || (!(this.year % 25) && this.year & 15)
          ? 28
          : 29
        : 30 + ((this.month.val + (this.month.val >> 3)) & 1);
    },
  },
  watch: {
    planingTime(val) {
      console.log(val);
      this.day = moment(val).date();
      this.month = this.months[moment(val).month()];
      this.year = moment(val).year();
      this.time = `${moment(val).hour()}:00`;
    },
  },
  mounted() {
    if (this.info && this.info.imagePath) {
      this.src = this.info.imagePath;
    }
    if (this.edit) {
      this.title = this.info.title;
      this.tags = this.info.tags;
      this.editor = new Editor({
        content: `${this.info.postText}`,
        extensions: [new Bold(), new Italic(), new Underline(), new Link()],
      });
      if (this.deffered) {
        this.isPlaning = true;
        this.day = moment(this.info.time).date();
        this.month = this.months[moment(this.info.time).month()];
        this.year = moment(this.info.time).year();
        console.log(moment.unix(this.info.time));
        this.planingTime = moment.unix(this.info.time);
      }
    } else {
      this.editor = new Editor({
        content: '',
        extensions: [new Bold(), new Italic(), new Underline(), new Link()],
      });
      this.day = moment().date();
      this.month = this.months[moment().month()];
      this.year = moment().year();
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    ...mapActions('profile/feeds', ['actionsFeed']),
    ...mapActions('global/storagePostPhoto', ['apiStoragePostPhoto']),
    ...mapGetters('global/storagePostPhoto', ['getStoragePostPhoto']),
    ...mapMutations('global/storagePostPhoto', ['setStoragePostPhoto']),

    onChangeTags(tags) {
      this.tags = tags;
    },

    async submitForm() {
      if (this.title.length <= 3 || this.editor.getHTML().length <= 7) {
        if (this.modalShow) this.closeModal();
        this.$store.dispatch('global/alert/setAlert', {
          status: 'response',
          text: 'Тема должен состоять не менее трех символов, текст - не менее семи.',
        });
        return;
      }

      if (this.photo) {
        await this.apiStoragePostPhoto(this.photo);

        if (this.getStoragePostPhoto()) {
          this.imagePath = this.getStoragePostPhoto();
        }
      } else if (!this.src) {
        this.imagePath = '';
      } else if (this.info && this.info.imagePath) {
        this.imagePath = this.info.imagePath;
      }

      await this.actionsFeed({
        imagePath: this.imagePath,
        route: this.$route.name,
        postId: this.info ? this.info.id : null,
        edit: this.edit,
        id: this.getInfo.id,
        title: this.title,
        postText: this.editor.getHTML(),
        tags: this.tags,
        publishDate:
          this.isPlaning &&
          moment({
            years: this.year,
            months: this.month.val,
            date: this.day,
            hours: this.time.substring(0, 2),
          }).valueOf() / 1000,
      }).then(() => {
        this.$emit('submit-complete');
        this.setStoragePostPhoto(null);
      });
    },
    loadPhoto() {
      this.$refs.photo.click();
    },
    deletePhoto() {
      this.photo = '';
      this.src = '';
      this.setStoragePostPhoto('');
    },
    processFile(event) {
      [this.photo] = event.target.files;
      const reader = new window.FileReader();
      reader.onload = (e) => (this.src = e.target.result);
      reader.readAsDataURL(this.photo);
    },
    openLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.isOpenLinkMenu = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.isOpenLinkMenu = false;
      this.editor.focus();
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.isOpenLinkMenu = false;
    },
    openModal() {
      this.modalShow = true;
    },
    closeModal() {
      this.modalShow = false;
    },
    onPlaning() {
      console.log(this.planingTime);
      console.log(new Date());
      if (this.planingTime < new Date()) {
        this.$store.dispatch('global/alert/setAlert', {
          status: 'validation',
          text: 'Запланированное время не может быть в прошлом времени!',
        });
        return;
      }
      this.isPlaning = true;
      this.modalShow = false;
    },
    onCancelPlaning() {
      this.isPlaning = false;
      this.year = 2000;
      this.month = { val: 0, text: 'Января' };
      this.day = 1;
      this.time = '12:00';
      this.modalShow = false;
    },
    closeAddForm() {
      this.$emit('close-form');
    },
    setInfo(val) {
      this.day = moment(val).date();
      this.month = this.months[moment(val).month()];
      this.year = moment(val).year();
    },
    changeDate() {
      console.log('changeDate', this.year, this.month.val, this.day, this.time);
      this.componentKey += 1;
      this.planingTime = new Date(
        this.year,
        this.month.val,
        this.day,
        this.time.split(':')[0].toString()
      );
    },
    onChangeDatePicker(value) {
      this.day = moment(value).date();
      this.month = this.months[moment(value).month()];
      this.year = moment(value).year();
    },
  },
};
</script>
<style lang="stylus" media="screen">
.close_modal
  position relative
  top 8px
  left 95%
  width 25px

.is_planing
  margin-bottom 7px
  display flex
  flex-direction column

.post-image
  width 250px
  margin-bottom 30px

.news-add__text-main
  cursor text
</style>
