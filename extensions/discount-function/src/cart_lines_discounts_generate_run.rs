use shopify_function::prelude::*;
use shopify_function::Result;
use std::collections::HashMap;

use crate::schema::*;

#[derive(Deserialize, Default, PartialEq)]
pub struct Configuration {
    discount_code: String,
    sku_discounts: HashMap<String, SkuDiscount>,
}

#[derive(Deserialize, PartialEq, Clone)]
pub struct SkuDiscount {
    discount_type: String, // "percentage" or "fixedAmount"
    value: f64, // percentage value or fixed amount
    applies_to_each_item: Option<bool>, // only used for fixed amounts
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

            let discount_config = variant.sku().and_then(|sku| configuration.sku_discounts.get(sku))?;

            let (message, value) = match discount_config.discount_type.as_str() {
                "percentage" => (
                    format!("{}% OFF", discount_config.value),
                    ProductDiscountCandidateValue::Percentage(Percentage {
                        value: Decimal(discount_config.value),
                    }),
                ),
                "fixedAmount" => (
                    format!("${:.2} OFF", discount_config.value),
                    ProductDiscountCandidateValue::FixedAmount(ProductDiscountCandidateFixedAmount {
                        amount: Decimal(discount_config.value),
                        applies_to_each_item: discount_config.applies_to_each_item,
                    }),
                ),
                _ => return None, // Invalid discount type
            };

            Some(ProductDiscountCandidate {
                targets: vec![ProductDiscountCandidateTarget::CartLine(CartLineTarget {
                    id: line.id().clone(),
                    quantity: None,
                })],
                message: Some(message),
                value,
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
                                "FRM-JERS-1": {
                                    "discount_type": "percentage",
                                    "value": 35.0
                                },
                                "FRM-JERS-2": {
                                    "discount_type": "percentage",
                                    "value": 40.0
                                }
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
                                "FRM-JERS-1": {
                                    "discount_type": "percentage",
                                    "value": 35.0
                                },
                                "FRM-JERS-2": {
                                    "discount_type": "percentage",
                                    "value": 40.0
                                }
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

    #[test]
    fn test_discount_with_fixed_amount() -> Result<()> {
        let result = run_function_with_input(
            cart_lines_discounts_generate_run,
            r#"
            {
                "cart": {
                    "lines": [
                        {
                            "id": "gid://Shopify/CartLine/1",
                            "quantity": 2,
                            "cost": {
                                "subtotalAmount": {
                                    "amount": "200.00"
                                }
                            },
                            "merchandise": {
                                "__typename": "ProductVariant",
                                "id": "gid://Shopify/ProductVariant/1",
                                "sku": "FIXED-SKU-1",
                                "product": {
                                    "id": "gid://Shopify/Product/1",
                                    "title": "Fixed Amount Product"
                                }
                            }
                        }
                    ]
                },
                "discount": {
                    "metafield": {
                        "jsonValue": {
                            "discount_code": "FIXEDAMOUNT",
                            "sku_discounts": {
                                "FIXED-SKU-1": {
                                    "discount_type": "fixedAmount",
                                    "value": 10.0,
                                    "applies_to_each_item": true
                                }
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
                    Some("$10.00 OFF".to_string())
                );
            }
            _ => panic!("Expected ProductDiscountsAdd operation"),
        }

        Ok(())
    }
}