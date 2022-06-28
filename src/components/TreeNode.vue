<template>
  <li v-show="!isHidden">
    <a @click="toggle()" v-if="!isLast(node)">
      <font-awesome :icon="['fas', hideNext ? 'caret-right' : 'caret-down']"/>
    </a>
    <a @click="toggle()" v-if="!isLast(node)">
      {{nodeLabel}}
    </a>
    <a v-else :href="'https://especiesamenazadas.org' + node.link">
      <b>{{nodeLabel}} ({{node.risk}})</b>
    </a>
    <ul style="list-style-type: none;" v-if="!isLast(node)">
      <TreeNode v-for="k in Object.keys(node)" :node="node[k]" :nodeLabel="k" :key="k" :isHidden="hideNext" :level="level + 1"></TreeNode>
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
    level: {type: Number }
  },
  data() {
    return {
      hideNext: this.level > 2,
    }
  },
  created() {
  },
  methods: {
    isLast(n) {
      if (typeof n[Object.keys(n)[0]] !== 'object') return true
      return false
    },
    toggle() {
      this.hideNext = !this.hideNext
    }
  },
  components: {
  }
}

</script>
