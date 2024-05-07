import {expect} from "chai";
import mongoose from "mongoose";
import supertest from "supertest";

const requester = supertest("http://localhost:8080") 

describe('Testing Ecomerce App', () => {
  
  describe("Testing sessions api",()=>{

    it("Testeando el logueo de un usuario con /api/sessions/login",async()=>{
      const UserMock = {
        email:"valentinolucero93@gmail.com",
        password: "hola",
      }

      const  { statusCode, ok } = await requester
      .post("/api/sessions/login")
      .send(UserMock);
 

      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
    })

    it("Testeando el traer todos los un usuario por su id con /users/find/:uid",async()=>{
      const uid = "65e639515933b851b6b1a92d"
      const {statusCode, ok, body } = await requester.get(`/users/find/${uid}`)
      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(body).to.be.an("object"); 

    })
  })

  describe("Testing Product api",()=>{
    it("Testeando el crear un producto con api/products",async() =>{
      const ProdMock={
        title: "Test1Title",
        descripcion: "Test1Desc",
        price: 70,
        thumbnail: "Test1thumbnail",
        code: "P001",
        owner: "default",
        stock: 200
      };
    
      const { statusCode, ok, body } = await requester
      .post("/api/products")
      .send(ProdMock);

      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(body).to.be.an("object");
      expect(body).to.not.be.empty
    })


    it("Testeando el traer todos los Productos con /api/products",async()=>{
      const {statusCode, ok, body } = await requester.get("/api/products")
      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(body).to.be.an("object"); 

    })

    it("Testeando el traer un Producto especifico por id con /api/products/:pid",async()=>{
      const pid = "65ff4fbb3b1c8331196b1311"

      const response = await requester.get(`/api/products/${pid}`)
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object")
    })

  })

  describe("Testing Cart api",()=>{
    
    it("Testeando el crear un carrito en la ruta /api/carts/",async() =>{
      const CartMock = {
        products:[
          {
            productId:"658ca4c659023d0e8f8a974b",
            quantity: 2
          }
        ]
      }

      const  { statusCode, ok, _body } = await requester
      .post("/api/carts")
      .send(CartMock);

      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
    })

    it("Testeando el traer todos los carritos con /api/carts",async()=>{
      const {statusCode, ok, body } = await requester.get("/api/carts")
      expect(statusCode).is.equals(200);
      expect(ok).is.equals(true);
      expect(body).to.be.an("object"); 
      expect(body.data).to.be.an("array"); 
      expect(body.data.length).to.be.greaterThan(0);
    })

    it("Testeando el traer un carrito especifico por id con /api/carts/:cid",async()=>{
      const cid = "661016d31462029b484eb243"

      const response = await requester.get(`/api/carts/${cid}`)
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("object")
      expect(response.body.cart).to.exist;
      expect(response.body.cart._id).to.equal(cid)
    })
    

  })

})


