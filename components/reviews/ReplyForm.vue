<template>
  <div>
    <div>
      <v-avatar size="28"><v-img :src="$store.getters['users/picture']"></v-img></v-avatar>
      <v-textarea style="margin-top:10px;" box auto-grow dark color="yellow" label="ตอบรีวิว" v-model="reply.replyText"></v-textarea>
    </div>
    <div>
      <v-btn round color="danger" @click="$emit('replyClose')">ยกเลิก</v-btn>
      <v-btn @click="replySubmit" color="warning" small round><span style="color:black">ตอบรีวิว</span></v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: ['review_id'],
  data () {
    return {
      reply: {
        replyText: '',
        review_id: this.review_id,
        sub_id: this.$store.getters['users/subId']
      }
    }
  },
  methods: {
    async replySubmit () {
      await this.$axios.$post(process.env.restMongoUrl + '/reviews/reply/add', this.reply)
      await this.$axios.$put(process.env.restMongoUrl + '/reviews/replyCount/add/' + this.reply.review_id)
      this.reply.replyText = ''
      this.$emit('replyUpdate')
    }
  }
}
</script>
