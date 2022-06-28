<template>
  <div class="content">
    <ul style="list-style-type: none;">
      <TreeNode :node="treeData[Object.keys(treeData)[0]]" :nodeLabel="Object.keys(treeData)[0]" :isHidden="false" :level="0" :path="[Object.keys(treeData)[0]]" />
    </ul>
  </div>
</template>

<style lang="scss" scoped>


</style>


<script>

import TreeNode from '~/components/TreeNode.vue'

export default {
  name: 'Tree',
  props: {
    treeData: { type: Object, required: true }
  },
  data() {
    return {
    }
  },
  components: {
    TreeNode
  }
}

</script>
