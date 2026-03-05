mod scraper;
mod api;
mod models;
mod utils;

use tokio::time::{sleep, Duration}; 
use rand::Rng;
use reqwest::Client;
use scraper::fetch::fetch_page;
use scraper::parser::{parse_page, extract_product_links};
use api::client::*;
use models::*;
use dotenvy::dotenv;
use std::env;

use axum::{routing::post, Router, response::IntoResponse, Json};
use tower_http::cors::{Any, CorsLayer};
use std::net::SocketAddr;
use serde::Serialize;

#[derive(Serialize)]
struct SyncResponse {
    message: String,
    status: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    dotenv().ok();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/sync", post(trigger_sync))
        .layer(cors);

    let port = 8081;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("Scrapper API escuchando en http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error + Send + Sync>)?;

    Ok(())
}

async fn trigger_sync() -> impl IntoResponse {
    println!("Manual Sync Triggered from Dashboard");
    
    tokio::spawn(async move {
        if let Err(e) = run_scraping_cycle().await {
            eprintln!("Error en ciclo de scraping: {:?}", e);
        }
    });

    Json(SyncResponse {
        message: "Scraping cycle started in background".to_string(),
        status: "success".to_string(),
    })
}

async fn run_scraping_cycle() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let backend_url = env::var("BACKEND_URL").unwrap_or_else(|_| "http://localhost:5286".to_string());
    let target_url = env::var("TARGET_URL").expect("TARGET_URL must be set in .env");
    let scrap_delay = env::var("SCRAP_DELAY_SEC").unwrap_or("2".to_string()).parse::<u64>().unwrap_or(2);
    let max_products = env::var("MAX_PRODUCTS_PER_CAT").unwrap_or("5".to_string()).parse::<usize>().unwrap_or(5);

    let w_fb = env::var("WEIGHT_FACEBOOK").unwrap_or("0".to_string()).parse::<i32>().unwrap_or(0);
    let w_ig = env::var("WEIGHT_INSTAGRAM").unwrap_or("0".to_string()).parse::<i32>().unwrap_or(0);
    let w_form = env::var("WEIGHT_FORMULARIO").unwrap_or("0".to_string()).parse::<i32>().unwrap_or(0);
    let w_web = env::var("WEIGHT_WEB").unwrap_or("0".to_string()).parse::<i32>().unwrap_or(0);
    let w_event = env::var("WEIGHT_EVENTO").unwrap_or("0".to_string()).parse::<i32>().unwrap_or(0);

    let client = Client::builder()
        .cookie_store(true)
        .user_agent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()?;

    println!("Iniciando ciclo de scraping en: {}", target_url);

    let category_html = fetch_page(&client, &target_url).await?;
    let mut product_links = extract_product_links(&category_html);

    println!("Productos encontrados: {}", product_links.len());
    
    // Mezclar links usando un RNG local que se dropea antes del await
    {
        use rand::seq::SliceRandom;
        let mut rng = rand::thread_rng();
        product_links.shuffle(&mut rng);
    }

    for link in product_links.into_iter().take(max_products) {
        let product_html = match fetch_page(&client, &link).await {
            Ok(html) => html,
            Err(e) => {
                println!("Error al obtener producto {}: {:?}", link, e);
                continue;
            }
        };

        let products = parse_page(&product_html);
        let min_price = 1_000_000.0;

        for product in products {
            if product.price < min_price { continue; }

            println!("Procesando: {} ($ {})", product.name, product.price);

            // Generar datos de usuario con un RNG local
            let (user_req, interaction_source) = {
                let mut rng = rand::thread_rng();
                let user_type = if rng.gen_bool(0.3) { 2 } else { 1 };
                let user_name = utils::names::generate_latam_name(&mut rng);
                let phone = format!("09{}", rng.gen_range(10000000..99999999));
                let user_budget = utils::budget::generate_user_budget(user_type, &user_name, product.price, &mut rng);

                let source_roll = rng.gen_range(1..=100);
                let interaction_source = if source_roll <= w_fb { 1 } 
                    else if source_roll <= w_fb + w_ig { 2 } 
                    else if source_roll <= w_fb + w_ig + w_form { 3 } 
                    else if source_roll <= w_fb + w_ig + w_form + w_web { 4 } 
                    else if source_roll <= w_fb + w_ig + w_form + w_web + w_event { 5 } 
                    else { 6 };

                (CreateUserRequest {
                    user_type,
                    user_budget,
                    user_name,
                    user_phone: phone,
                }, interaction_source)
            };

            let user_id = create_user(&client, &backend_url, &user_req).await?;
            
            let product_req = CreateProductRequest {
                product_price: product.price,
                product_name: product.name.clone(),
                product_category: product.category.clone(),
                product_url: product.product_url.clone(),
            };

            let product_id = create_product(&client, &backend_url, &product_req).await?;

            let interaction = {
                let mut rng = rand::thread_rng();
                CreateInteractionRequest {
                    user_id,
                    product_id,
                    interaction_source,
                    interaction_type: rng.gen_range(1..=5),
                }
            };

            create_interaction(&client, &backend_url, &interaction).await?;
            println!("Lead enviado (Fuente ID {})", interaction_source);
        }

        sleep(Duration::from_secs(scrap_delay)).await;
    }

    println!("Scraping finalizado.");
    Ok(())
}

