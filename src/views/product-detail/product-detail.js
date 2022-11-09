import * as Api from '/utils/api.js';
import { renderClientSideComponent } from '/utils/useful-functions.js';

const detailWrap = document.querySelector('.detailWrap');
const productImg = document.querySelector('.productImg');
const productDetail = document.querySelector('.productDetail');

const editProduct = document.querySelector('.editProduct');
const purchaseButton = document.querySelector('#purchaseButton');
const adCartButton = document.querySelector('#adCartButton');
const productUrl = window.location.pathname.split('/');
const productId = productUrl[productUrl.length - 2];
let productCount = 0;
let data;
// 페이지 렌더링
renderElements();
addAllEvents();

function renderElements() {
  renderClientSideComponent();
  drawDetail();
}

function addAllEvents() {
  purchaseButton.addEventListener('click', handlePurchase);
  adCartButton.addEventListener('click', handleProductToCart);
  // 관리자 전용
  editProduct.addEventListener('click', handleEditProduct);
}

async function drawDetail() {
  try {
    data = await Api.get('/api/product', productId);

        const data = await Api.get('/api/product', productId);
        // const { productId, image, description, price, productName, productTitle, stoneType} = data;
        const id = data.productId;
        const img = data.image;
        const description = data.description;
        const price = data.price;
        const name = data.productName;
        const title = data.productTitle;
        const type = data.stoneType;

        productImg.innerHTML = `
                <figure>
                    <img src="${img}"/>
                </figure>
            `;

    productDetail.innerHTML = ` 
                <ul class="productDesc">
                    <li><h1>${title}</h1></li>
                    <li>${name}</li>
                    <li>판매가 <span>${price}</span></li>
                    <li>${description}</li>
                    <li>
                        <select>
                            <label>-[필수]옵션을 선택해 주세요-</label>
                            <option>원석: ${type}</option>
                        </select>
                    </li>
                    <li><strong>최소주문수량 1개 이상</strong></li>
                    <li>
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>상품수</th>
                                    <th>가격</th>
                                </tr>
                            </thead>
                        </table>
                    </li>
                    <li>
                        <p>Total : ${price}<span>(${productCount}개)</span></p>
                    </li>
                </ul>
            `;

    // 어드민 제품 수정
    const editProduct = document.querySelector(".editProduct");
    editProduct.addEventListener("click", (e) => location.href = `/product/edit/${e.target.dataset.id}`)

    // 구매하기 버튼 클릭 시 라우팅
    const moveOrder = document.querySelector(".moveOrder");
    moveOrder.addEventListener('click', () => (location.href = `/order`));
        
    // 제품 데이터 로컬에 담기
    const moveCart = document.querySelector(".moveCart");
    moveCart.addEventListener('click', () => {
        const baskets = JSON.parse(sessionStorage.getItem("cart")) || [];
        baskets.push(data)
        
       
        sessionStorage.setItem('cart', JSON.stringify(baskets));
        location.href = '/cart'
    });
    
  } catch (err) {
    console.log(err);
  }
}

function handlePurchase(e) {
  e.preventDefault();
  const orderData = JSON.stringify({
    product: [
      {
        id: data.productId,
        name: data.productName,
        quantity: 1,
        price: data.price,
      },
    ],
  });
  sessionStorage.setItem('order', orderData);
  location.href = `/order`;
}

function handleProductToCart() {
  // 기존 장바구니 목록 데이터
  let exData = sessionStorage.getItem('cart');
  exData = JSON.parse(exData).product;

  // data = 기존 데이터 + 새로운 데이터
  const data1 = JSON.stringify({
    product: [
      ...exData,
      {
        id: data.productId,
        name: data.productName,
        price: data.price,
        quantity: 1,
      },
    ],
  });

  sessionStorage.setItem('cart', data1);
  //location.href = '/cart';
}

function handleEditProduct() {
  const pareLi = e.target;
  location.href = `/product/edit/${pareLi.dataset.id}`;
}
