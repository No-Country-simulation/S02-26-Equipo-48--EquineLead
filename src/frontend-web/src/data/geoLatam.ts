// Geographic data for Latin America countries and their main cities
export interface CountryData {
    name: string;
    cities: string[];
}

export const LATAM_COUNTRIES: CountryData[] = [
    {
        name: "Argentina",
        cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "San Miguel de Tucumán", "Salta", "Santa Fe", "San Juan", "Resistencia", "Neuquén", "Bahía Blanca", "Posadas", "San Salvador de Jujuy", "Santiago del Estero", "Corrientes", "Paraná", "Formosa", "San Luis"],
    },
    {
        name: "Bolivia",
        cities: ["Sucre", "La Paz", "Santa Cruz de la Sierra", "Cochabamba", "El Alto", "Oruro", "Potosí", "Tarija", "Sacaba", "Quillacollo", "Montero", "Riberalta", "Trinidad", "Yacuiba"],
    },
    {
        name: "Brasil",
        cities: ["Brasilia", "São Paulo", "Río de Janeiro", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís", "Maceió", "Natal", "Teresina", "Campo Grande", "João Pessoa", "Osasco", "Uberlândia", "Contagem", "Sorocaba", "Aracaju", "Feira de Santana", "Cuiabá", "Joinville", "Juiz de Fora", "Londrina"],
    },
    {
        name: "Chile",
        cities: ["Santiago", "Valparaíso", "Concepción", "Antofagasta", "Viña del Mar", "Rancagua", "Temuco", "Iquique", "Arica", "La Serena", "Coquimbo", "Chillán", "Los Ángeles", "Osorno", "Puerto Montt", "Punta Arenas", "Copiapó", "Valdivia", "Calama"],
    },
    {
        name: "Colombia",
        cities: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena de Indias", "Cúcuta", "Ibagué", "Bucaramanga", "Villavicencio", "Santa Marta", "Valledupar", "Bello", "Pereira", "Montería", "Pasto", "Buenaventura", "Manizales", "Neiva", "Palmira", "Riohacha", "Sincelejo", "Popayán", "Itagüí", "Floridablanca", "Tuluá", "Barrancabermeja", "Tunja", "Apartadó"],
    },
    {
        name: "Costa Rica",
        cities: ["San José", "Alajuela", "Heredia", "Cartago", "Puntarenas", "Limón", "Liberia", "San Isidro de El General", "Quesada", "Desamparados"],
    },
    {
        name: "Cuba",
        cities: ["La Habana", "Santiago de Cuba", "Camagüey", "Holguín", "Guantánamo", "Santa Clara", "Las Tunas", "Bayamo", "Pinar del Río", "Cienfuegos", "Matanzas", "Ciego de Ávila", "Sancti Spíritus", "Manzanillo"],
    },
    {
        name: "Ecuador",
        cities: ["Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", "Manta", "Portoviejo", "Ambato", "Durán", "Quevedo", "Loja", "Ibarra", "Riobamba", "Esmeraldas", "Latacunga", "Tulcán", "Chone", "Santa Rosa"],
    },
    {
        name: "El Salvador",
        cities: ["San Salvador", "Santa Ana", "San Miguel", "Soyapango", "Mejicanos", "Santa Tecla", "Apopa", "Sonsonate", "Usulután", "Cojutepeque", "Zacatecoluca", "San Vicente"],
    },
    {
        name: "Guatemala",
        cities: ["Ciudad de Guatemala", "Mixco", "Villa Nueva", "Quetzaltenango", "Escuintla", "Chimaltenango", "Cobán", "Huehuetenango", "Puerto Barrios", "Chichicastenango", "Antigua Guatemala", "Retalhuleu", "Jalapa", "Jutiapa"],
    },
    {
        name: "Haití",
        cities: ["Puerto Príncipe", "Carrefour", "Delmas", "Pétion-Ville", "Gonaïves", "Cabo Haitiano", "Saint-Marc", "Les Cayes"],
    },
    {
        name: "Honduras",
        cities: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "El Progreso", "Comayagua", "Puerto Cortés", "Choluteca", "Danlí", "Siguatepeque"],
    },
    {
        name: "Jamaica",
        cities: ["Kingston", "Portmore", "Spanish Town", "Montego Bay", "May Pen", "Mandeville"],
    },
    {
        name: "México",
        cities: ["Ciudad de México", "Tijuana", "León", "Puebla", "Ciudad Juárez", "Guadalajara", "Monterrey", "Cancún", "Mérida", "Saltillo", "Aguascalientes", "Hermosillo", "Mexicali", "San Luis Potosí", "Culiacán", "Querétaro", "Torreón", "Chihuahua", "Morelia", "Reynosa", "Veracruz", "Villahermosa", "Tuxtla Gutiérrez", "Durango", "Toluca"],
    },
    {
        name: "Nicaragua",
        cities: ["Managua", "León", "Masaya", "Matagalpa", "Chinandega", "Granada", "Estelí", "Jinotega", "Juigalpa", "Ocotal"],
    },
    {
        name: "Panamá",
        cities: ["Ciudad de Panamá", "San Miguelito", "La Chorrera", "Colón", "David", "Chitré", "Aguadulce", "Santiago de Veraguas", "Arraiján", "Changuinola"],
    },
    {
        name: "Paraguay",
        cities: ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá", "Lambaré", "Fernando de la Mora", "Encarnación", "Caaguazú", "Pedro Juan Caballero", "Coronel Oviedo", "Concepción"],
    },
    {
        name: "Perú",
        cities: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Chimbote", "Huancayo", "Tacna", "Juliaca", "Ica", "Pucallpa", "Sullana", "Cajamarca", "Ayacucho", "Huánuco", "Puno", "Tarapoto", "Huaraz", "Tumbes"],
    },
    {
        name: "República Dominicana",
        cities: ["Santo Domingo", "Santiago de los Caballeros", "Puerto Plata", "San Pedro de Macorís", "La Romana", "San Cristóbal", "San Francisco de Macorís", "Higüey", "Moca", "Baní", "Bonao"],
    },
    {
        name: "Trinidad y Tobago",
        cities: ["Puerto España", "Chaguanas", "San Fernando", "Arima", "Scarborough"],
    },
    {
        name: "Uruguay",
        cities: ["Montevideo", "Salto", "Ciudad de la Costa", "Paysandú", "Las Piedras", "Maldonado", "Rivera", "Tacuarembó", "Artigas", "Mercedes", "San José de Mayo", "Melo", "Trinidad", "Minas", "Rocha"],
    },
    {
        name: "Venezuela",
        cities: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Ciudad Guayana", "Maracay", "Maturín", "Barcelona", "Ciudad Bolívar", "Cumaná", "San Cristóbal", "Barinas", "Cabimas", "Punto Fijo", "Puerto La Cruz", "Mérida", "Coro", "El Tigre", "Carúpano", "Valera"],
    },
    {
        name: "Otro",
        cities: [],
    },
];

export const COUNTRY_NAMES = LATAM_COUNTRIES.map((c) => c.name);

export function getCitiesForCountry(country: string): string[] {
    return LATAM_COUNTRIES.find((c) => c.name === country)?.cities ?? [];
}
