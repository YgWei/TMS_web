<template>
  <div>
    <img src="@/assets/login.png" class="img" />
    <div class="div">
      <h1>{{ this.$t("login") }}</h1>
      <div class="loginDiv">
        <p>{{ this.$t("account") }}</p>
        <v-text-field dense v-model="account"></v-text-field>
      </div>
      <div class="loginDiv">
        <p>{{ this.$t("password") }}</p>
        <v-text-field
          dense
          v-model="password"
          :type="'password'"
        ></v-text-field>
      </div>
      <v-btn depressed rounded color="#4A90E2" @click="login">
        <h3 style="color:white">{{ this.$t("login") }}</h3>
      </v-btn>

      <v-btn depressed color="#E6F3FF" rounded @click="gitlabLogin">
        <img src="@/assets/gitlab.svg" class="btnImage" />
        <h3 style="color: #8e8e93">{{ this.$t("gitlabLogin") }}</h3>
      </v-btn>
    </div>
    <v-snackbar v-model="snackbar" top :color="color">
      {{ $t(loginText) }}
      <v-btn text @click="snackbar = false" class="snackbarBtn">{{
        $t("determine")
      }}</v-btn>
    </v-snackbar>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { login } from "@/api";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      overlay: false,
      account: "",
      password: "",
      snackbar: false,
      loginText: "",
      color: ""
    };
  },
  computed: {
    // ...mapGetters({ roles: "getRoles" })
  },
  methods: {
    ...mapActions(["Login"]),
    async login() {
      await this.Login({
        account: this.account,
        password: this.password
      })
        .then(res => {
          this.snackbar = true;
          this.loginText = "loginSuccess";
          this.color = "rgb(33, 150, 243)";
          localStorage.setItem("token", res.data.data.jwt);
          this.$router.push("/deploymentmanage");
        })
        .catch(() => {
          this.loginText = "loginError";
          this.snackbar = true;
          this.color = "#e60000";
        });
    },
    async gitlabLogin() {
      if (!this.$route.query.code) {
        window.open(
          `${process.env.VUE_APP_GITLAB_URL}&${process.env.VUE_APP_GITLAB_REDIRECT}=${process.env.VUE_APP_GITLAB_REDIRECT_PROTOCOL}://${process.env.VUE_APP_GITLAB_REDIRECT_HOTS}:${process.env.VUE_APP_GITLAB_REDIRECT_PORT}/login&${process.env.VUE_APP_GITLAB_GITLAB_CODE}=code`,
          "_self"
        );
      } else {
        const params = {
          code: this.$route.query.code,
          mode: `${process.env.VUE_APP_GITLAB_GITLAB_MODE}`
        };
        await login
          .gitlabLogin(params)
          .then(res => {
            localStorage.setItem("token", res.data.data.jwt);
            this.$router.push("/deploymentmanage");
          })
          .catch(() => {
            this.snackbar = true;
            this.loginText = "restart";
            this.color = "#e60000";
            this.overlay = false;
          });
      }
    }
  },
  async mounted() {
    if (this.$route.query.code) {
      this.overlay = true;
      await this.gitlabLogin();
    }
    // if (localStorage.token) {
    //   await this.userInfo();
    // }
  }
};
</script>
>
<style lang="scss" scoped>
.theme--light.v-text-field {
  border-color: #4a90e2 !important;
}
.img {
  max-width: 100%;
  height: 100%;
  position: fixed;
}
.div {
  color: grey;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 20%;
  right: 20%;
}
h1 {
  text-align: center;
  font-size: 40px;
  padding-bottom: 30px;
  font-weight: 500;
}
.loginDiv {
  width: 300px;
  align-self: center;
}
p {
  margin: 0px 0px;
  font-size: 12px;
  color: #4a90e2;
}
button {
  width: 300px;
  align-self: center;
  margin-bottom: 10px;
}
.btnImage {
  height: 25px;
  width: 25px;
  position: absolute;
  left: 30px;
}
h3 {
  text-transform: lowercase;
  font-weight: 400;
}
.snackbarBtn {
  margin: 0px;
}
@media screen and (min-width: 1300px) {
  .div {
    color: grey;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 30%;
    right: 30%;
  }
}
</style>
