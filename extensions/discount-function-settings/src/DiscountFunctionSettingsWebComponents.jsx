/* eslint-disable react/self-closing-comp */
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

export default function extension() {
  render(<Extension />, document.body);
}

function Extension() {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [discountRules, setDiscountRules] = useState([]);
  const [discountType, setDiscountType] = useState('percentage');
  const [lastSavedRules, setLastSavedRules] = useState(null);

  useEffect(() => {
    loadMetafields();
  }, []);

  async function loadMetafields() {
    setLoading(true);
    try {
      // For admin extensions, we should use the data API to access current configuration
      const currentValue = shopify.data?.metafield?.value;
      
      if (currentValue) {
        const parsedConfig = JSON.parse(currentValue);
        if (parsedConfig.discounts && Array.isArray(parsedConfig.discounts)) {
          setDiscountRules(parsedConfig.discounts);
          setDiscountType(parsedConfig.discountType || 'percentage');
          setLastSavedRules(parsedConfig.discounts);
        }
      }
      
      if (discountRules.length === 0) {
        addDiscountRule();
      }
    } catch (error) {
      console.error('Error loading metafields:', error);
      addDiscountRule();
    } finally {
      setLoading(false);
    }
  }

  function addDiscountRule() {
    setDiscountRules([...discountRules, { sku: '', value: '' }]);
  }

  function removeDiscountRule(index) {
    setDiscountRules(discountRules.filter((_, i) => i !== index));
  }

  function updateDiscountRule(index, field, value) {
    const newRules = [...discountRules];
    newRules[index][field] = value;
    setDiscountRules(newRules);
  }

  async function saveMetafieldChanges(event) {
    event.preventDefault();
    setErrors({});

    // Validation
    const validationErrors = {};
    discountRules.forEach((rule, index) => {
      if (!rule.sku) {
        validationErrors[`sku_${index}`] = 'SKU is required';
      }
      if (!rule.value || parseFloat(rule.value) <= 0) {
        validationErrors[`value_${index}`] = 'Value must be greater than 0';
      }
      if (discountType === 'percentage' && parseFloat(rule.value) > 100) {
        validationErrors[`value_${index}`] = 'Percentage cannot exceed 100%';
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const configuration = {
      discounts: discountRules.filter(rule => rule.sku && rule.value),
      discountType: discountType
    };

    try {
      // For admin extensions, we use applyMetafieldChange
      await shopify.applyMetafieldChange({
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(configuration),
        type: 'json'
      });
      
      setLastSavedRules(configuration.discounts);
      shopify.toast.show('Discount rules saved successfully');
    } catch (error) {
      console.error('Error saving metafields:', error);
      shopify.toast.show('Failed to save discount rules', { isError: true });
    }
  }

  function resetForm() {
    setDiscountRules(lastSavedRules || [{ sku: '', value: '' }]);
    setErrors({});
  }

  if (loading) {
    return (
      <s-admin-block title="SKU Discount Configuration">
        <s-stack>
          <s-spinner></s-spinner>
          <s-text>Loading discount configuration...</s-text>
        </s-stack>
      </s-admin-block>
    );
  }

  return (
    <s-admin-block title="SKU Discount Configuration">
      <s-form onsubmit={saveMetafieldChanges} onreset={resetForm}>
        <s-stack gap="large">
          {/* Discount Type Selection */}
          <s-section>
            <s-heading>Discount Type</s-heading>
            {/* Since ChoiceList is coming soon, we'll use radio buttons manually */}
            <s-stack gap="small">
              <s-checkbox
                checked={discountType === 'percentage'}
                onchange={() => setDiscountType('percentage')}
              >
                Percentage discount
              </s-checkbox>
              <s-checkbox
                checked={discountType === 'fixed'}
                onchange={() => setDiscountType('fixed')}
              >
                Fixed amount discount
              </s-checkbox>
            </s-stack>
          </s-section>

          {/* SKU Discount Rules - Since Table is not available, use Stack layout */}
          <s-section>
            <s-heading>SKU Discount Rules</s-heading>
            <s-stack gap="base">
              {/* Header */}
              <s-box padding="base" background="subdued" border-radius="base">
                <s-grid columns="200px 150px 150px 100px" gap="base">
                  <s-text font-weight="semibold">SKU</s-text>
                  <s-text font-weight="semibold">
                    {discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
                  </s-text>
                  <s-text font-weight="semibold">Final Price Preview</s-text>
                  <s-text font-weight="semibold">Actions</s-text>
                </s-grid>
              </s-box>
              
              {/* Rows */}
              {discountRules.map((rule, index) => (
                <s-box key={index} padding="base" border="base base solid" border-radius="base">
                  <s-grid columns="200px 150px 150px 100px" gap="base" align="center">
                    <s-text-field
                      name={`sku_${index}`}
                      value={rule.sku}
                      onchange={(e) => updateDiscountRule(index, 'sku', e.target.value)}
                      placeholder="Enter SKU"
                      error={errors[`sku_${index}`]}
                    ></s-text-field>
                    <s-text-field
                      name={`value_${index}`}
                      value={rule.value}
                      onchange={(e) => updateDiscountRule(index, 'value', e.target.value)}
                      placeholder={discountType === 'percentage' ? 'e.g., 10' : 'e.g., 5.00'}
                      error={errors[`value_${index}`]}
                      type="number"
                      min="0"
                      max={discountType === 'percentage' ? "100" : undefined}
                      step="0.01"
                    ></s-text-field>
                    <s-text>
                      {rule.value && (
                        discountType === 'percentage' 
                          ? `${(100 - parseFloat(rule.value))}% of original`
                          : `Original - $${parseFloat(rule.value).toFixed(2)}`
                      )}
                    </s-text>
                    <s-button
                      variant="plain"
                      tone="critical"
                      onclick={() => removeDiscountRule(index)}
                      disabled={discountRules.length === 1}
                    >
                      Remove
                    </s-button>
                  </s-grid>
                </s-box>
              ))}
            </s-stack>
            
            <s-box padding="small">
              <s-button onclick={addDiscountRule} variant="secondary">
                Add another SKU
              </s-button>
            </s-box>
          </s-section>

          {/* Instructions */}
          <s-section>
            <s-stack gap="small">
              <s-heading>Instructions</s-heading>
              <s-ordered-list>
                <li>Enter the SKU of the product you want to discount</li>
                <li>Set the discount {discountType === 'percentage' ? 'percentage' : 'amount'}</li>
                <li>The discount will be applied when customers purchase products with matching SKUs</li>
                <li>For percentage discounts, enter a value between 0 and 100</li>
                <li>For fixed discounts, the amount will be subtracted from the product price</li>
              </s-ordered-list>
            </s-stack>
          </s-section>
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}