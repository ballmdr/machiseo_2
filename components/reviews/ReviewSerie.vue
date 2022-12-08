<template>
  <v-card dark style="cursor:pointer;margin:10px;" @click.native="$router.push(path)">
    <v-layout row wrap>
      <v-flex xs2>
        <v-card-title>{{ title }}</v-card-title>
        <v-img :src="baseUrl + poster"></v-img>
      </v-flex>
      <v-flex xs10>
        <v-card-text>
          <div v-if="review.user.length > 0">
            <v-avatar size="38"><v-img :src="review.user[0].picture"></v-img></v-avatar>
            {{ review.user[0].name }}
            <v-rating v-model="review.score" color="yellow" half-increments small readonly></v-rating>
          </div>
          <div v-html="review.review_text"></div>
          <div class="icon-action">
            <v-btn icon><v-icon color="red">far fa-heart</v-icon></v-btn>{{ review.like }}
            <v-btn icon><v-icon small>far fa-comments</v-icon></v-btn>{{ review.reply }}
          </div>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { nl2br } from '~/assets/js/util'
import { getSerieById_minimal } from '~/assets/js/api'

export default {
  props: ['review'],
  data () {
    return {
      serieObj: null,
      baseUrl: process.env.baseUrl,
      title: '',
      poster: '',
      path: ''
    }
  },
  async mounted () {
    this.review.review_text = nl2br(this.review.review_text)
    const serie = await this.$axios.$get(process.env.restMongoUrl + '/series/' + this.review.serie_id)
    if (serie.length < 1) {
      const drupal_serie = await getSerieById_minimal(this.review.serie_id)
      this.serieObj = {
        serie_id: this.review.serie_id,
        uuid: drupal_serie[0].uuid,
        title: drupal_serie[0].title,
        poster: drupal_serie[0].field_poster[0].url,
        path: drupal_serie[0].path.alias
      }
      await this.$axios.$post(process.env.restMongoUrl + '/series/create', this.serieObj)
    } else {
      this.serieObj = serie[0]
    }
    this.poster = this.serieObj.poster
    this.title = this.serieObj.title
    this.path = this.serieObj.path
  }
}
</script>
