<template>
  <div v-for="message in messages" :key="message">
    <div class="text-h6 text-center text-bold q-mt-sm">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "SysMessage",
  props: {
    messages: [],
  },
};
</script>

<style lang="scss" scoped></style>
