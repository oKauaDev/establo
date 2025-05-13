import request from "supertest";
import app from "../src/app";

let userId: string;

describe("POST /user/create", () => {
  it("should return 400", async () => {
    const res = await request(app).post("/user/create").send({
      name: "John Doe",
      email: "john.doe",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).post("/user/create").send({
      name: "John Doe",
      email: "john.doe@gmail.com",
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

    expect(res.body.user.name).toBe("John Doe");
    expect(res.body.user.email).toBe("john.doe@gmail.com");
    expect(res.body.user.type).toBe("owner");

    userId = res.body.user.id;
  });

  it("should return 409", async () => {
    const res = await request(app).post("/user/create").send({
      name: "John Doe",
      email: "john.doe@gmail.com",
      type: "owner",
    });

    expect(res.statusCode).toBe(409);
  });
});

describe("POST /user/find/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/user/find/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).get(`/user/find/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("user");

    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("type");

    expect(res.body.user.name).toBe("John Doe");
    expect(res.body.user.email).toBe("john.doe@gmail.com");
    expect(res.body.user.type).toBe("owner");
  });
});

describe("PUT /user/edit/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).put("/user/edit/notexist").send({
      name: "Paul Doe",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).put(`/user/edit/${userId}`).send({
      name: "Paul Doe",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("user");

    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("name");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("type");

    expect(res.body.user.name).toBe("Paul Doe");
    expect(res.body.user.email).toBe("john.doe@gmail.com");
    expect(res.body.user.type).toBe("owner");
  });
});

describe("PUT /user/list", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/user/list");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("users");

    expect([1, 2, 3, 4]).toContain(res.body.users.length);

    expect(res.body.users[0]).toHaveProperty("id");
    expect(res.body.users[0]).toHaveProperty("name");
    expect(res.body.users[0]).toHaveProperty("email");
    expect(res.body.users[0]).toHaveProperty("type");
  });
});

describe("PUT /user/delete/:id", () => {
  it("should return 404", async () => {
    const res = await request(app).delete("/user/delete/notexist");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 200", async () => {
    const res = await request(app).delete(`/user/delete/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
  });
});

describe("PUT /user/list after delete user", () => {
  it("should return 200", async () => {
    const res = await request(app).get("/user/list");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("users");

    expect([0, 1, 2, 3]).toContain(res.body.users.length);
  });
});
