<template>
  <div>
    <div class="hero is-medium is-info">
      <div class="hero-body">
        <div class="columns">
          <div class="column is-one-third">
            <div class="card">
              <div class="card-image">
                <figure class="image">
                  <img :src="cdnUrl + serie.field_poster[0].uri.url" :alt="serie.title" />
                </figure>
              </div>
            </div>
          </div>
          <div class="column">
            <h1 class="title">{{ serie.title }}</h1>
            <p class="block">{{ serie.field_synopsis }}</p>
            <div class="columns">
              <div
                class="column is-one-quarter"
                v-for="(celeb, index) in serie.field_celeb"
              >
                <figure class="image is-96x96">
                  <img
                    :src="cdnUrl + celeb.field_celeb_profile.uri.url"
                    class="is-rounded"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <b-carousel-list :data="episodes" :items-to-show="4">
          <template #item="ep">
            <div class="card">
              <div class="card-image">
                <figure class="image">
                  <img
                    :src="cdnUrl + ep.field_thumbnail.uri.url"
                    :alt="serie.title + ep.title"
                  />
                </figure>
              </div>
              <div class="card-content">
                <h5 class="title is-5" style="color: black">
                  สปอยล์ {{ serie.title }} ตอนที่ {{ ep.title }}
                </h5>
                <p class="content" v-html="trunc_txt(ep.body.processed)"></p>
              </div>
            </div>
          </template>
        </b-carousel-list>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="card side-stick">
            <div class="card-image">
              <figure class="image">
                <img :src="cdnUrl + serie.field_poster[0].uri.url" :alt="serie.title" />
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <div v-html="serie.body.processed"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="box" v-for="(review, index) of reviews">
            <review-card :review="review" v-if="review.user.length > 0"></review-card>
          </div>
        </div>
        <div class="column">
          <div class="side-stick">
            <div class="box"><img src="https://picsum.photos/320/600" /></div>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-image">
          <figure class="image">
            <img :src="cdnUrl + ep_modal_thumbnail" alt="Image" />
          </figure>
        </div>
        <div class="card-content">
          <div class="content">
            <div v-html="ep_modal_txt"></div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { getSerieByPath, getEpisodesBySerie } from "~/assets/js/api";
import jsonapiParse from "jsonapi-parse";
import ReviewCard from "~/components/reviews/ReviewCard";

export default {
  components: { ReviewCard },
  data() {
    return {
      isAdmin: null,
      baseUrl: process.env.baseUrl,
      cdnUrl: process.env.cdnUrl,
      isCardModalActive: false,
      ep_modal_thumbnail: "",
      ep_modal_txt: "",
    };
  },
  methods: {
    checkUrl(url) {
      const link = url.split("://");
      if (link[0] !== "https") {
        return process.env.cdnUrl + url;
      } else {
        return url;
      }
    },
    trunc_txt(txt) {
      return txt.substring(0, 75) + "...";
    },
    openEP(index) {
      this.ep_modal_thumbnail = this.episodes[index].field_thumbnail.uri.url;
      this.ep_modal_txt = this.episodes[index].body.processed;
      this.isCardModalActive = true;
    },
  },
  mounted() {
    console.log("serie", this.serie);
  },
  async asyncData({ app, params, env }) {
    const uri = env.findRouterPath + "/series/" + params.title;
    const { data } = await app.$axios.post(
      env.apiUrl + "/subrequests?_format=json",
      [
        {
          requestId: "router",
          action: "view",
          uri: uri,
          headers: { Accept: "application/vnd.application+json" },
        },
        {
          requestId: "node",
          action: "view",
          uri:
            "/jsonapi/series/{{router.body@$.entity.uuid}}?include=field_poster,field_celeb,field_celeb.field_celeb_profile,field_series_type,field_serie_year,field_channel",
          Accept: "application/json",
          waitFor: ["router"],
        },
      ],
      { auth: { username: env.userDrupal, password: env.passDrupal } }
    );
    const serie = jsonapiParse.parse(JSON.parse(data["node#uri{0}"].body)).data;

    const url2 =
      env.apiUrl +
      "/" +
      env.prefix +
      "/episodes/?filter[field_series_episode.id]=" +
      serie.id +
      "&include=field_thumbnail,field_series_korea&sort=-nid";

    const data2 = await app.$axios.get(url2);
    const episodes = data2.data.data;
    const reviews = await app.$axios.$get(
      env.restMongoUrl + "/reviews/" + serie.drupal_internal__nid
    );
    //console.log('nid', '/vote/serie/result/' + serie.nid + '?_format=json')
    //let serieScore = await voteResult(serie.drupal_internal__nid);
    //if (serieScore.length > 1) {
    //  serieScore = serieScore[1].value[0].value;
    //} else {
    const serieScore = 0;
    //}
    console.log("reviews  ", reviews);
    return { serie, episodes, reviews };
  },
};
</script>
<style scoped>
.hero {
  background-image: linear-gradient(
    to right,
    rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px),
    rgba(31.5, 31.5, 31.5, 0.84) 30%,
    rgba(31.5, 31.5, 31.5, 0.84) 100%
  );
}
</style>
