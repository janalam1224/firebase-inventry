const db = require('../config/firebaseAdmin');

exports.getProducts = async (req, res) => {
  try {
    const pageSize = parseInt(req.params.limit) || 2;

    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
    const docRef = db.collection("products")
                     .orderBy(sortField, sortOrder)
                     .limit(pageSize);

    const snapshot = await docRef.get();

    if (snapshot.empty) {
      return res.status(404).send({ message: "Product Not Found" });
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, data: doc.data() });
    });

    res.status(200).send({ products });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
}


exports.postProduct = async (req, res) => {
  const data = req.body;

  try {
    const docRef = db.collection("products");

    const existProduct = await docRef.where("name", "==", data.name).get();

    if (!existProduct.empty) {
      return res.status(400).send({ message: "Product already exists" });
    }

    const newDoc = await docRef.add(data);

    res.status(201).send({ message: "Product added successfully", id: newDoc.id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

exports.findProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error finding product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProduct = async(req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const docRef = db.collection("products").doc(id);
  const snapshot = await docRef.get();
  if(!snapshot.exists){
    return res.status(404).json({ error: "Product not found" });
  }
  await docRef.update(updateData);
  
  res.status(200).send({ message: "Product Updated Successfully." });
}

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = db.collection("products").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
