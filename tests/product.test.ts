import request from "supertest";
import app from "../src/app";

let establishmentId: string;
let ownerId: string;
let productId: string;

beforeAll(async () => {
  const res = await request(app).post("/user/create").send({
    name: "Mickey Doe",
    email: "mickey.doe@gmail.com",
    type: "owner",
  });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("success");
  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("user");

  expect(res.body.user).toHaveProperty("id");
  expect(res.body.user).toHaveProperty("name");
  expect(res.body.user).toHaveProperty("email");
  expect(res.body.user).toHaveProperty("type");

  expect(res.body.user.name).toBe("Mickey Doe");
  expect(res.body.user.email).toBe("mickey.doe@gmail.com");
  expect(res.body.user.type).toBe("owner");

  ownerId = res.body.user.id;

  const res2 = await request(app).post("/establishment/create").send({
    name: "Test01",
    ownerId: ownerId,
    type: "shopping",
  });

  expect(res2.statusCode).toBe(201);
  expect(res2.body).toHaveProperty("success");
  expect(res2.body).toHaveProperty("message");
  expect(res2.body).toHaveProperty("establishment");

  expect(res2.body.establishment).toHaveProperty("id");
  expect(res2.body.establishment).toHaveProperty("name");
  expect(res2.body.establishment).toHaveProperty("ownerId");
  expect(res2.body.establishment).toHaveProperty("type");

  expect(res2.body.establishment.name).toBe("Test01");
  expect(res2.body.establishment.ownerId).toBe(ownerId);
  expect(res2.body.establishment.type).toBe("shopping");

  establishmentId = res2.body.establishment.id;
});

describe("POST /product/create", () => {
  it("should return 400", async () => {
    const res = await request(app).post("/product/create").send({
      name: "John Doe",
      establishmentId: "notexist",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).post("/product/create").send({
      name: "Product 01",
      establishmentId: establishmentId,
      price: 300,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("product");

    expect(res.body.product).toHaveProperty("id");
    expect(res.body.product).toHaveProperty("name");
    expect(res.body.product).toHaveProperty("price");
    expect(res.body.product).toHaveProperty("establishmentId");

    expect(res.body.product.establishmentId).toBe(establishmentId);
    expect(res.body.product.price).toBe(300);

    productId = res.body.product.id;
  });
});

describe("POST /product/find/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/product/find/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).get(`/product/find/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("product");

    expect(res.body.product).toHaveProperty("id");
    expect(res.body.product).toHaveProperty("name");
    expect(res.body.product).toHaveProperty("establishmentId");
    expect(res.body.product).toHaveProperty("price");

    expect(res.body.product.establishmentId).toBe(establishmentId);
    expect(res.body.product.price).toBe(300);
  });
});

describe("PUT /product/edit/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).put("/product/edit/notexist").send({
      name: "Paul Doe",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).put(`/product/edit/${productId}`).send({
      name: "UpdateProduct",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("product");

    expect(res.body.product).toHaveProperty("id");
    expect(res.body.product).toHaveProperty("name");
    expect(res.body.product).toHaveProperty("price");
    expect(res.body.product).toHaveProperty("establishmentId");

    expect(res.body.product.name).toBe("UpdateProduct");
    expect(res.body.product.establishmentId).toBe(establishmentId);
    expect(res.body.product.price).toBe(300);
  });
});

describe("PUT /product/list", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/product/list");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("products");

    expect([1, 2]).toContain(res.body.products.length);

    expect(res.body.products[0]).toHaveProperty("id");
    expect(res.body.products[0]).toHaveProperty("name");
    expect(res.body.products[0]).toHaveProperty("price");
    expect(res.body.products[0]).toHaveProperty("establishmentId");
  });
});

describe("PUT /product/list/:establishmentId", () => {
  it("should return 200", async () => {
    const res = await request(app).get(`/product/list/${establishmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("products");

    expect([1, 2]).toContain(res.body.products.length);

    expect(res.body.products[0]).toHaveProperty("id");
    expect(res.body.products[0]).toHaveProperty("name");
    expect(res.body.products[0]).toHaveProperty("price");
    expect(res.body.products[0]).toHaveProperty("establishmentId");
  });
});

describe("PUT /product/delete/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).delete("/product/delete/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).delete(`/product/delete/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
  });
});

describe("PUT /product/list after delete product", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/product/list");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("products");

    expect([0, 1]).toContain(res.body.products.length);
  });
});
