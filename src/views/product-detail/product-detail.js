import * as Api from '/utils/api.js';
import { renderClientSideComponent } from '/utils/useful-functions.js';
const detailWrap = document.querySelector(".detailWrap")
const productImg = document.querySelector(".productImg");
const productDetail = document.querySelector(".productDetail");

const productUrl = window.location.pathname.split('/');
const productId = productUrl[productUrl.length - 2];
const productCount = 0;

async function drawDetail() {
    try {

        const data = await Api.get('/api/product', productId);

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
            `


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

                    <li>
                        <figuare class="routeBtn">
                            <button type="button" class="moveOrder">구매하기</button>
                            <button type="button" class="moveCart">장바구니</button>
                            <button type="button">관심상품</button>
                            <button type="button" class="editProduct" data-id="${id}">상품수정</button>
                        </figuare>  
                    </li>
                    
                </ul>
            `

        // 구매하기 버튼 클릭 시 라우팅
        const moveOrder = document.querySelector('.moveOrder');
        moveOrder.addEventListener('click', () => (location.href = `/order`));

        // 제품 데이터 로컬에 담기
        const moveCart = document.querySelector('.moveCart');
        localStorage.setItem('product', JSON.stringify(data));
        moveCart.addEventListener('click', () => (location.href = '/cart'));

        // [ 관리자 권한 ] 제품 수정하기 버튼클릭 시 제품 수정페이지로 이동
        const editProduct = document.querySelector('.editProduct');
        editProduct.addEventListener('click', (e) => {
            const pareLi = e.target;
            location.href = `/product/edit/${pareLi.dataset.id}`
        });

    } catch (err) {
        console.log(err);
    }
}

async function start() {
    await renderClientSideComponent();
    await drawDetail();
}

start();
