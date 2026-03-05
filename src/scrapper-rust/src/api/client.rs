use reqwest::Client;
use crate::models::*;

//const BASE_URL: &str = "http://localhost:7016";

//====================================================================
//                                      USER
//====================================================================
pub async fn create_user(
    client: &Client,
    base_url: &str,
    user: &CreateUserRequest,
) -> Result<i32, Box<dyn std::error::Error + Send + Sync>> {
    
    //Control debug
    println!(
    "USER JSON SENT: {}",
    serde_json::to_string(user).unwrap()
    );

    let res = client
        .post(format!("{}/api/User", base_url))
        .json(user)
        .send()
        .await?;

    let text = res.text().await?;
    println!("RESPONSE RAW: {}", text);

    let body: UserResponse = serde_json::from_str(&text)?;
    Ok(body.user_id)
}

//====================================================================
//                                      PRODUCT
//====================================================================
pub async fn create_product(
    client: &Client,
    base_url: &str,
    product: &CreateProductRequest,
) -> Result<i32, Box<dyn std::error::Error + Send + Sync>> {

    //Control debug
    println!(
    "PRODUCT JSON SENT: {}",
    serde_json::to_string(product).unwrap()
    );

    let res = client
        .post(format!("{}/api/Product", base_url))
        .json(product)
        .send()
        .await?;

        let status = res.status();
        let text = res.text().await?;

        println!("STATUS: {}", status);
        println!("RESPONSE RAW PRODUCT: {}", text);

        // Ahora parseas desde el string
        let body: ProductResponse = serde_json::from_str(&text)?;

    Ok(body.product_id)
}


//====================================================================
//                                      INTERACTION
//====================================================================
pub async fn create_interaction(
    client: &Client,
    base_url: &str,
    interaction: &CreateInteractionRequest,
) -> Result<i32, Box<dyn std::error::Error + Send + Sync>>{

    //Control debug
    println!(
    "INTERACTION JSON SENT: {}",
    serde_json::to_string(interaction).unwrap()
    );

    let res = client
        .post(format!("{}/api/Interaction", base_url))
        .json(interaction)
        .send()
        .await?;

        let status = res.status();
        let text = res.text().await?;

        println!("STATUS: {}", status);
        println!("RESPONSE RAW INTERACTION: {}", text);
        
        let body: InteractionResponse = serde_json::from_str(&text)?;

    Ok(body.interaction_id)

}
