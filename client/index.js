/* eslint-disable prettier/prettier */
const { createApp } = Vue;
const diffConfiguration = { drawFileList: false, matching: 'lines', fileListToggle: false, fileContentToggle: false };

createApp({
  data() {
    return {
      datasources: [],
      selectedDatasource: null
    }
  },
  methods: {
    downloadSelectedDatasource() {
      const datasource = this.selectedDatasource;
      console.log(`Downloading ${datasource.local.name}`);
      axios.post('/api/datasources/download', { name: datasource.local.name }).then(response => {
        console.log('Downloaded:', response.data);
        this.selectedDatasource = response.data;
        const index = this.datasources.findIndex(d => d.local.name === this.selectedDatasource.local.name);
        this.datasources.splice(index, 1, this.selectedDatasource);
      });
    },
    selectDatasource(datasource) {
      console.log(`Selected ${datasource.local.name}`, datasource);
      this.selectedDatasource = datasource;
      
      if (datasource.diff) {
        const targetElement = document.getElementById('codeElement');
        console.log('Render diff');
        const diff2htmlUi = new Diff2HtmlUI(targetElement, datasource.diff, diffConfiguration);
        diff2htmlUi.draw();
      }
    },
    compare() {
      this.selectedDatasource = null;
      this.datasources.forEach(e => e.remote = e.diff = null );

      axios.post('/api/datasources/compare').then(response => {
        console.log('compare response:', response.data);
        this.datasources = response.data;
      });
    }
  },
  mounted () {
    axios.get('/api/datasources').then(response => {
      console.log('load response:', response.data);
      this.datasources = response.data;
    });
  }
}).mount('#app')

