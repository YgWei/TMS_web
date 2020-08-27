export default {
  methods: {
    showSnackbar(snackbarName, snackbarColor) {
      this.snackbarColor = snackbarColor;
      this.snackbarName = this.$t(snackbarName);
      this.snackbar = true;
    }
  }
};
