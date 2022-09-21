/* eslint-disable prettier/prettier */
const { createApp } = Vue;

createApp({
  data() {
    return {
      datasources: [],
    }
  },
  mounted () {
    axios.get('/api/datasources').then(response => {
      this.datasources = response.data;
      console.log(this.datasources);
    });
  }
}).mount('#app')

