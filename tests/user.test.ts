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

describe("POST /user/find", () => {
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
