const { ref, toRefs } = Vue;

export default {
	template: `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{tempProduct.title}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <img :src="tempProduct.imageUrl" :alt="tempProduct.title" style="width: 100%;">
          </div>
          <p class="mt-4">
            <span class="fw-bolder">上課時間：</span>
            {{HandleDateFormat(tempProduct.datetimeStart)}} ~ {{HandleDateFormat(tempProduct.datetimeEnd)}}
          </p>
          <p class="mt-4">
            <span class="fw-bolder">課程內容：</span>
            {{tempProduct.content}}
          </p>
          <p>
            <span class="fw-bolder text-danger">注意事項：</span>
            {{tempProduct.notice}}
          </p>
          <div>
            <del>原價：{{tempProduct.origin_price}}</del><br />
            <h4>特價只要：{{tempProduct.price}}</h4>
          </div>
          <div class="mt-4">
            <div class="input-group">
              <input type="number" class="form-control" min="1" v-model.number="qty" />
              <button type="button" class="btn btn-primary" @click="addToCart(tempProduct.id, qty)">
                加入購物車
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `,
	props: {
		"temp-product": {
			type: Object,
		},
		"add-to-cart": {
			type: Function,
		},
	},
	setup(props) {
		const { tempProduct, addToCart } = toRefs(props);
		const qty = ref(1);
		const HandleDateFormat = (time) => {
			return new Date(time).toLocaleString("sv");
		};

		return {
			qty,
			tempProduct,
			addToCart,
			HandleDateFormat,
		};
	},
};
