const chai = require('chai');
const server = require('../server');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const user = {
    "id": "4",
    "name": "Item4"

};

it("Should Fetch Particular user only", (done) => {
    chai.request(server)
        .get("/user?id=1")
        .end((err, result) => {
            result.should.have.status(200);
            done();
        });
});

it("Should Fetch all the users", (done) => {
    chai.request(server)
        .get("/")
        .end((err, result) => {
            result.should.have.status(200);
            done();
        });
});

it("Should add user in DB", (done) => {
    chai.request(server)
        .post("/user/")
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });

});


it("Should Delete Particular User", (done) => {
    chai.request(server)
        .delete("/user?id=1")
        .end((err, result) => {
            result.should.have.status(200);
            done();
        });
});