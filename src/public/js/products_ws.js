
const socket = io()

socket.on("product", product => {
    let uProduct = document.querySelector('ul')
    let liNewProduct = document.createElement('li')
    uProduct.innerHTML = product
    uProduct.append(liNewProduct)
    console.log(product)
})

socket.on("deleteProduct", del => {
    const list = document.getElementById("list")
    let liNewProduct = document.createElement('li')

    let li = Array.from(document.getElementsByTagName('li'))

    let u = li[li.length -1];
    list.removeChild(u)
})