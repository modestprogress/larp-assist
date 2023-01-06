<script setup lang="ts">
// Vue
import { ref } from 'vue';

// Ours
import RegistrationForm from 'components/common/RegistrationForm.vue';
import LoginForm from 'components/common/LoginForm.vue';
import SimpleCard from 'components/common/SimpleCard.vue';

const tab = ref(true);
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  color: $white-warm;
  padding: 2rem 1rem 0rem 1rem;
  align-items: center;
}

.navbar {
  color: $white-warm;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  font-size: 1.2rem;

  .tab {
    text-decoration: none;
    color: $white-warm;
  }

  .tab.active {
    font-weight: 600;
  }

  .tab:not(.active) {
    font-weight: 200;
  }
}

.content {
  max-width: 768px;
  margin: auto;
}
</style>

<template>
  <div class="container">
    <div class="text-h2 text-wizard text-center">LARP Assist</div>
    <div class="navbar">
      <a href="#" :class="{ active: tab }" class="tab" @click="tab = true"
        >Login</a
      >
      <a href="#" :class="{ active: !tab }" class="tab" @click="tab = false"
        >Register</a
      >
    </div>
    <LoginForm v-if="tab" class="content" />
    <RegistrationForm v-else class="content" />
  </div>
</template>
