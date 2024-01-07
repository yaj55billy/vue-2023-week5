Object.keys(VeeValidateRules).forEach((rule) => {
	if (rule !== "default") {
		VeeValidate.defineRule(rule, VeeValidateRules[rule]);
	}
});
VeeValidateI18n.loadLocaleFromURL(
	"https://unpkg.com/@vee-validate/i18n@4.5.8/dist/locale/zh_TW.json"
);
VeeValidate.configure({
	generateMessage: VeeValidateI18n.localize("zh_TW"),
	validateOnInput: true,
});

import productModal from "./productModal.js";
const { createApp, ref, onMounted } = Vue;

const app = createApp({
	components: {
		productModal,
	},
	setup() {
		const apiBase =
			"https://ec-course-api.hexschool.io/v2/api/hexschool-billyji";

		const products = ref([]),
			tempProduct = ref({}),
			cartData = ref({
				carts: [],
			}),
			isLoading = ref(false),
			productModal = ref(null),
			user = ref({
				email: "",
				name: "",
				tel: "",
				address: "",
				message: "",
			});

		let productModalHandle = ref(null);

		const getProducts = () => {
			const apiUrl = `${apiBase}/products/all`;
			isLoading.value = true;
			axios
				.get(apiUrl)
				.then((res) => {
					products.value = res.data.products;
					isLoading.value = false;
				})
				.catch((error) => {
					console.log(error);
					isLoading.value = false;
				});
		};

		const getCart = () => {
			const apiUrl = `${apiBase}/cart/`;
			axios
				.get(apiUrl)
				.then((res) => {
					cartData.value = res.data.data;
				})
				.catch((error) => {
					console.log(error);
				});
		};

		const addToCart = (product_id, qty = 1) => {
			const apiUrl = `${apiBase}/cart/`;
			isLoading.value = true;
			const data = {
				product_id,
				qty,
			};

			axios
				.post(apiUrl, { data })
				.then(() => {
					getCart();
					productModalHandle.value.hide();
					isLoading.value = false;
				})
				.catch((error) => {
					console.log(error);
					productModalHandle.value.hide();
					isLoading.value = false;
				});
		};

		const deleteCartItem = (id) => {
			const apiUrl = `${apiBase}/cart/${id}`;
			isLoading.value = true;
			axios
				.delete(apiUrl)
				.then(() => {
					getCart();
					isLoading.value = false;
				})
				.catch((error) => {
					console.log(error);
					isLoading.value = false;
				});
		};

		const updateCartItem = (id, product_id, qty) => {
			const apiUrl = `${apiBase}/cart/${id}`;
			isLoading.value = true;
			const data = {
				product_id,
				qty,
			};
			axios
				.put(apiUrl, { data })
				.then(() => {
					getCart();
					isLoading.value = false;
				})
				.catch((error) => {
					console.log(error);
					isLoading.value = false;
				});
		};

		const deleteCarts = () => {
			alert("是否要刪除所有購物車項目？");
			const apiUrl = `${apiBase}/carts`;
			isLoading.value = true;
			axios
				.delete(apiUrl)
				.then(() => {
					getCart();
					isLoading.value = false;
				})
				.catch((error) => {
					console.log(error);
					isLoading.value = false;
				});
		};

		const openProductModal = (product) => {
			tempProduct.value = {};
			tempProduct.value = product;
			productModalHandle.value.show();
		};

		const onSubmit = () => {
			const apiUrl = `${apiBase}/order`;
			isLoading.value = true;
			const data = {
				user: {
					name: user.value.name,
					email: user.value.email,
					tel: user.value.tel,
					address: user.value.address,
				},
				message: user.value.message,
			};

			axios
				.post(apiUrl, { data })
				.then(() => {
					alert("訂單建立成功");
					isLoading.value = false;
					user.value = {
						email: "",
						name: "",
						tel: "",
						address: "",
						message: "",
					};
					getCart();
				})
				.catch((error) => {
					isLoading.value = false;
					console.log(error);
				});
		};

		onMounted(() => {
			getProducts();
			getCart();
			productModalHandle.value = new bootstrap.Modal(productModal.value);
		});

		return {
			products,
			tempProduct,
			cartData,
			isLoading,
			productModal,
			user,
			getProducts,
			getCart,
			addToCart,
			deleteCartItem,
			updateCartItem,
			deleteCarts,
			openProductModal,
			onSubmit,
		};
	},
});

app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
