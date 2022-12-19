<template>
  <article class="media">
    <div class="media-left">
      <b-image
        class="is-64x64"
        :src="review.user[0].picture"
        ratio="1by1"
        rounded="true"
      ></b-image>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ review.user[0].name }}</strong>
          <br />
          <span v-html="review.review_text"></span>
        </p>
      </div>
    </div>
  </article>
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
    };
  },
  mounted() {
    //console.log(this.review);
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
