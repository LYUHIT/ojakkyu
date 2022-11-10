import { renderClientSideComponent } from '/utils/useful-functions.js';
import * as Api from '/utils/api.js';

const product = document.querySelector('.product');

start();

async function drawProduct() {
  try {
    const data = await Api.get('/api/product/newProducts');

    product.innerHTML = data
      .map((tem) => {
        const {
          image,
          description,
          price,
          productName,
          productTitle,
          stoneType,
          productId,
        } = tem;

        return `
            <li data-id="${productId}" class="productEvent">
                <img src=${image}>
                <p>${description}</p>
                <p>${price}</p>
                <p>${productId}</p>
                <p>${productName}</p>
                <p>${productTitle}</p>
                <p>${stoneType}</p>
            </li>
          `;
      })
      .join('');
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

// 제품 리스트 그려주는 비동기 함수 && 컴포넌트 랜더링 함수
async function start() {
  await renderClientSideComponent();
  await drawProduct();
}

// 상세페이지 이동
moveDetail.addEventListener("click", (e) => {
  const pareLi = e.target.closest(".productEvent");
  location.href = `/product/${pareLi.dataset.id}`;
})

