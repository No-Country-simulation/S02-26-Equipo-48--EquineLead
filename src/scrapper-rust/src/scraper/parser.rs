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
    let mut products = Vec::new();

    // 1. Intentar con JSON-LD (Standard)
    let ld_selector = Selector::parse("script[type='application/ld+json']").unwrap();
    for element in document.select(&ld_selector) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&element.inner_html()) {
            let items = if value.is_array() { value.as_array().unwrap().clone() } else { vec![value] };
            for item in items {
                if item["@type"].as_str() == Some("Product") {
                    if let Some(p) = extract_from_json(&item) {
                        products.push(p);
                    }
                }
            }
        }
    }

    // 2. Si no hay nada, intentar con meta tags (OpenGraph / Twitter)
    if products.is_empty() {
        let mut name = String::new();
        let mut price = 0.0;
        let mut category = String::new();
        let mut product_url = String::new();

        let meta_selector = Selector::parse("meta").unwrap();
        for meta in document.select(&meta_selector) {
            let property = meta.value().attr("property").or(meta.value().attr("name")).unwrap_or("");
            let content = meta.value().attr("content").unwrap_or("");

            match property {
                "og:title" => name = content.to_string(),
                "product:price:amount" | "og:price:amount" => price = content.parse().unwrap_or(0.0),
                "og:url" => product_url = content.to_string(),
                "product:category" => category = content.to_string(),
                _ => {}
            }
        }

        if !name.is_empty() && price > 0.0 {
            products.push(ParsedProduct { name, price, category, product_url });
        }
    }

    // 3. Si siguen sin resultados, intentar con spans de precio (Shopify HTML)
    if products.is_empty() {
        let mut name = String::new();
        let mut price = 0.0;
        let mut product_url = String::new();

        // Título: og:title o título de la página
        let title_sel = Selector::parse("title").unwrap();
        let meta_sel = Selector::parse("meta").unwrap();

        for meta in document.select(&meta_sel) {
            let prop = meta.value().attr("property").or(meta.value().attr("name")).unwrap_or("");
            let content = meta.value().attr("content").unwrap_or("");
            match prop {
                "og:title" => name = content.to_string(),
                "og:url" => product_url = content.to_string(),
                _ => {}
            }
        }

        if name.is_empty() {
            if let Some(title) = document.select(&title_sel).next() {
                name = title.text().collect::<String>().trim().to_string();
            }
        }

        // Precio: buscar en spans que tengan formato de precio colombiano ($X.XXX.XXX)
        // Shopify usa: .price, [data-price], .pr_price, .orpr, etc.
        let price_selectors = ["[data-price]", ".price__regular .price-item", ".pr_price.orpr", ".price"];
        'outer: for sel_str in &price_selectors {
            if let Ok(sel) = Selector::parse(sel_str) {
                for el in document.select(&sel) {
                    let raw = el.text().collect::<String>();
                    let cleaned = raw.replace('$', "").replace('.', "").replace(',', ".").trim().to_string();
                    if let Ok(p) = cleaned.parse::<f64>() {
                        if p > 0.0 {
                            price = p;
                            break 'outer;
                        }
                    }
                }
            }
        }

        if !name.is_empty() && price > 0.0 && !product_url.is_empty() {
            products.push(ParsedProduct { name, price, category: "Equinos".to_string(), product_url });
        }
    }

    products
}

fn extract_from_json(item: &serde_json::Value) -> Option<ParsedProduct> {
    let name = item["name"].as_str()?.to_string();
    let price = item["offers"]["price"].as_f64()
        .or_else(|| item["offers"]["price"].as_str()?.parse().ok())?;
    
    let category = item["category"].as_str().unwrap_or("").to_string();
    let product_url = item["@id"].as_str()
        .or(item["offers"]["url"].as_str())?
        .to_string();

    Some(ParsedProduct { name, price, category, product_url })
}


pub fn extract_product_links(html: &str) -> Vec<String> {
    use regex::Regex;
    // Capturar el slug de producto de cualquier href que contenga /products/
    // Cubre: /products/slug y /collections/*/products/slug
    let re = Regex::new(r#"href=["'][^"']*?/products/([^"'?#/]+)["']"#).unwrap();
    let mut unique_links = std::collections::HashSet::new();

    for cap in re.captures_iter(html) {
        let slug = &cap[1];
        unique_links.insert(format!("https://tierragro.com/products/{}", slug));
    }

    unique_links.into_iter().collect()
}




