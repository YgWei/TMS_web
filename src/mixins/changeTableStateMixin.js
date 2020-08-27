export default {
  methods: {
    changeState(datas, uuid, state) {
      const index = datas.findIndex(item => item.uuid === uuid);
      datas[index].state = this.$t(state);
    }
  }
};
