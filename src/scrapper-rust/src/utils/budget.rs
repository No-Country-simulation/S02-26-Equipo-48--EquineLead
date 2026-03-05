use rand::Rng;

fn round_up_to_hundred(value: f64) -> f64 {
    (value / 100.0).ceil() * 100.0
}

pub fn generate_user_budget(
    user_type: i32,
    user_name: &str,
    product_price: f64,
    rng: &mut rand::rngs::ThreadRng,
) -> f64 {
    // B2C
    if user_type == 1 {
        if product_price < 100.0 {
            return 100.0;
        }

        return round_up_to_hundred(product_price);
    }

    // B2B
    let name_lower = user_name.to_lowercase();

    let looks_company =
        name_lower.contains("s.a")
        || name_lower.contains("ltda")
        || name_lower.contains("corp")
        || name_lower.contains("inc")
        || name_lower.contains("company");

    let raw_value = if looks_company {
        rng.gen_range(5000.0..60000.0)
    } else {
        rng.gen_range(2000.0..40000.0)
    };

    round_up_to_hundred(raw_value)
}