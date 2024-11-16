import express from "express";
import {artikli, Artikl} from '../data.js';
const router = express.Router();

let listArtikle=[];

class Kosarica{
    constructor(id, naruceno){
        this.id=id;
        this.naruceno=naruceno;
    }
    get finalnaCijena(){
        return this.naruceno.reduce((suma, trenutno) => {
            const artikl_obj = Artikl.find(a => a.id == trenutno.id);
            return suma + artikl_obj.cijena*trenutno.kolicina;
        }, 0);
    }
}

router.post("/", (res, req)=>{
    const {podatke} = req.body;
    const {naruceno} = podatke.naruceno;
    if(!Array.isArray(naruceno) || naruceno.length == 0){
        return res.statusCode(400).json({message: 'Nema podaci'});
    }
    let novo=listArtikle ? listArtikle.at(-1).id+1:1;
    let artikle=new Kosarica(novo, naruceno);
    listArtikle.push(artikle);
    return res.status(201).json(podatke);
})
export default router;