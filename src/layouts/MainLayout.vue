<template>
  <q-layout class="bg" view="lHh lpr lFf">
    <q-page-container>
      <q-page class="page q-py-md q-mx-auto">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
$clr-bg: hsl(359, 100%, 13%);
$clr-form-text: hsl(44, 70%, 89%);
$clr-dark: #111;
$clr-trim: #d3a625;
$clr-button: #222f5b;
$clr-slytherin: #1a472a;

.bg {
  background: linear-gradient(0deg, $clr-bg, $clr-dark);
}
</style>
