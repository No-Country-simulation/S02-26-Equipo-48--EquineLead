use serde::Serialize;

// ================= USER =================

#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
pub struct CreateUserRequest {
    pub user_type: i32,
    pub user_budget: f64,
    pub user_name: String,
    pub user_phone: String,
}

// ================= PRODUCT =================

#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
pub struct CreateProductRequest {
    pub product_price: f64,
    pub product_name: String,
    pub product_category: String,
    pub product_url: String,
}


// ================= INTERACTION =================

#[derive(Serialize)]
#[serde(rename_all = "PascalCase")]
pub struct CreateInteractionRequest {
    pub user_id: i32,
    pub product_id: i32,
    pub interaction_source: i32,
    pub interaction_type: i32,
}

// ======== RESPUESTAS (para capturar IDs) ========  


#[derive(serde::Deserialize)]
pub struct UserResponse {
    #[serde(rename = "userId")]
    pub user_id: i32,
}

#[derive(serde::Deserialize)]
pub struct ProductResponse {
    #[serde(rename = "productId")]
    pub product_id: i32,
}

#[derive(serde::Deserialize)]
pub struct InteractionResponse {
    #[serde(rename = "interactionId")]
    pub interaction_id: i32
}
