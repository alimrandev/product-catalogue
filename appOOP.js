// creating product class
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price
  }
}
// Local Store
class Storage{
  static addDataToLS(product){
    let products;
    if(localStorage.getItem('products') === null){
      products = []
    }else{
      products = JSON.parse(localStorage.getItem('products'));
    }
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
  }
  // get product data from LS
  static getDataFromLS(){
    let products;
    if(localStorage.getItem('products') === null){
      products = []
    }else{
      products = JSON.parse(localStorage.getItem('products'));
    }
    return products;
  };
  // display data
  static displayDataFromLS(){
    const products = Storage.getDataFromLS();
    products.forEach(product =>{
      const ui  = new UI;
      ui.displayProduct(product);
    })
  }
  // delete data form ls
  static deleteProductFromLS(id){
    const products = Storage.getDataFromLS();
    products.forEach((product, index) =>{
      if(product.id === id){
        products.splice(index,1)
      }
    })
    localStorage.setItem('products', JSON.stringify(products));
  }
}

window.addEventListener('DOMContentLoaded', Storage.displayDataFromLS);
// UI Class
class UI {

  displayProduct({id, name, price}) {
    // creating li
    const li = document.createElement('li');
    li.classList = 'list-group-item collection-item';
    li.innerHTML = `
    <strong>${name}</strong>- <span class="price">$${price}</span><input type="hidden" data-id="${id}"> <i class="fas fa-trash float-right delete">x</i>
    `
    document.querySelector('.collection').appendChild(li);
  };

  clearField() {
    document.querySelector('#product-name').value = '';
    document.querySelector('#product-price').value = '';
  }
  // show alert
  showAlert(msgs, className) {
    // crating div
    const div = document.createElement('div');
    const ul = document.querySelector('.collection')
    div.className = `alert alert-${className}`;
    div.textContent = msgs;
    document.querySelector('.card-body').insertBefore(div, ul);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 2000)
  };

  // delete product
  deleteProduct(target) {
    if (target.classList.contains('delete')) {
      target.parentElement.remove();
      const ui = new UI;
      ui.showAlert('Product Delete Successfully', 'warning');
      const id = Number(target.previousElementSibling.dataset.id)
      Storage.deleteProductFromLS(id)
    }
  };
  searchProduct(value) {
    let itemLength = 0;
    document.querySelectorAll('.collection-item').forEach(item => {
      const itemName = item.firstElementChild.textContent.toLocaleLowerCase();
      if(itemName.indexOf(value) === -1){
        item.style.display = 'none';
      }else{
        item.style.display = 'block';
        itemLength++
      }
    })
    console.log(itemLength);
    const ui = new UI();
    
    itemLength > 0 ? null : ui.showAlert('No Match', 'danger')
  };
  getID(){
    return document.querySelectorAll('.collection-item').length;
  }
}

// add event listener 
document.querySelector('form').addEventListener('submit', e => {
  const name = document.querySelector('#product-name').value;
  const price = document.querySelector('#product-price').value;
  const ui = new UI();
  const id = ui.getID();
  const product = new Product(id, name, price);
  if (name === '' || price === '' || !(!isNaN(parseFloat(price)) && isFinite(price))) {
    ui.showAlert('Please input the right value', 'danger')
  } else {
    ui.showAlert('Product Added Successfully', 'success')
    ui.displayProduct(product);
    Storage.addDataToLS(product);
    ui.clearField();
  }
  e.preventDefault();
});
// delete product
document.querySelector('.collection').addEventListener('click', e => {
  const ui = new UI();
  ui.deleteProduct(e.target);
})

// search
document.querySelector('#filter').addEventListener('keyup', e => {
  const ui = new UI();
  ui.searchProduct((e.target.value).toLowerCase())
})