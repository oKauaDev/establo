import request from "supertest";
import app from "../src/app";

let establishmentId: string;
let ownerId: string;
let baseId: string;

beforeAll(async () => {
  const res = await request(app).post("/user/create").send({
    name: "Enderson",
    email: "ederson.doe@gmail.com",
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

  expect(res.body.user.name).toBe("Enderson");
  expect(res.body.user.email).toBe("ederson.doe@gmail.com");
  expect(res.body.user.type).toBe("owner");

  ownerId = res.body.user.id;

  const res2 = await request(app).post("/user/create").send({
    name: "BaseUser",
    email: "base.user@gmail.com",
    type: "customer",
  });

  expect(res2.statusCode).toBe(201);
  expect(res2.body).toHaveProperty("success");
  expect(res2.body).toHaveProperty("message");
  expect(res2.body).toHaveProperty("user");

  expect(res2.body.user).toHaveProperty("id");
  expect(res2.body.user).toHaveProperty("name");
  expect(res2.body.user).toHaveProperty("email");
  expect(res2.body.user).toHaveProperty("type");

  expect(res2.body.user.name).toBe("BaseUser");
  expect(res2.body.user.email).toBe("base.user@gmail.com");
  expect(res2.body.user.type).toBe("customer");

  baseId = res2.body.user.id;
});

describe("POST /establishment/create", () => {
  it("should return 400", async () => {
    const res = await request(app).post("/establishment/create").send({
      name: "Teste01",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 403", async () => {
    const res = await request(app).post("/establishment/create").send({
      name: "Test01",
      ownerId: baseId,
      type: "shopping",
    });

    expect(res.statusCode).toBe(403);
  });

  it("should return 200", async () => {
    const res = await request(app).post("/establishment/create").send({
      name: "Test01",
      ownerId: ownerId,
      type: "shopping",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("establishment");

    expect(res.body.establishment).toHaveProperty("id");
    expect(res.body.establishment).toHaveProperty("name");
    expect(res.body.establishment).toHaveProperty("ownerId");
    expect(res.body.establishment).toHaveProperty("type");

    expect(res.body.establishment.name).toBe("Test01");
    expect(res.body.establishment.ownerId).toBe(ownerId);
    expect(res.body.establishment.type).toBe("shopping");

    establishmentId = res.body.establishment.id;
  });
});

describe("POST /establishment/find/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/establishment/find/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).get(`/establishment/find/${establishmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("establishment");

    expect(res.body.establishment).toHaveProperty("id");
    expect(res.body.establishment).toHaveProperty("name");
    expect(res.body.establishment).toHaveProperty("ownerId");
    expect(res.body.establishment).toHaveProperty("type");

    expect(res.body.establishment.name).toBe("Test01");
    expect(res.body.establishment.ownerId).toBe(ownerId);
    expect(res.body.establishment.type).toBe("shopping");
  });
});

describe("PUT /establishment/edit/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).put("/establishment/edit/notexist").send({
      name: "Paul Doe",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).put(`/establishment/edit/${establishmentId}`).send({
      name: "EditedName",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("establishment");

    expect(res.body.establishment).toHaveProperty("id");
    expect(res.body.establishment).toHaveProperty("name");
    expect(res.body.establishment).toHaveProperty("ownerId");
    expect(res.body.establishment).toHaveProperty("type");

    expect(res.body.establishment.name).toBe("EditedName");
    expect(res.body.establishment.ownerId).toBe(ownerId);
    expect(res.body.establishment.type).toBe("shopping");
  });
});

describe("PUT /establishment/query", () => {
  it("should return 500", async () => {
    const res = await request(app).get("/establishment/query?type=teste");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).get("/establishment/query");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("establishments");

    expect([1, 2]).toContain(res.body.establishments.length);

    expect(res.body.establishments[0]).toHaveProperty("id");
    expect(res.body.establishments[0]).toHaveProperty("name");
    expect(res.body.establishments[0]).toHaveProperty("ownerId");
    expect(res.body.establishments[0]).toHaveProperty("type");
  });
});

describe("PUT /establishment/delete/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).delete("/establishment/delete/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).delete(`/establishment/delete/${establishmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
  });
});

describe("PUT /establishment/query deleted establishment", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/establishment/query");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("establishments");

    expect([0, 1]).toContain(res.body.establishments.length);
  });
});
