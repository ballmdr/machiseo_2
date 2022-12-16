<template>
  <div class="columns">
    <div class="column is-one-fifth" v-if="serie.field_viu !== null">
      <b-image src="/viu.png" class="stream_icon" />
    </div>
    <div class="column is-one-fifth" v-if="serie.field_netflix !== null">
      <b-image src="/netflix.png" class="stream_icon" />
    </div>
    <div class="column is-one-fifth" v-if="serie.field_disney !== null">
      <b-image src="/disney.png" class="stream_icon" />
    </div>
    <div class="column is-one-fifth" v-if="serie.field_prime !== null">
      <b-image src="/prime.png" class="stream_icon" />
    </div>
    <div class="column is-one-fifth" v-if="serie.field_wetv !== null">
      <b-image src="/wetv.png" class="stream_icon" />
    </div>
    <div class="column is-one-fifth" v-if="serie.field_iqiyi !== null">
      <b-image src="/iqiyi.png" class="stream_icon" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["serie"],
};
</script>
<style scoped>
.stream_icon {
  max-width: 70px !important;
}
</style>
