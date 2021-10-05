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

      <div v-for="message in messages" :key="message.name">
        <ChatMessages
          :message="message"
          :isSys="message.isSys"
          :socketID="socket.id"
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

import ChatMessages from "components/ChatMessages.vue";
export default defineComponent({
  components: {
    ChatMessages,
  },

  setup() {
    const name = ref("");
    const avatar = ref("");
    const isJoined = ref(false);

    const messageContent = ref("");
    const messages = ref([]);

    const joinChat = () => {
      let userName = unref(name);

      socket.auth = { userName };
      socket.connect();

      avatar.value = `https://avatars.dicebear.com/api/croodles-neutral/${unref(
        name
      )}.svg?background=%23ffffff`;
      isJoined.value = true;
    };

    // user join and leave events
    socket.on("user-joined", (message) => {
      messages.value.push({
        message: message,
        isSys: true,
      });
    });

    socket.on("user-left", (message) => {
      messages.value.push({
        message: message,
        isSys: true,
      });
    });

    // Send message to the chat
    const sendMessage = () => {
      let message = {
        name: name.value,
        message: messageContent.value,
        avatar: avatar.value,
        id: socket.id,
        isSys: false,
      };
      socket.emit("send-message", message);
      messages.value.push(message);
      messageContent.value = "";
      window.scrollTo(0, document.body.scrollHeight);
    };

    // Message recieve event
    socket.on("recieve-message", (message) => {
      messages.value.push(message);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return {
      name,
      joinChat,
      isJoined,
      sendMessage,
      messageContent,
      messages,
      avatar,
      socket,
    };
  },
});
</script>
