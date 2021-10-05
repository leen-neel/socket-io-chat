<template>
  <q-page class="q-pa-md">
    <q-input
      v-if="!isJoined"
      v-model="name"
      type="text"
      placeholder="Enter your name"
      filled
    >
      <template v-slot:append>
        <q-btn color="primary" icon="login" label="Join" @click="joinChat" />
      </template>
    </q-input>

    <div v-if="isJoined">
      <div class="text-h6 text-center text-bold">
        You joined the chat as {{ name }}
      </div>

      <SysMessage :messages="sysMessages" />

      <div v-for="message in messages" :key="message.name">
        <q-chat-message
          :name="message.name"
          :text="[message.message]"
          text-color="white"
          bg-color="primary"
          :avatar="message.avatar"
          :sent="socket.id == message.id"
        />
      </div>

      <!-- This form is meant for sending message -->
      <q-footer elevated>
        <q-toolbar>
          <q-form class="full-width" @submit.prevent="sendMessage">
            <q-input
              placeholder="Type a message"
              text-color="black"
              standout="bg-primary text-white"
              v-model="messageContent"
              outlined
              dense
              autofocus
            >
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  color="white"
                  icon="send"
                  @click="sendMessage"
                />
              </template>
            </q-input>
          </q-form>
        </q-toolbar>
      </q-footer>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, unref } from "vue";
import { socket } from "boot/socket";

import SysMessage from "components/SysMessage";
export default defineComponent({
  components: {
    SysMessage,
  },

  setup() {
    const name = ref("");
    const avatar = ref("");
    const isJoined = ref(false);

    const sysMessages = ref([]);

    const messageContent = ref("");
    const messages = ref([]);

    const joinChat = () => {
      let userName = unref(name);
      socket.auth = { userName };
      socket.connect();

      isJoined.value = true;
      avatar.value = `https://avatars.dicebear.com/api/croodles-neutral/${unref(
        name
      )}.svg?background=%23ffffff`;
    };

    socket.on("user-joined", (message) => {
      messages.value.push();
    });

    socket.on("user-left", (message) => {
      sysMessages.value.push(message);
    });

    const sendMessage = () => {
      let message = {
        name: name.value,
        message: messageContent.value,
        avatar: avatar.value,
        id: socket.id,
      };
      socket.emit("send-message", message);
      messages.value.push(message);
      messageContent.value = "";
    };

    socket.on("recieve-message", (message) => {
      messages.value.push(message);
    });

    return {
      name,
      joinChat,
      isJoined,
      sysMessages,
      sendMessage,
      messageContent,
      messages,
      avatar,
      socket,
    };
  },
});
</script>
