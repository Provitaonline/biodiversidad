<template>
  <div>
    <b-navbar :fixed-top="true">
      <template slot="brand">
        <b-navbar-item class="logo" style="background-color: white;">
          <g-link style="margin: auto; max-height: 64px;" to="/">
            <g-image style="max-height: 64px;" src="~/assets/svgs/logo.svg" alt="Logo" />
          </g-link>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-dropdown>
          <template slot="label">
            {{ $t('label.gbif') }}
          </template>
          <b-navbar-item style="color: #363636;" tag="g-link" :to="$tp('/about')">
            {{ $t('label.about') }}
          </b-navbar-item>
        </b-navbar-dropdown>
        <b-navbar-item tag="g-link" :to="$tp('/about')">
          {{ $t('label.about') }}
        </b-navbar-item>
        <b-navbar-dropdown v-if="!is404Page" arrowless right>
          <template slot="label">
            {{ $t('flag') }}
          </template>
          <b-navbar-item v-for="locale in availableLocales" :key="locale" tag="div" @click.capture="changeLocale(locale)">
            <g-link :to="localeLink(locale)">{{ $t('flag', locale) }}&nbsp;&nbsp;&nbsp;{{ $t('language', locale) }}</g-link>
          </b-navbar-item>
        </b-navbar-dropdown>
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

  .logo {
    padding-top: 0px;
    padding-bottom: 0px;
    height: 4rem;
    width: 265px;
  }

  @media only screen and (max-width: 375px) {
    .logo {
      width: 265px;
    }
  }

  .logo:hover {
    background-color: #F5F5F5 !important;
  }

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

  .navbar-link:not(.is-arrowless)::after {
    border-color: white;
  }

</style>

<script>

  export default {
    data() {
      return {
        availableLocales: this.$i18n.availableLocales,
        is404Page: this.$route.name === '*'
      }
    },
    methods: {
      localeLink: function (locale) {
        return this.$tp(this.$route.path, locale, true)
      },
      changeLocale: function (locale) {
        if (this.$i18n.locale.toString() != locale) {
          // We will do this later to notify components like the map to switch languages
          //this.$eventBus.$emit('localechanged', locale)
        }
      }
    }
  }

</script>
