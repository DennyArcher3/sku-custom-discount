import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import type { Env } from "../../server";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  Banner,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  BlockStack,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { useState, useEffect } from "react";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const { createShopifyApp } = await import("../shopify.server");
  const shopify = createShopifyApp(env);
  const { session } = await shopify.authenticate.admin(request);
  
  // Load existing settings from database
  let settings = {
    defaultDiscountType: 'fixed',
    enableBulkImport: true,
    enablePreview: true,
    maxSkusPerDiscount: 100,
    notificationEmail: '',
  };
  
  try {
    const result = await env.DB.prepare(
      "SELECT * FROM app_settings WHERE shop = ?"
    ).bind(session.shop).first();
    
    if (result) {
      settings = JSON.parse(result.settings as string);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return json({ settings, shop: session.shop });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { env } = context as { env: Env };
  const { createShopifyApp } = await import("../shopify.server");
  const shopify = createShopifyApp(env);
  const { session } = await shopify.authenticate.admin(request);
  
  const formData = await request.formData();
  
  const settings = {
    defaultDiscountType: formData.get('defaultDiscountType') as string,
    enableBulkImport: formData.get('enableBulkImport') === 'true',
    enablePreview: formData.get('enablePreview') === 'true',
    maxSkusPerDiscount: parseInt(formData.get('maxSkusPerDiscount') as string, 10),
    notificationEmail: formData.get('notificationEmail') as string,
  };
  
  try {
    // Check if settings exist
    const existing = await env.DB.prepare(
      "SELECT id FROM app_settings WHERE shop = ?"
    ).bind(session.shop).first();
    
    if (existing) {
      // Update existing settings
      await env.DB.prepare(
        "UPDATE app_settings SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE shop = ?"
      ).bind(JSON.stringify(settings), session.shop).run();
    } else {
      // Insert new settings
      await env.DB.prepare(
        "INSERT INTO app_settings (shop, settings) VALUES (?, ?)"
      ).bind(session.shop, JSON.stringify(settings)).run();
    }
    
    return json({ success: true, settings });
  } catch (error) {
    console.error('Error saving settings:', error);
    return json({ success: false, error: 'Failed to save settings' });
  }
};

export default function Settings() {
  const { settings: initialSettings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  const [settings, setSettings] = useState(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    if (actionData?.success && 'settings' in actionData && actionData.settings) {
      setSettings(actionData.settings);
      setHasChanges(false);
    }
  }, [actionData]);
  
  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };
  
  const isLoading = navigation.state === 'submitting';
  
  return (
    <Page
      title="Settings"
    >
      <Layout>
        <Layout.Section>
          {actionData?.success && (
            <Banner tone="success" onDismiss={() => {}}>
              Settings saved successfully!
            </Banner>
          )}
          
          {actionData && 'error' in actionData && actionData.error && (
            <Banner tone="critical" onDismiss={() => {}}>
              {actionData.error}
            </Banner>
          )}
          
          <Card>
            <Form method="post">
              <FormLayout>
                <Text variant="headingMd" as="h2">
                  Discount Configuration
                </Text>
                
                <Select
                  label="Default Discount Type"
                  options={[
                    { label: 'Percentage', value: 'percentage' },
                    { label: 'Fixed Amount', value: 'fixed' },
                  ]}
                  value={settings.defaultDiscountType}
                  onChange={(value) => handleChange('defaultDiscountType', value)}
                  name="defaultDiscountType"
                />
                
                <TextField
                  label="Maximum SKUs per Discount"
                  type="number"
                  value={settings.maxSkusPerDiscount.toString()}
                  onChange={(value) => handleChange('maxSkusPerDiscount', value)}
                  name="maxSkusPerDiscount"
                  helpText="The maximum number of SKUs that can be added to a single discount"
                  autoComplete="off"
                />
                
                <Divider />
                
                <Text variant="headingMd" as="h2">
                  Features
                </Text>
                
                <BlockStack gap="400">
                  <Checkbox
                    label="Enable Bulk Import"
                    checked={settings.enableBulkImport}
                    onChange={(value) => handleChange('enableBulkImport', value)}
                    helpText="Allow importing multiple SKUs from CSV files"
                  />
                  <input
                    type="hidden"
                    name="enableBulkImport"
                    value={settings.enableBulkImport.toString()}
                  />
                  
                  <Checkbox
                    label="Enable Live Preview"
                    checked={settings.enablePreview}
                    onChange={(value) => handleChange('enablePreview', value)}
                    helpText="Show which products will be affected before saving the discount"
                  />
                  <input
                    type="hidden"
                    name="enablePreview"
                    value={settings.enablePreview.toString()}
                  />
                </BlockStack>
                
                <Divider />
                
                <Text variant="headingMd" as="h2">
                  Notifications
                </Text>
                
                <TextField
                  label="Notification Email"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(value) => handleChange('notificationEmail', value)}
                  name="notificationEmail"
                  helpText="Receive notifications about discount usage and errors"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
                
                <InlineStack gap="300" align="end">
                  <Button
                    variant="primary"
                    submit
                    loading={isLoading}
                    disabled={!hasChanges}
                  >
                    Save Settings
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
        
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">
                About Settings
              </Text>
              <Text variant="bodyMd" as="p">
                Configure how SKU discounts work in your store. These settings apply to all new discounts you create.
              </Text>
              <Text variant="bodyMd" as="p">
                Changes to these settings won't affect existing discounts.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}