<template>
  <content-layout infoTitle="asdfasf">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
        </template>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card>
      </v-dialog>
    </v-row>
    <template v-slot:actions>
      <v-btn tile color="teal" icon>
        <v-icon>mdi-vuetify</v-icon>
      </v-btn>
    </template>
    <template v-slot:info>
      <h1>Info</h1>
    </template>
  </content-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    };
  }
};
</script>
