const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean).reduce((acc, line) => {
  const idx = line.indexOf('=');
  if (idx > -1) {
    acc[line.slice(0, idx)] = line.slice(idx + 1);
  }
  return acc;
}, {});
const baseUrl = env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
(async () => {
  try {
    console.log('baseUrl', baseUrl);
    const publishableKey = env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    if (!baseUrl || !publishableKey) {
      throw new Error('Missing NEXT_PUBLIC_MEDUSA_BACKEND_URL or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY in .env.local');
    }

    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-publishable-api-key': publishableKey,
    };

    const regionsRes = await fetch(`${baseUrl}/store/regions`, { headers });
    const regionsJson = await regionsRes.json();
    console.log('regions status', regionsRes.status, regionsRes.statusText);
    console.log('regions', JSON.stringify(regionsJson, null, 2));

    const inrRegion = regionsJson.regions?.find((region) => region.currency_code?.toLowerCase() === 'inr');
    const regionId = inrRegion?.id ?? regionsJson.regions?.[0]?.id;
    console.log('selected region id', regionId);
    console.log('inrRegion id', inrRegion?.id);

    const productsRes = await fetch(`${baseUrl}/store/products?limit=1`, { headers });
    const productsJson = await productsRes.json();
    console.log('products status', productsRes.status, productsRes.statusText);
    console.log('products', JSON.stringify(productsJson, null, 2));

    const product = productsJson.products?.[0];
    const variant = product?.variants?.[0];
    console.log('product id', product?.id);
    console.log('variant id', variant?.id);
    console.log('variant inventory_quantity', variant?.inventory_quantity);

    const productDetailsRes = await fetch(`${baseUrl}/store/products/${product?.id}`, { headers });
    const productDetailsJson = await productDetailsRes.json();
    console.log('product details status', productDetailsRes.status, productDetailsRes.statusText);
    console.log('product details', JSON.stringify(productDetailsJson, null, 2));

    const cartCreateRes = await fetch(`${baseUrl}/store/carts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ region_id: regionId }),
    });
    const cartCreateJson = await cartCreateRes.json();
    const cartId = cartCreateJson.cart?.id;
    console.log('cartId', cartId);
    console.log('cart create body', JSON.stringify(cartCreateJson, null, 2));

    async function addLineItem(body) {
      const res = await fetch(`${baseUrl}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const json = await res.json();
      return { res, json };
    }

    const addResult = await addLineItem({ variant_id: variant.id, quantity: 1 });
    const addJson = addResult.json;
    console.log('ADD status', addResult.res.status, addResult.res.statusText);
    console.log('ADD cart id', addJson.cart?.id);
    console.log('ADD items count', addJson.cart?.items?.length);
    console.log('ADD first item', JSON.stringify(addJson.cart?.items?.[0], null, 2));

    const lineItemId = addJson.cart?.items?.[0]?.id;
    console.log('added lineItemId', lineItemId);

    if (lineItemId) {
      const updateRes = await fetch(`${baseUrl}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ quantity: 2 }),
      });
      const updateJson = await updateRes.json();
      console.log('UPDATE status', updateRes.status, updateRes.statusText);
      console.log('UPDATE payload', JSON.stringify(updateJson, null, 2));

      const deleteRes = await fetch(`${baseUrl}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'DELETE',
        headers,
      });
      const deleteJson = await deleteRes.json();
      console.log('DELETE status', deleteRes.status, deleteRes.statusText);
      console.log('DELETE payload', JSON.stringify(deleteJson, null, 2));
    }

    const retrieveRes = await fetch(`${baseUrl}/store/carts/${cartId}`, { headers });
    const retrieveJson = await retrieveRes.json();
    console.log('RETRIEVE status', retrieveRes.status, retrieveRes.statusText);
    console.log('RETRIEVE cart id', retrieveJson.cart?.id);
    console.log('RETRIEVE items count', retrieveJson.cart?.items?.length);
    console.log('RETRIEVE first item', JSON.stringify(retrieveJson.cart?.items?.[0], null, 2));
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();