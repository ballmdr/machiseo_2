<template>
  <div class="columns">
    <aside class="column">
      <div class="card side-stick">
        <div class="card-image">
          <figure class="image">
            <img :src="cdnUrl + serie.field_poster[0].uri.url" alt="Placeholder image" />
          </figure>
        </div>
        <div class="card-content">
          <div class="content">
            <div v-html="serie.body.processed"></div>
          </div>
        </div>
        <b-image
          src="https://picsum.photos/600/400"
          alt="A random image"
          ratio="6by4"
          rounded="rounded"
        ></b-image>
      </div>
    </aside>
    <div class="column is-half">
      <div
        class="card"
        v-for="(ep, index) of episodes"
        style="margin-top: 20px"
        @click="openEP(index)"
      >
        <div class="card-image">
          <figure class="image">
            <img :src="cdnUrl + ep.field_thumbnail.uri.url" alt="Image" />
          </figure>
          <div class="card-content">
            <h4 class="subtitle tag is-primary">
              สปอยล์ {{ serie.title }} ตอนที่ {{ ep.title }}
            </h4>
            <p class="content" v-html="trunc_txt(ep.body.processed)"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="column">
      <div class="box side-stick">
        <b-image
          src="https://picsum.photos/600/400"
          alt="A random image"
          ratio="6by4"
          :rounded="rounded"
        ></b-image>
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

export default {
  components: {},
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
      console.log(url);
      const link = url.split("://");
      if (link[0] !== "https") {
        return process.env.cdnUrl + url;
      } else {
        return url;
      }
    },
    trunc_txt(txt) {
      console.log(txt);
      return txt.substring(0, 100) + "...";
    },
    openEP(index) {
      this.ep_modal_thumbnail = this.episodes[index].field_thumbnail.uri.url;
      this.ep_modal_txt = this.episodes[index].body.processed;
      this.isCardModalActive = true;
    },
  },
  mounted() {
    //onsole.log(this.episodes)
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

    //console.log(url2);
    const data2 = await app.$axios.get(url2);
    const episodes = data2.data.data;
    //console.log(episodes);

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
    return { serie, episodes };
  },
};
</script>
<style scoped>
.logo_subthai {
  max-width: 75px !important;
}

.u-clearfix:before,
.u-clearfix:after {
  content: " ";
  display: table;
}

.u-clearfix:after {
  clear: both;
}

.u-clearfix {
  *zoom: 1;
}

.container {
  margin: auto;
  width: 100%;
}

.card-media {
  padding: 0 0 25px 25px;
  width: 300px;
}

.card-media-img {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  margin-top: 50px;
  width: 100%;
  border-radius: 12px;
  margin-left: 10px;
}
</style>
