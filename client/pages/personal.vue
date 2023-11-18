<script setup lang="ts">
const accessToken: string = await useAuthToken();

interface Product {
    id: number;
    created_at: string;
    product_name: string;
}

let { data: products } = useFetch<Product[]>('http://127.0.0.1:8000/products');

const nickname = ref('');
const product = ref('');

// this is how queries must be made, I will abstract them later on
const sendNickName = () => {
    const { data, error } = useFetch('http://127.0.0.1:8000/setNickname', {
        method: 'put',
        headers: {
            Authorization: `token: ${accessToken}`,
        },
        body: {
            uid: useSupabaseUser().value?.id,
            username: nickname.value,
        },
    });
};

const sendProduct = () => {
    const lastIndex = products.value?.length;
    let newID;
    if (lastIndex !== undefined && products.value !== null) {
        newID = products.value[lastIndex - 1].id + 1;
    } else newID = 1;
    const newProd: Product = { id: newID, created_at: Date.now().toString(), product_name: product.value };

    const { data, error } = useFetch('http://127.0.0.1:8000/products', {
        method: 'post',
        headers: {
            Authorization: `token: ${accessToken}`,
        },
        body: {
            uid: useSupabaseUser().value?.id,
            product_name: product.value,
        },
    });
    if (!error.value) {
        const lastIndex = products.value?.length;
        if (lastIndex !== undefined) products.value?.push(newProd);
    }
};
</script>

<template>
    <h1>Personal page</h1>
    <div v-for="product in products">
        {{ product.id }} :
        {{ product.product_name }}
    </div>
    <input v-model="product" type="text" placeholder="Product name" /><br />
    <button @click="sendProduct"> Create a new product</button><br />
    <br />
    <input v-model="nickname" type="text" placeholder="Your nickname" /><br />
    <button @click="sendNickName"> Set your nickname</button>
</template>

<style scoped></style>
