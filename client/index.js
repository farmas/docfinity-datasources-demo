/* eslint-disable prettier/prettier */
const { createApp } = Vue;

createApp({
  data() {
    return {
      datasources: [],
    }
  },
  methods: {
    foo(event) {
      console.log('clicked');
    }
  },
  mounted () {
    axios.get('/api/datasources').then(response => {
      this.datasources = response.data;
      console.log(this.datasources);
    });
  }
}).mount('#app')

