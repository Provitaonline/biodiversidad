<template>
  <li v-show="!isHidden">
    <a @click="toggle()" v-if="!isLast(node)">
      <font-awesome size="lg" :icon="['fas', hideNext ? 'caret-right' : 'caret-down']"/>
    </a>
    <a :href="'https://especiesamenazadas.org' + link" :target="newTabLinks ? '_blank' :'_self'" v-if="!isLast(node)">
      {{nodeLabel}}
    </a>
    <a v-else :href="'https://especiesamenazadas.org' + link" :target="newTabLinks ? '_blank' :'_self'">
      <b>{{nodeLabel}} ({{node.risk}})</b><br>
    </a>
    <ul style="list-style-type: none;" v-if="!isLast(node)">
      <TreeNode v-for="k in Object.keys(node)" :node="node[k]" :nodeLabel="k" :key="k" :isHidden="hideNext" :level="level + 1" :path="newPath(k)" :newTabLinks="newTabLinks"></TreeNode>
    </ul>
  </li>
</template>

<style lang="scss" scoped>


</style>


<script>
export default {
  name: 'TreeNode',
  props: {
    node: { type: Object, required: true },
    nodeLabel: { type: String },
    isHidden: {type: Boolean},
    level: {type: Number },
    path: {type: Array},
    newTabLinks: {type: Boolean}
  },
  data() {
    return {
      hideNext: this.level > 2,
      link: ''
    }
  },
  created() {
    if (this.level > 0) {
      this.link = this.path.slice(1, -1).join('/').toLowerCase()
      if (this.isLast(this.node)) {
        this.link += '/' + this.node.jsonFile.split('.')[0]
      } else {
        this.link += '/' + this.nodeLabel.toLowerCase().replace(' ', '-')
      }

      this.link = (this.link.charAt(0) === '/' ? '' : '/') + this.link
      this.link = '/taxon' + this.link + '/'
    }
  },
  methods: {
    isLast(n) {
      if (typeof n[Object.keys(n)[0]] !== 'object') return true
      return false
    },
    toggle() {
      this.hideNext = !this.hideNext
    },
    newPath(k) {
      let p = [...this.path]
      p.push(k)
      return p
    }
  },
  components: {
  }
}

</script>
