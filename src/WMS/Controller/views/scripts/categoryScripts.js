function generateCateTree(container,cateList){

}


async function getProducts(token){
    const requestOptions = {
        method: 'GET',
    }
    const trungboo = await fetch(`/protected/getAllCateProduct?token=${token}`, requestOptions);
    console.log(trungboo.body);
    return trungboo;
}
async function fetchProduct(token){
    const products = await getProducts(token);
    const productsDiv = document.getElementById("products--container")
    let finalContent ='';
    products.forEach(product => {
        finalContent += `
        <div class="product-content">
            <div>
                <img src="/views/Banana-Single.jpg" alt="">
            </div>
            <div class="product-des--container">
                <div class="name-price--container">
                    <h2>${product.name}</h2>
                    <h2>${product.price}</h2>
                </div>
                <div class="brand-cate--container">
                    <h3>${product.brand}</h3>
                    <h3>${product.category}</h3>
                </div>
            </div>
        </div>
    `
    })
    productsDiv.innerHTML = finalContent;

}