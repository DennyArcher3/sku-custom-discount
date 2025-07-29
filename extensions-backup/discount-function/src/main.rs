use shopify_function::prelude::*;
use std::process;

pub mod cart_lines_discounts_generate_run;

#[typegen("schema.graphql")]
pub mod schema {
    #[query("src/cart_lines_discounts_generate_run.graphql", custom_scalar_overrides = {"Input.discount.metafield.jsonValue" => super::cart_lines_discounts_generate_run::Configuration})]
    pub mod cart_lines_discounts_generate_run {}
}

fn main() {
    eprintln!("Please invoke a named export.");
    process::exit(1);
}