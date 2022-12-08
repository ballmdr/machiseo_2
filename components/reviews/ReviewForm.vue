<template>
  <v-card color="primary" >
    <v-card-title>
      <v-avatar size="38"><v-img :src="$store.getters['users/picture']"></v-img></v-avatar>&nbsp;&nbsp;<span class="headline">{{ $store.getters['users/name'] }}</span>
    </v-card-title>
    <logout></logout>
    <v-divider dark></v-divider>
    <v-card-actions>
    &nbsp;&nbsp;ให้เรตติ้ง <v-rating v-model="currentScore" color="yellow" half-increments hover></v-rating>{{ currentScore }}/5
    </v-card-actions>
    <v-card-text>
      <v-textarea
        dark
        box
        auto-grow
        v-model="review_text"
        label="เขียนรีวิว"
        color="yellow"
      ></v-textarea>
      <v-btn large round color="warning" @click="reviewSave"><span style="color:black">โพสต์รีวิว</span></v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
// import { getUserObj } from '~/assets/js/util'
import { voteUpdate } from '~/assets/js/api'
import Logout from '~/components/users/Logout'

export default {
  data () {
    return {
      currentScore: 0,
      review_text: '',
      user: {},
      reviewObj: {}
    }
  },
  components: {
    Logout
  },
  methods: {
    setScore (selectedScore) {
      this.currentScore = selectedScore
    },
    async updateUser () {
      const tmpUser = await this.$axios.$get(process.env.restMongoUrl + '/users/' + this.$store.getters['users/subId'])
      if (tmpUser.length > 0) {
        /* User exists -> update user */
        await this.$axios.$put(process.env.restMongoUrl + '/users/update/' + tmpUser[0]._id, this.$store.getters['users/getUser'])
      } else {
        /* User not exists -> create user */
        await this.$axios.$post(process.env.restMongoUrl + '/users/create', this.$store.getters['users/getUser'])
      }
    },
    async reviewSave () {
      this.updateUser()
      this.reviewObj = {
        serie_id: String(this.$store.getters['series/getNid']),
        sub_id: this.$store.getters['users/subId'],
        review_text: this.review_text,
        score: this.currentScore,
        tag: []
      }
      await this.$axios.$post(process.env.restMongoUrl + '/reviews/create', this.reviewObj)
      // this.$store.dispatch('reviews/setReview', this.reviewObj)
      await voteUpdate(this.reviewObj.serie_id, this.currentScore)
      this.clearForm()
      this.$emit('reviewUpdateNew')
    },
    clearForm () {
      this.currentScore = 0
      this.review_text = ''
      this.tag = []
    }
  }
}
</script>


<style scoped>
.no-vote {
  color: grey;
}      
.selecting {
  color: green;
}                                    
</style> 