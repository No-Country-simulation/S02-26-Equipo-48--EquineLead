mod scraper;
mod api;
mod models;
mod utils;

use utils::categorias::obtener_categorias;
use utils::names::generate_latam_name;
use utils::budget::generate_user_budget;
use rand::seq::SliceRandom;
use fake::{Fake, faker::name::en::Name};
use std::collections::HashSet;
use tokio::time::{sleep, Duration}; 
use rand::Rng;
use reqwest::Client;
use scraper::fetch::fetch_page;
use scraper::parser::{parse_page, extract_product_links};
use api::client::*;
use models::*;


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {

    let base_url = "https://localhost:7016";

    let mut rng = rand::thread_rng();

    // 🔹 Obtener y mezclar categorías
    let mut categorias = obtener_categorias();
    categorias.shuffle(&mut rng);

    // 🔹 Tomar entre 1 y 3 categorías aleatorias
    let cantidad_categorias = rng.gen_range(1..=3).min(categorias.len());
    let categorias = categorias.into_iter().take(cantidad_categorias);

    let mut used_names = HashSet::new();

    let client = Client::builder()
        .cookie_store(true)
        .build()?;

    for categoria in categorias {

        println!("Entrando a categoría: {}", categoria);

        let categoria_html = fetch_page(&client, categoria).await?;
        let mut product_links = extract_product_links(&categoria_html);

        println!("Productos encontrados: {}", product_links.len());

        // 🔹 Mezclar productos
        product_links.shuffle(&mut rng);

        // 🔹 Tomar entre 1 y 3 productos por categoría
        let cantidad_productos = rng.gen_range(1..=3).min(product_links.len());

        for link in product_links.into_iter().take(cantidad_productos) {

            println!("Visitando producto: {}", link);

            let product_html = fetch_page(&client, &link).await?;
            let products = parse_page(&product_html);

            for product in products {

                println!("Enviando producto: {}", product.name);

                let user_type = if rng.gen_bool(0.3) { 2 } else { 1 };

                let user_name = if user_type == 2 {
                    if rng.gen_bool(0.15) {
                        let companies = vec![
                            "AgroEquino S.A.", "Caballos del Valle", "Equine Solutions",
                            "Hacienda La Pradera", "Ganadería San Miguel"
                        ];
                        companies.choose(&mut rng).unwrap().to_string()
                    } else {
                        loop {
                            let candidate = generate_latam_name(&mut rng);
                            if !used_names.contains(&candidate) {
                                used_names.insert(candidate.clone());
                                break candidate;
                            }
                        }
                    }
                } else {
                    loop {
                        let candidate = generate_latam_name(&mut rng);
                        if !used_names.contains(&candidate) {
                            used_names.insert(candidate.clone());
                            break candidate;
                        }
                    }
                };

                let phone = format!("09{}", rng.gen_range(10000000..99999999));

                let user_budget = generate_user_budget(
                    user_type,
                    &user_name,
                    product.price,
                    &mut rng,
                );

                let user = CreateUserRequest {
                    user_type,
                    user_budget,
                    user_name,
                    user_phone: phone,
                };

                let user_id = match create_user(&client, base_url, &user).await {
                    Ok(id) => id,
                    Err(e) => {
                        println!("Error creando usuario: {:?}", e);
                        continue;
                    }
                };

                let product_req = CreateProductRequest {
                    product_price: product.price,
                    product_name: product.name.clone(),
                    product_category: product.category.clone(),
                    product_url: product.product_url.clone(),
                };

                let product_id = match create_product(&client, base_url, &product_req).await {
                    Ok(id) => id,
                    Err(e) => {
                        println!("Error creando producto {}: {:?}", product_req.product_name, e);
                        continue;
                    }
                };

                let roll: f64 = rand::random();
                let interaction_type = if roll < 0.40 {
                    1
                } else if roll < 0.70 {
                    2
                } else if roll < 0.85 {
                    4
                } else if roll < 0.95 {
                    5
                } else {
                    3
                };

                let interaction = CreateInteractionRequest {
                    user_id,
                    product_id,
                    interaction_source: 2,
                    interaction_type,
                };

                if let Err(e) = create_interaction(&client, base_url, &interaction).await {
                    println!("Error creando interacción: {:?}", e);
                    continue;
                }

                println!("Lead enviado correctamente");
            }

            sleep(Duration::from_secs(2)).await;
        }
    }

    Ok(())
}

