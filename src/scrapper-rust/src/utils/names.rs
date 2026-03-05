use rand::seq::SliceRandom;
use rand::Rng;

pub fn generate_latam_name(rng: &mut rand::rngs::ThreadRng) -> String {
    let first_names = vec![
        "María","Juan","Carlos","Ana","Luis","Sofía","Camila","Jorge","Valentina","Mateo",
        "Andrés","Daniela","Fernando","Gabriela","Hugo","Isabella","Javier","Lucía",
        "Manuel","Natalia","Óscar","Paula","Ricardo","Sara","Tomás","Verónica",
        "Alejandro","Beatriz","Cristian","Diana","Emilio","Fabiana","Gustavo","Helena",
        "Iván","Juliana","Kevin","Laura","Mauricio","Nicole","Pablo","Renata"
    ];

    let last_names = vec![
        "Pérez","González","Rodríguez","López","Martínez","Torres","Ramírez","Flores",
        "Vargas","Castro","Rojas","Morales","Ortega","Silva","Mendoza","Guerrero",
        "Cruz","Reyes","Herrera","Medina","Aguilar","Peña","Navarro","Campos",
        "Delgado","Suárez","Cabrera","Fuentes","Paredes","Salazar","Vega","Molina",
        "Acosta","Benítez","Cordero","Escobar","Figueroa","Gallardo","Ibarra","Zambrano"
    ];

    let first = first_names.choose(rng).unwrap();
    let last = last_names.choose(rng).unwrap();

    format!("{} {}", first, last)
}