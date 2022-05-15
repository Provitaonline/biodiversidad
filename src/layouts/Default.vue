<template>
  <div>
    <b-navbar :fixed-top="true">
      <template slot="brand">
        <b-navbar-item style="background-color: #c8c19f;" class="has-text-centered">
          <g-link to="/">
            <b>PROTOTIPO<br>GBIF</b>
          </g-link>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="g-link" to="/about">
          Acerca De
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <slot name="banner" />
        </div>
      </div>
    </section>
    <transition name="fade" appear>
      <section class="layout">
        <slot />
      </section>
    </transition>
    <section>
      <footer class="footer">
        <div class="has-text-centered">
          <div class="footer-text" style="color: white;">
          Este sitio es solamente un prototipo. v0.0.4.
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>

<static-query>


</static-query>

<style lang="scss" scoped>

  @import "~/assets/style/_variables";

  .hero {
    background-color: rgba(85,107,47, 0.1)
  }

  .hero-body {
    margin: auto;
  }

  .layout {
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }

</style>
