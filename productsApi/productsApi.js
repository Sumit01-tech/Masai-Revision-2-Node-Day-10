const express = require("express");
const app = express();

app.use(express.json());

let products = [];
let idCounter = 1;

app.post("/products", (req, res) => {
    const { name, category, price, description } = req.body;

    const product = {
        id: idCounter++,
        name,
        category,
        price,
        description,
        createdAt: new Date()
    };

    products.push(product);
    res.status(201).json(product);
});

app.get("/products", (req, res) => {
    let result = [...products];

    const {
        category,
        minPrice,
        maxPrice,
        search,
        page = 1,
        limit = 5,
        sortBy = "createdAt",
        order = "asc"
    } = req.query;

    if (category) {
        result = result.filter(p => p.category === category);
    }

    if (minPrice) {
        result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
        result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (search) {
        result = result.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    result.sort((a, b) => {
        if (order === "desc") return a[sortBy] < b[sortBy] ? 1 : -1;
        return a[sortBy] > b[sortBy] ? 1 : -1;
    });

    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedData = result.slice(start, end);

    res.json({
        total: result.length,
        page: Number(page),
        limit: Number(limit),
        data: paginatedData
    });
});

app.put("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(product, req.body);
    res.json(product);
});

app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id);
    products = products.filter(p => p.id !== id);
    res.json({ message: "Product deleted successfully" });
});

app.listen(3000, () => {
    console.log("Product API running on port 3000");
});
