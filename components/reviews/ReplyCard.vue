<template>
  <div>
    <v-layout columns v-if="reply.user.length > 0">
      <v-flex xs2 class="text-xs-right">
        <div><v-avatar size="28"><v-img :src="reply.user[0].picture"></v-img></v-avatar></div>
      </v-flex>
      <v-flex xs10>
        <div>{{ reply.user[0].name }}</div>
        <div v-show="!replyEditDialog">{{ reply.replyText }}</div>
        <v-btn v-if="!liked" icon @click="like" small><v-icon color="red" small>far fa-heart</v-icon></v-btn>
        <v-btn v-else icon small><v-icon color="red" small>fas fa-heart</v-icon></v-btn>
        {{ reply.like }}
        <div v-show="replyEditDialog">
          <v-textarea v-model="newReplyText" color="yellow"></v-textarea>
          <v-btn round color="warning" @click="replyEditSubmit"><span style="color:black">แก้ไข</span></v-btn>
          <v-btn round color="danger" @click="replyEditDialog = false">ยกเลิก</v-btn>
        </div>
        <div div v-if="canAccess">
          <v-btn icon @click="replyEditDialog = true" small><v-icon small>far fa-edit</v-icon></v-btn>
          <v-btn icon @click="confirmDel = true" small><v-icon small>far fa-trash-alt</v-icon></v-btn>
        </div>
      </v-flex>
    </v-layout>

      <v-dialog
        v-model="confirmDel"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">แน่ใจหรือไม่ว่าจะลบ</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              flat="flat"
              @click="confirmDel = false"
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="replyDel"
            >
              ยืนยันการลบ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['reply', 'review_id'],
  data () {
    return {
      confirmDel: false,
      replyEditDialog: false,
      newReplyText: this.reply.replyText,
      liked: false
    }
  },
  computed: {
    canAccess () {
      if (this.$auth.$state.loggedIn) {
        if (this.reply.user[0].sub_id === this.$store.getters['users/subId'] || this.$store.getters['users/getIsAdmin']) {
          return true
        }
      } else {
        return false
      }
    }
  },
  mounted() {
    const likeReply = this.$store.getters['reviews/likeReply']
    if (likeReply.includes(this.reply._id)) {
      this.liked = true
    } else {
      this.liked = false
    }
  },
  methods: {
    async like () {
      await this.$axios.$put(process.env.restMongoUrl + '/reviews/reply/like/' + this.reply._id)
      await this.$axios.$post(process.env.restMongoUrl + '/reviews/ip-reply-like/create/' + this.reply._id)
      this.reply.like++
      this.liked = true
    },
    async replyDel () {
      await this.$axios.$put(process.env.restMongoUrl + '/reviews/reply/hide/' + this.reply._id)
      await this.$axios.$put(process.env.restMongoUrl + '/reviews/replyCount/del/' + this.review_id)
      this.$emit('replyDelete')
    },
    async replyEditSubmit () {
      await this.$axios.$put(process.env.restMongoUrl + '/reviews/reply/edit', {
        _id: this.reply._id,
        replyText: this.newReplyText
      })
      this.$toast.success('แก้ไขตอบกลับแล้ว')
      this.replyEditDialog = false
      this.reply.replyText = this.newReplyText
    }
  }
}
</script>

<style scoped>
.reply-text{
  padding-top: 10px;
}
</style>