<template>
  <q-form @submit="register" class="full-width">
    <q-input
      outlined
      class="q-mb-md"
      type="text"
      label="Character Code"
      v-model="characterCode"
      :rules="[required, validCode]"
    />
    <q-input
      outlined
      class="q-mb-md"
      type="email"
      label="Email"
      v-model="email"
      :rules="[required]"
    />
    <q-input
      outlined
      class="q-mb-md"
      type="password"
      label="Password"
      v-model="password"
      :rules="[required]"
    />
    <q-input
      outlined
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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
      characterCode: ref(),
    };
  },
  methods: {
    register() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCred) => {
          const character = this.characterStore.getCharacterFromCode(
            this.characterCode
          );
          if (character) {
            this.store.register(character.id, userCred.user.uid).then(() => {
              this.$router.push({ path: '/' });
            });
          }
        })
        .catch((error) => {
          const messages = {
            'auth/weak-password': 'Password is too weak',
            'auth/email-already-in-use': 'Email already in use',
          };

          const msg = messages[error.code] || error.message;
          this.$q.notify({ type: 'negative', message: msg });
        });
    },
    required(v) {
      return !!v || 'field required';
    },
    validCode(v) {
      return this.characterStore.checkCode(v) || 'Invalid code';
    },
    matchesPassword(v) {
      return this.password == v || 'Must match password';
    },
  },
});
</script>
