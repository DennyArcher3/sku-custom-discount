use shopify_function::prelude::*;
use shopify_function::Result;
use std::collections::HashMap;

use crate::schema::*;

#[derive(Deserialize, Default, PartialEq)]
pub struct Configuration {
    discount_code: String,
    sku_discounts: HashMap<String, f64>, // For now, we'll only support percentage discounts
}

#[shopify_function]
fn cart_lines_discounts_generate_run(
    input: cart_lines_discounts_generate_run::Input,
) -> Result<CartLinesDiscountsGenerateRunResult> {
    let operations = input
        .cart()
        .lines()
        .iter()
        .filter_map(|line| {
            let variant = match &line.merchandise() {
                cart_lines_discounts_generate_run::input::cart::lines::Merchandise::ProductVariant(variant) => variant,
                _ => return None,
            };

            let configuration: &Configuration = match input.discount().metafield() {
                Some(metafield) => metafield.json_value(),
                None => return None,
            };

            let discount_percentage = variant.sku().and_then(|sku| configuration.sku_discounts.get(sku))?;

            Some(ProductDiscountCandidate {
                targets: vec![ProductDiscountCandidateTarget::CartLine(CartLineTarget {
                    id: line.id().clone(),
                    quantity: None,
                })],
                message: Some(format!("{}% OFF", discount_percentage)),
                value: ProductDiscountCandidateValue::Percentage(Percentage {
                    value: Decimal(*discount_percentage),
                }),
                associated_discount_code: None,
            })
        })
        .collect::<Vec<ProductDiscountCandidate>>();

    if operations.is_empty() {
        return Ok(CartLinesDiscountsGenerateRunResult { operations: vec![] });
    }

    Ok(CartLinesDiscountsGenerateRunResult {
        operations: vec![CartOperation::ProductDiscountsAdd(
            ProductDiscountsAddOperation {
                selection_strategy: ProductDiscountSelectionStrategy::All,
                candidates: operations,
            },
        )],
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use shopify_function::{run_function_with_input, Result};

    #[test]
    fn test_discount_with_sku_match() -> Result<()> {
        let result = run_function_with_input(
            cart_lines_discounts_generate_run,
            r#"
            {
                "cart": {
                    "lines": [
                        {
                            "id": "gid://Shopify/CartLine/1",
                            "quantity": 1,
                            "cost": {
                                "subtotalAmount": {
                                    "amount": "100.00"
                                }
                            },
                            "merchandise": {
                                "__typename": "ProductVariant",
                                "id": "gid://Shopify/ProductVariant/1",
                                "sku": "FRM-JERS-1",
                                "product": {
                                    "id": "gid://Shopify/Product/1",
                                    "title": "Jersey Frame 1"
                                }
                            }
                        }
                    ]
                },
                "discount": {
                    "metafield": {
                        "jsonValue": {
                            "discount_code": "SUMMERFRAMING",
                            "sku_discounts": {
                                "FRM-JERS-1": 35.0,
                                "FRM-JERS-2": 40.0
                            }
                        }
                    }
                }
            }
            "#,
        )?;
        let operations = result.operations;

        assert_eq!(operations.len(), 1);
        match &operations[0] {
            CartOperation::ProductDiscountsAdd(op) => {
                assert_eq!(op.candidates.len(), 1);
                assert_eq!(
                    op.candidates[0].message,
                    Some("35% OFF".to_string())
                );
            }
            _ => panic!("Expected ProductDiscountsAdd operation"),
        }

        Ok(())
    }

    #[test]
    fn test_no_discount_without_matching_sku() -> Result<()> {
        let result = run_function_with_input(
            cart_lines_discounts_generate_run,
            r#"
            {
                "cart": {
                    "lines": [
                        {
                            "id": "gid://Shopify/CartLine/1",
                            "quantity": 1,
                            "cost": {
                                "subtotalAmount": {
                                    "amount": "100.00"
                                }
                            },
                            "merchandise": {
                                "__typename": "ProductVariant",
                                "id": "gid://Shopify/ProductVariant/1",
                                "sku": "DIFFERENT-SKU",
                                "product": {
                                    "id": "gid://Shopify/Product/1",
                                    "title": "Different Product"
                                }
                            }
                        }
                    ]
                },
                "discount": {
                    "metafield": {
                        "jsonValue": {
                            "discount_code": "SUMMERFRAMING",
                            "sku_discounts": {
                                "FRM-JERS-1": 35.0,
                                "FRM-JERS-2": 40.0
                            }
                        }
                    }
                }
            }
            "#,
        )?;

        assert_eq!(result.operations.len(), 0);
        Ok(())
    }
}