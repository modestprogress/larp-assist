<template>
  <q-form @submit="register" class="full-width">
    <q-input
      outlined
      dark
      class="q-mb-md"
      type="text"
      label="Name"
      v-model="name"
      :rules="[required, validName]"
    />
    <q-input
      outlined
      dark
      class="q-mb-md"
      type="email"
      label="Email"
      v-model="email"
      :rules="[required]"
    />
    <q-input
      outlined
      dark
      class="q-mb-md"
      type="password"
      label="Password"
      v-model="password"
      :rules="[required]"
    />
    <q-input
      outlined
      dark
      class="q-mb-md"
      type="password"
      label="Confirm Password"
      v-model="confirmPassword"
      :rules="[required, matchesPassword]"
    />
    <div class="row">
      <q-space />
      <q-btn type="submit" color="primary">Register</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts">
import { ref } from 'vue';
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { defineComponent } from 'vue';
import { useUserStore } from 'stores/user';
import { useCharactersStore } from 'stores/characters';

export default defineComponent({
  setup() {
    return {
      store: useUserStore(),
    };
  },
  data() {
    const characterStore = useCharactersStore();
    characterStore.refresh();

    return {
      characterStore: characterStore,
      email: ref(),
      password: ref(),
      confirmPassword: ref(),
      name: ref(),
    };
  },
  methods: {
    async register() {
      const auth = getAuth();

      let userCred: UserCredential;
      try {
        userCred = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
      } catch (error) {
        const messages = {
          'auth/weak-password': 'Password is too weak',
          'auth/email-already-in-use': 'Email already in use',
        };

        const msg = messages[error.code] || error.message;
        this.$q.notify({ type: 'negative', message: msg });

        return;
      }

      await this.store.login(userCred.user.uid);

      await this.store.update({
        name: this.name,
      });

      this.$router.push('/');
    },
    required(v: string) {
      return !!v || 'field required';
    },
    validName() {
      return true;
    },
    matchesPassword(v: string) {
      return this.password == v || 'Must match password';
    },
  },
});
</script>
