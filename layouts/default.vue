<template>
  <div>
    <b-navbar
      class="navbar header has-shadow is-primary"
      fixed-top
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </a>
        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
    </b-navbar>

    <section>
      <nuxt />
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "Home", icon: "home", to: { name: "index" } },
        { title: "Inspire", icon: "lightbulb", to: { name: "inspire" } },
      ],
    };
  },
};
</script>

<style>
.side-stick {
  position: sticky;
  top: 50px;
}
body {
  background-color: #f5f5f7;
}
</style>
