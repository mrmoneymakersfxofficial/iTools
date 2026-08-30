const token = 'd8da7565d32dd2cbe70f6b53ff0fbd52a53b3d36';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // bypass SSL issues just to test
fetch('https://api.bsale.io/v1/offices.json', {
  headers: { 'access_token': token }
}).then(r => r.json()).then(data => {
  console.log('Offices:', data.count);
}).catch(console.error);

fetch('https://api.bsale.io/v1/products/count.json', {
  headers: { 'access_token': token }
}).then(r => r.json()).then(data => {
  console.log('Products:', data.count);
}).catch(console.error);
