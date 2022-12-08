<template>
  <v-layout column>
    <v-flex xs12>
      <review-form v-if="$auth.$state.loggedIn" @reviewUpdateNew="updateLatest"></review-form>
      <review-login v-else></review-login>
    </v-flex>
    <v-flex xs12 v-for="(review, index) in reviews" :key="review._id">
      <review-card class="animated" :class="{pulse:isNew(index)}" :review="review"  @delReview="deleteReview(index)"></review-card>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</template>

<script>
import ReviewForm from '~/components/reviews/ReviewForm'
import ReviewCard from '~/components/reviews/ReviewCard'
import ReviewLogin from '~/components/reviews/ReviewLogin'

export default {
  props: ['reviews'],
  data () {
    return {
      new: false,
      likeReview: []
    }
  },
  components: { ReviewForm, ReviewCard, ReviewLogin },
  methods: {
    isNew (index) {
      if (this.new && index === 0) {
        return true
      } else {
        return false
      }
    },
    async updateLatest () {
      // console.log(process.env.restMongoUrl + '/reviews/latest/' + this.$store.getters['series/getNid'])
      const res = await this.$axios.$get(process.env.restMongoUrl + '/reviews/latest/' + this.$store.getters['series/getNid'])
      this.new = true
      this.$toast.success('รีวิวของคุณมีค่า ขอบคุณที่ร่วมรีวิว')
      // this.reviews.unshift(this.$store.getters['reviews/getReview'])
      this.reviews.unshift(res[0])
    },
    async deleteReview (index) {
      this.$toast.success('ลบรีวิวแล้ว')
      this.reviews.splice(index, 1)
    }
  }
}
</script>


