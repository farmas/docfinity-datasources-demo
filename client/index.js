/* eslint-disable prettier/prettier */
const { createApp } = Vue;

createApp({
  data() {
    return {
      datasources: [],
      selectedDatasource: null,
      message: null
    }
  },
  methods: {
    selectDatasource(datasource) {
      console.log('Selected', datasource.definition.name);
      this.selectedDatasource = datasource;
    }
  },
  mounted () {
    axios.get('/api/datasources').then(response => {
      console.log(response.data);
      globalDatasources = response.data.slice(0);
      this.datasources = response.data;
    });
  }
}).mount('#app')

