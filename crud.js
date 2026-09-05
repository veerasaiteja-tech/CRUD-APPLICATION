document.addEventListener('DOMContentLoaded', () => {
    let cars = [
        { id: 1, brand: "Audi", image: "audi.png", price: 2000, qty: 3 },
        { id: 2, brand: "Polo", image: "audi.png", price: 3000, qty: 4 },
        { id: 3, brand: "Thar", image: "audi.png", price: 4000, qty: 2 },
        { id: 4, brand: "Bwm", image: "audi.png", price: 5000, qty: 1 },
        { id: 5, brand: "Kia", image: "audi.png", price: 6000, qty: 6 },
    ]


    function editCar(index) {
        const car = cars[index]
        document.getElementById('carBrand').value = car.brand
        document.getElementById('carImage').value = car.image
        document.getElementById('carPrice').value = car.price
        document.getElementById('carQty').value = car.qty
        document.getElementById('carForm').dataset.editIndex = index


        const modal = new bootstrap.Modal(document.getElementById('exampleModal'))
        modal.show()
    }

    function renderCars() {
        const root = document.getElementById('root')
        const search = document.getElementById('search').value.toLowerCase()
        const filterData = cars.filter(car => car.brand.toLowerCase().includes(search))
        root.innerHTML = filterData.map((item, index) => {
            return (
                `
                <tr>
                <td>${item.id}</td>
                <td>${item.brand}</td>
                <td><img src="${item.image}" width="50px" height="50px"/></td>
                <td>&#8377;${item.price}</td>
                <td>
                <i class="fa-solid fa-minus" data-index="${index}" data-action="decrement"></i>
                  ${item.qty}
                <i class="fa-solid fa-plus" data-index="${index}" data-action="increment"></i>
              
                </td>
                <td>&#8377;${(item.price * item.qty).toFixed(2)}</td>
                <td><i class="fa-solid fa-pen-to-square text-primary" data-index="${index}" data-action="edit"></i></td>
                <td><i class="fa-solid fa-trash text-danger" data-index="${index}" data-action="delete"></i></td>
                </tr>
                `
            )
        }).join('')
        grandTotal(filterData)
    }
    renderCars()

    document.getElementById('root').addEventListener('click', (e) => {
        const target = e.target
        const index = target.dataset.index
        const action = target.dataset.action

        if (action === 'increment') {
            cars[index].qty++
        } else if (action === 'decrement' && cars[index].qty > 0) {
            cars[index].qty--
        }
        else if (action === 'edit') {
            editCar(index)  // Now this will work!
        }
        else if (action === "delete") {
            cars.splice(index, 1)
        }
        renderCars()
    })

    document.getElementById('search').addEventListener('input', () => {
        renderCars()
    })

    function grandTotal(filterData) {
        const total = filterData.reduce((sum, car) => sum + car.price * car.qty, 0)
        document.getElementById('total').innerHTML = `&#8377;${(total).toFixed(2)}`
    }

    function addCar(brand, image, price, qty) {
        const newCar = {
            id: cars.length ? cars[cars.length - 1].id + 1 : 1,
            brand,
            image,
            price: parseFloat(price),
            qty: parseInt(qty)
        }
        cars.push(newCar)
    }
    document.getElementById('carForm').addEventListener('submit', (e) => {
        e.preventDefault()
        const brand = document.getElementById('carBrand').value
        const image = document.getElementById('carImage').value
        const price = document.getElementById('carPrice').value
        const qty = document.getElementById('carQty').value

        if (brand && image && price && qty) {
            const editIndex = document.getElementById('carForm').dataset.editIndex
            if (editIndex !== undefined) {
                // Update existing car
                cars[editIndex] = {
                    ...cars[editIndex],
                    brand,
                    image,
                    price: parseFloat(price),
                    qty: parseInt(qty)
                }
                delete document.getElementById('carForm').dataset.editIndex
            } else {
                // Add new car
                addCar(brand, image, price, qty)
            }
        }

        document.getElementById('carForm').reset()
        renderCars()

        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'))
        modal.hide()
    })

    renderCars()
})
