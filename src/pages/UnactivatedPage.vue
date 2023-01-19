<script setup lang="ts"></script>

<style scoped lang="scss">
.card {
  background-color: rgb(0, 0, 0, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 3em 2em 3em;
  width: 100%;
  max-width: max-content;
  display: flex;
  flex-direction: column;
  gap: 1.3em;
}

.body {
  font-size: 1.5rem;
  line-height: 1.5;
}

.container {
  color: $white-warm;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}
</style>

<template>
  <div class="container">
    <div class="card">
      <div class="text-h3">Unactivated Account</div>
      <div class="body">Your account has not yet been actived by a GM.</div>
    </div>
  </div>
</template>
