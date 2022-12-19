<template>
  <section class="section">
    <review-card v-for="(review, index) in reviews" :review="review"></review-card>
  </section>
</template>

<script>
import ReviewCard from "~/components/reviews/ReviewCard";

export default {
  props: ["reviews"],
  data() {
    return {};
  },
  components: { ReviewCard },
  methods: {},
  mounted() {
    console.log(this.reviews);
  },
};
</script>
