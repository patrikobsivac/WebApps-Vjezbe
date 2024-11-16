class Artikl{
    constructor(id, naziv, cijena, velicina, opis, dostupna_boja, karakteristike, slika){
        this.id=id;
        this.naziv=naziv;
        this.cijena=cijena;
        this.velicina=velicina;
        this.opis=opis;
        this.dostupna_boja=dostupna_boja;
        this.karakteristike=karakteristike;
        this.slika=slika;
    }
}

const artikli = [
    new Artikl(1, 'Obična crna majica', 60, ['XS', 'S', 'M', 'L'], 'Jednostavna i udobna', ['crna'], 'Obična majica', ['https://pennyshop.ba/assets/photos/product/medium/157570.jpg']),
    new Artikl(2, 'Levis 501 traperice', 120, ['S', 'M', 'L'], 'Slično, ali bolje stoje',['plava', 'siva', 'crna'], 'Ravne nogavice', ['https://img2.ans-media.com/i/840x1260/SS22-SJM05K_55J_F1.jpg']),
    new Artikl(3, 'Zimska kapa', 45, ['onesize'], 'Savršena za hladne dane',['crvena', 'smeđa'],'Debela, prozračna, vodootporna', ['https://static.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/8/1/8187O-MLC-010-1-565071_3.jpg']),
    new Artikl(4, 'Adidas čarape', 25, ['34-36', '37-39', '40-42'], 'Moguće ih je nositi u svim prilikama',['crna', 'bijela', 'siva'], 'Elastična, udobna', ['https://img01.ztat.net/article/spp-media-p1/13844c4670a84b74b33e90db9741bcb4/91c0f67ba6f041c3b1d6c3ae84de9001.jpg']),
    new Artikl(5, 'Nike tenisice', 210, ['38', '39', '40', '41', '42', '43', '44', '45'], 'Udobne za hodanje', ['crna'],'Prozračna', ['https://www.mass-shoes.com/media/cache/300x390/catalog/product/9/2/9283-23_c9283-23b.jpg'])
];

export {artikli, Artikl};