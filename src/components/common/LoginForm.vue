<template>
  <q-form @submit="signIn" class="full-width">
    <q-input
        outlined
        class="q-mb-md"
        type="email"
        label="Email"
        v-model="email"
        :rules="[required]"/>
    <q-input
        outlined
        class="q-mb-md"
        type="password"
        label="Password"
        v-model="password"
        :rules="[required]"/>
    <div class="row">
      <q-space />
        <q-btn type="submit" color="primary">Login</q-btn>
    </div>
  </q-form>
</template>

<script>
// Vue
import { ref } from 'vue'

// Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';

// Ours
import { useUserStore } from 'src/stores/user'

export default {
  name: 'AuthComponent',

  data () {
    return {
      email: ref(''),
      password: ref('')
    }
  },

  methods: {
    required (val) {
      return !!val || 'Field is required'
    },

    signIn() {
      signInWithEmailAndPassword(this.$auth, this.email, this.password).then(userCred => {
        useUserStore().login(userCred.user.uid).then(() => {
          this.$router.push({path: '/'})
        })
      })
      .catch(error => {
        const messages = {
          'auth/user-not-found': 'User not found.',
          'auth/invalid-email': 'Invalid email address.',
          'auth/invalid-password': 'Invalid password.',
          'auth/wrong-password': 'Wrong password.',
        }

        const code = error.code;
        const msg = messages[code] || 'Unknown error code: ' + code
        this.$q.notify({type: 'negative', message: msg});
      })
    },
  }
}
</script>
