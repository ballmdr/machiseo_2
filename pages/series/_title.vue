<template>
  <div>
    <div class="hero is-medium is-info">
      <div class="container is-fullhd">
        <div class="hero-body" style="padding-bottom: 10px !important">
          <div class="columns">
            <div class="column is-one-third">
              <b-image
                class="poster"
                :src="cdnUrl + serie.field_poster[0].uri.url"
                :alt="serie.title"
              ></b-image>
            </div>
            <div class="column">
              <h1 class="title">{{ serie.title }}</h1>
              <p class="block">{{ serie.field_synopsis }}</p>
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
            </div>
          </div>
          <hr />
          <div style="margin-bottom: 50px; text-align: center">
            <h2 class="subtitle">นักแสดงนำ {{ serie.title }}</h2>
          </div>
          <div class="columns is-multiline is-centered">
            <div
              class="block column is-full-mobile is-half-tablet id-one-thirds-desktop is-one-quarter-fullhd"
              v-for="(celeb, index) in serie.field_celeb"
            >
              <div class="card">
                <div class="card-image">
                  <div class="media">
                    <div class="media-left">
                      <b-image
                        :src="cdnUrl + celeb.field_celeb_profile.uri.url"
                        class="is-128x128"
                        ratio="1by1"
                      ></b-image>
                    </div>
                    <div class="media-content">
                      <div class="content" style="padding-top: 18px; text-align: center">
                        <p
                          class="subtitle"
                          style="color: black !important; margin-top: 10px !important"
                          v-html="CelebTitle(celeb.title)"
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div>
        <div style="text-align: center; margin-bottom: 50px">
          <h2 class="subtitle">สปอยล์ {{ serie.title }} ทุกตอน</h2>
        </div>
        <b-carousel-list :data="episodes" v-bind="al">
          <template #item="ep">
            <div class="card" style="max-height: 400px; overflow: hidden">
              <div class="card-image">
                <figure class="image" @click="openEP(ep.index)">
                  <img
                    :src="cdnUrl + ep.field_thumbnail.uri.url"
                    :alt="serie.title + ep.title"
                  />
                </figure>
              </div>
              <div class="card-content">
                <h5 class="title is-5" style="color: black">ตอนที่ {{ ep.title }}</h5>
                <p
                  class="content"
                  style="margin-top: -20px !important"
                  v-html="trunc_txt(ep.body.processed)"
                ></p>
              </div>
            </div>
          </template>
        </b-carousel-list>
      </div>
    </div>
    <div class="container" style="margin-top: 20px">
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
          <h2 class="subtitle is-4" style="text-align: center">
            รีวิวซีรีส์ {{ serie.title }}
          </h2>
          <reviews :reviews="reviews"></reviews>
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
          <div class="media-content">
            <p class="title is-4">{{ serie.title }} ตอนที่ {{ ep_title }}</p>
          </div>
          <div class="content" style="padding-top: 15px">
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
import Reviews from "~/components/reviews/Reviews";

export default {
  components: { Reviews },
  data() {
    return {
      isAdmin: null,
      baseUrl: process.env.baseUrl,
      cdnUrl: process.env.cdnUrl,
      isCardModalActive: false,
      ep_modal_thumbnail: "",
      ep_modal_txt: "",
      ep_title: "",
      al: {
        breakpoints: {
          320: {
            itemsToShow: 2,
          },
          768: {
            itemsToShow: 4,
          },
          960: {
            itemsToShow: 6,
          },
        },
      },
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
    CelebTitle(txt) {
      const tmp = txt.split("(");
      return tmp[0] + "<br/>(" + tmp[1];
    },
    trunc_txt(txt) {
      return txt.substring(0, 85) + "...";
    },
    openEP(index) {
      this.ep_modal_thumbnail = this.episodes[index].field_thumbnail.uri.url;
      this.ep_modal_txt = this.episodes[index].body.processed;
      this.isCardModalActive = true;
      this.ep_title = this.episodes[index].title;
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
  background-image: linear-gradient(180deg, #14181c, #14181c, #2c3440);
}
.stream_icon {
  max-width: 70px !important;
}

.poster {
  margin: auto;
  border: 0.05rem solid;
  max-width: 250px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgba(221, 238, 255, 0.35);
  box-sizing: border-box;
}
</style>
