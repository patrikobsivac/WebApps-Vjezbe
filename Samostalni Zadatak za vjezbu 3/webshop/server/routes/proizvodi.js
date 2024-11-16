import express from 'express';
import {artikli, Artikl} from '../data.js';
const router = express.router();

router.get("/", (req, res)=>{
    return res.status(200).json({artikli: artikli});
});

router.get("/:id", (req,res) =>{
    const proizvodID=req.params.id;
    if(isNaN(proizvodID)){
        res.status(400).json("ID treba imati broj");
    }
    const proizvod=artikli.find(a => a.id==proizvodID);
    return res.status(200).json(proizvod);
})
export default router;

