import request from "supertest";
import { app, server } from "../app.js";
import { connectDB, disconnectDB } from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";
import mongoose from "mongoose";

// Test para verificar que estamos usando la BD de test
test("Estamos usando la base de datos de TEST", async () => {
    expect(mongoose.connection.name).toMatch(/test/i);
});

describe("test butterfly crud", () => {

    describe("GET /butterflies", () => {
        let response
        beforeEach(async () => {
            response = await request(app).get('/butterflies').send()
        })
        test('should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        })
        test('should return array all of butterflies', async () => {
            expect(response.body).toBeInstanceOf(Array);
        })
    })

    describe("GET /butterflies/:id", () => {
        let response;
        let testButterfly;
        
        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error("Create failed:", e.name, e.message);
                throw e;
            }
            response = await request(app).get(`/butterflies/${testButterfly.id}`).send();
        });

        afterEach(async () => {
            if (testButterfly?.id) {
                await ButterflyModel.findByIdAndDelete(testButterfly.id);
            }
        });

        test("should return 200 and the butterfly when id exists", () => {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testButterfly.id);
            expect(response.body.common_name).toBe("test");
        });

        test("should return 400 when butterfly ID format is invalid", async () => {
            const invalidIdRes = await request(app).get("/butterflies/invalid-id");
            expect(invalidIdRes.status).toBe(400);
            expect(invalidIdRes.body).toHaveProperty("error");
        });

        test("should return 404 when butterfly does not exist", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const notFoundRes = await request(app).get(`/butterflies/${fakeId}`);
            expect(notFoundRes.status).toBe(404);
            expect(notFoundRes.body).toHaveProperty("error");
        });
    })

    describe("DELETE /butterflies/:id", () => {
        let response;
        let testButterfly;
        
        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error("Create failed:", e.name, e.message);
                throw e;
            }

            response = await request(app).delete(`/butterflies/${testButterfly.id}`).send();
        });

        test('should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        })

        test('should return a message butterflies deleted successfully and delete the butterfly', async () => {
            expect(response.body.message).toContain("The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findById(testButterfly.id);
            expect(foundButterfly).toBeNull();
        })
    });

    describe("POST /butterflies", () => {
        let createdId;

        afterEach(async () => {
            if (createdId) {
                await ButterflyModel.findByIdAndDelete(createdId);
                createdId = null;
            }
        });

        test("201: create butterfly when the body is valid", async () => {
            const res = await request(app)
                .post("/butterflies")
                .send({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "Descripción válida con más de diez caracteres.",
                    habitat: "test",
                    image: "https://example.com/morpho.jpg",
                    migratory: false
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(201);
            expect(res.headers["content-type"]).toContain("json");
            expect(res.body.message).toBe("Mariposa creada correctamente");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("id");
            createdId = res.body.data.id;

            // Verifica en BD
            const inDb = await ButterflyModel.findById(createdId);
            expect(inDb).not.toBeNull();
            expect(inDb.common_name).toBe("test");
        });

        test("400: returns validation errors with invalid body", async () => {
            const res = await request(app)
                .post("/butterflies")
                .send({
                    common_name: "",
                    scientific_name: "",
                    location: "",
                    description: "corta",
                    habitat: "",
                    image: "no-url",
                    migratory: "quizas"
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.errors)).toBe(true);
            expect(res.body.errors.length).toBeGreaterThan(0);
        });
    });

    describe("PUT /butterflies/:id", () => {
        let testButterfly;

        beforeEach(async () => {
            try {
                testButterfly = await ButterflyModel.create({
                    common_name: "test",
                    scientific_name: "test",
                    location: "test",
                    description: "esto es un test largo",
                    habitat: "test",
                    image: "https://test.com",
                    migratory: true
                });
            } catch (e) {
                console.error("Create failed:", e.name, e.message);
                throw e;
            }
        });

        afterEach(async () => {
            if (testButterfly?.id) {
                await ButterflyModel.findByIdAndDelete(testButterfly.id);
                testButterfly = null;
            }
        });

        test("200: update butterfly when is valid", async () => {
            const updatedButterfly = {
                common_name: "new test",
                scientific_name: "new test",
                location: "test",
                description: "esto es un test largo",
                habitat: "test",
                image: "https://newtest.com",
                migratory: true
            };

            const res = await request(app)
                .put(`/butterflies/${testButterfly.id}`)
                .send(updatedButterfly)
                .set("Content-Type", "application/json");

            expect(res.status).toBe(200);
            expect(res.headers["content-type"]).toContain("json");
            expect(res.body.message).toBe("Mariposa actualizada correctamente");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toMatchObject({
                id: testButterfly.id,
                common_name: "new test",
                scientific_name: "new test",
                migratory: true
            });

            // Verificación en la BD
            const inDb = await ButterflyModel.findById(testButterfly.id);
            expect(inDb.common_name).toBe("new test");
            expect(inDb.migratory).toBe(true);
        });

        test("400: returns validation errors with an invalid body", async () => {
            const res = await request(app)
                .put(`/butterflies/${testButterfly.id}`)
                .send({
                    common_name: "",
                    scientific_name: "",
                    location: "",
                    description: "corta",
                    habitat: "",
                    image: "no-url",
                    migratory: "quizas"
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(400);
            expect(Array.isArray(res.body.errors)).toBe(true);
            expect(res.body.errors.length).toBeGreaterThan(0);
        });

        test("404: returns a Not Found error when the ID does not exist", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/butterflies/${fakeId}`)
                .send({
                    common_name: "X",
                    scientific_name: "Y",
                    location: "Z",
                    description: "Descripción válida con más de diez.",
                    habitat: "H",
                    image: "https://example.com/z.jpg",
                    migratory: true
                })
                .set("Content-Type", "application/json");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });
});