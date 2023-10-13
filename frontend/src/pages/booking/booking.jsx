

function ProductList({ products, onChangeProductQuantity, onRemoveProduct }) {
    return (
        <div>
            <header className="container">
                <h1>Shopping Cart</h1>

                <ul className="breadcrumb">
                    <li>Home</li>
                    <li>Shopping Cart</li>
                </ul>
                <span className="count">{itemCount} items in the bag</span>
            </header>
            <section className="container">
                <ul className="products">
                    {products.map((product, index) => {
                        return (
                            <li className="row" key={index}>
                                <div className="col left">
                                    <div className="thumbnail">
                                        <a href="#">
                                            <img src={product.image} alt={product.name} />
                                        </a>
                                    </div>
                                    <div className="detail">
                                        <div className="name">
                                            <a href="#">{product.name}</a>
                                        </div>
                                        <div className="description">{product.description}</div>
                                        <div className="price">{formatCurrency(product.price)}</div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>
        </div>
    );
}





