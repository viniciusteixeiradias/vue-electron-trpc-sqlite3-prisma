<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useTRPCProxyClient } from './hooks/trpc-proxy-client'

const info = computed(() => 
  `This app is using Chrome (v${window.appApi.chrome()}), Node.js (v${window.appApi.node()}), and Electron (v${window.appApi.electron()})`
)

const users = ref('');

const { trpc } = useTRPCProxyClient();

const loadUsers = async () => {
  const user = await trpc.users.query();
  const userId1 = await trpc.userById.query(1);
  users.value = JSON.stringify(user, null, 2);
}

loadUsers();

const addUser = async () => {
  const user = await trpc.userCreate.mutate({
    name: 'New User',
    dateCreated: new Date()
  });
  users.value = JSON.stringify(user, null, 2);
}
</script>

<template>
  {{ info }} <br>
  <button type="button" @click="addUser">Create user</button>
  <button type="button" @click="loadUsers">Load all</button> <br>
  {{ users }}
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
