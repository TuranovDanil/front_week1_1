Vue.component('product', {
    template: `
   <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a :href="link" >More products like this</a>

            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ through: !inStock}">Out of stock</p>

            <span v-show="onSale">{{ sale }}</span>

            <ul>
                <li v-for="detail in details">{{ detail}}</li>
            </ul>

            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor}"
                    @mouseover="updateProduct(index)"
            >
            </div>

            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>

            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>

            <button
                    @click="addToCart"
                    :disabled="!inStock || cart >= inStock"
                    :class="{ disabledButton: !inStock || cart >= inStock}"
            >
                Add to cart
            </button>
            <button
                    @click="delToCart"
                    :class="{ disabledButton: !cart}"
            >
                Del to cart
            </button>
        </div>

    </div>
 `,
    data(){
        return{
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,

        }
    },
    methods: {
        addToCart() {
            this.cart += 1;
        },
        delToCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }

    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            if(this.onSale) return this.brand + " " + this.product + " " + "On SALE";
        }

    }

})

let app = new Vue({
    el: '#app',
})