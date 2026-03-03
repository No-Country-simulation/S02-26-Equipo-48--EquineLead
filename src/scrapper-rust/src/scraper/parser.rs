use scraper::{Html, Selector};
use serde_json::Value;
use std::collections::HashSet;

#[derive(Debug)]//imprimir productos parseados antes de enviar
pub struct ParsedProduct {
    pub name: String,
    pub price: f64,
    pub category: String,
    pub product_url: String, 
}

pub fn parse_page(html: &str) -> Vec<ParsedProduct> {

    let document = Html::parse_document(html);
    let selector = Selector::parse("script[type='application/ld+json']").unwrap();

    let mut products = Vec::new();  

    for element in document.select(&selector) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&element.inner_html()) {

            if let Some(product_type) = value["@type"].as_str() {
                if product_type == "Product" {

                    let name = value["name"]
                        .as_str()
                        .unwrap_or("")
                        .to_string();

                    let price = value["offers"]["price"]
                        .as_str()
                        .unwrap_or("0")
                        .parse::<f64>()
                        .unwrap_or(0.0);

                    let category = value["category"]
                        .as_str()
                        .unwrap_or("")
                        .to_string();

                    let product_url = value["@id"]
                        .as_str()
                        .or_else(|| value["offers"]["url"].as_str())
                        .map(|s| s.to_string());

                    let product_url = match product_url {
                        Some(u) => u,
                        None => {
                            println!("Producto sin URL encontrado, se ignora: {:?}", value);
                            continue;
                        }
                    };

                    if !name.is_empty() && price > 0.0 {
                        products.push(ParsedProduct {
                            name,
                            price,
                            category,
                            product_url,
                        });
                    }
                }
            }
        }
    }

    products
}


pub fn extract_product_links(html: &str) -> Vec<String> {
    let document = scraper::Html::parse_document(html);
    let selector =
        scraper::Selector::parse("div.js-product-miniature a").unwrap();

    let mut unique_links = HashSet::new();

    for element in document.select(&selector) {
        if let Some(link) = element.value().attr("href") {
            if link.starts_with("http") {
                unique_links.insert(link.to_string());
            }
        }
    }

    unique_links.into_iter().collect()
}



