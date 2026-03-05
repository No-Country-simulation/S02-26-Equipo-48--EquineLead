use reqwest::Client;

pub async fn fetch_page(client: &Client, url: &str) -> Result<String, reqwest::Error> {
    let res = client.get(url).send().await?;
    let body = res.text().await?;
    Ok(body)
}