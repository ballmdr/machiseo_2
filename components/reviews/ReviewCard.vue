<template>
  <div class="card box" style="padding: 0.5rem !important" v-if="review.user.length > 0">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <b-image
            class="is-64x64"
            :src="review.user[0].picture"
            ratio="1by1"
            :rounded="true"
          ></b-image>
        </div>
        <div class="media-content">
          <p class="title is-4" style="margin-bottom: 5px">{{ review.user[0].name }}</p>
          <b-rate
            v-model="review.score"
            :show-score="false"
            :show-text="true"
            :texts="rate_text"
          >
          </b-rate>
        </div>
      </div>
      <div class="content">
        <span v-html="review.review_text"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { voteUpdate } from "~/assets/js/api";
import { nl2br } from "~/assets/js/util";

export default {
  props: ["review"],
  data() {
    return {
      currentScore: this.review.score,
      liked: false,
      rate_text: ["แย่", "พอใช้", "ดี", "ดีมาก", "สุดยอด"],
    };
  },
  mounted() {
    console.log(this.review);
  },
  methods: {
    showAvatar(pic) {
      var img = new Image();
      if (img.height != 0) {
        return pic;
      } else {
        return "https://cdn.pixabay.com/photo/2016/03/31/14/47/avatar-1292817_960_720.png";
      }
    },
    isInArray(value, array) {
      return array.indexOf(value) > -1;
    },
    setScore(score) {
      thi;
      s.currentScore = score;
    },
    isNew(index) {
      if (this.new && index === 0) {
        return true;
      } else {
        return false;
      }
    },
    async like() {
      await this.$axios.$put(
        process.env.restMongoUrl + "/reviews/like/" + this.review._id
      );
      await this.$axios.$post(process.env.restMongoUrl + "/reviews/ip-like/create", {
        review_id: this.review._id,
      });
      this.review.like++;
      this.liked = true;
    },
  },
};
</script>

<style scoped>
.no-vote {
  color: grey;
}
.selecting {
  color: green;
}
.review-text {
  padding-top: 20px;
}
.icon-action {
  margin-top: 20px;
  margin-left: -15px;
  margin-bottom: 15px;
}
</style>
