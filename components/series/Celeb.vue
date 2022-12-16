<template>
  <div class="columns">
    <div class="column is-one-quarter" v-for="(celeb, index) in celebs">
      <figure class="image is-96x96">
        <img :src="cdnUrl + celeb.field_celeb_profile.uri.url" class="is-rounded" />
      </figure>
    </div>
  </div>
</template>
<script>
export default {
  props: ["celebs"],
  data() {
    return {
      cdnUrl: process.env.cdnUrl,
    };
  },
  mounted() {
    console.log(this.celebs);
  },
};
</script>
