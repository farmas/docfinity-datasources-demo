/* eslint-disable prettier/prettier */
console.log('hello from js');

axios.get('/api/datasources')
  .then(function (response) {
    console.log(response.data);
  });