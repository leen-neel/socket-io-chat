<template>
  <q-chat-message
    v-if="!isSys"
    :name="message.name"
    :text="[message.message]"
    text-color="white"
    bg-color="primary"
    :avatar="message.avatar"
    :sent="socketID == message.id"
  />

  <div v-if="isSys" class="text-h6 text-center text-bold">
    {{ message.message }}
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
    isSys: Boolean,
    socketID: String,
  },
};
</script>

<style lang="scss" scoped></style>
