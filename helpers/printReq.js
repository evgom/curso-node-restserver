const { request } = require("express");

const printReq = (req = request) =>{
    // console.log({
    //     method: req.method,
    //     query: req.query,
    //     // headers: req.headers,
    //     params: req.params,
    //     body: req.body
    // });
};

module.exports = {
    printReq
}

