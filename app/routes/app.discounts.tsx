import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  IndexTable,
  Text,
  Badge,
  InlineStack,
  Button,
  useIndexResourceState,
  EmptyState,
  IndexFilters,
  useSetIndexFiltersMode,
  type IndexFiltersProps,
  type TabProps,
  Tooltip,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { 
  PlusIcon,
  EditIcon,
  ExportIcon,
} from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

interface Discount {
  id: string;
  title: string;
  status: string;
  discountClass: string;
  startsAt: string | null;
  endsAt: string | null;
  asyncUsageCount: number;
  createdAt: string;
  discountId: string;
  codes?: {
    edges: Array<{
      node: {
        code: string;
      };
    }>;
  };
  appDiscountType?: {
    app?: {
      title: string;
      handle?: string;
    };
    functionId: string;
    title: string;
  };
  metafield?: {
    id: string;
    namespace: string;
    key: string;
    value: string;
    jsonValue?: any;
  };
  nodeId?: string;
}

interface GraphQLResponse {
  data?: any;
  errors?: any;
}

interface DebugInfo {
  totalDiscountsQueried: number;
  functionIdUsed: string;
  envFunctionId: string | undefined;
  error?: string;
}

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const { createShopifyApp } = await import("../shopify.server");
  const shopify = createShopifyApp(env);
  const { admin, session } = await shopify.authenticate.admin(request);
  
  const shopHandle = session.shop.replace('.myshopify.com', '');
  
  // Query for ALL discounts first to debug
  const discountsQuery = `
    query {
      discountNodes(first: 100) {
        edges {
          node {
            id
            discount {
              ... on DiscountAutomaticApp {
                title
                status
                discountClass
                startsAt
                endsAt
                asyncUsageCount
                createdAt
                discountId
                appDiscountType {
                  app {
                    title
                    handle
                  }
                  functionId
                  title
                }
              }
              ... on DiscountCodeApp {
                title
                status
                discountClass
                startsAt
                endsAt
                asyncUsageCount
                createdAt
                discountId
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
                appDiscountType {
                  app {
                    title
                    handle
                  }
                  functionId
                  title
                }
              }
              ... on DiscountAutomaticBasic {
                title
                status
                discountClass
                startsAt
                endsAt
                asyncUsageCount
                createdAt
              }
              ... on DiscountCodeBasic {
                title
                status
                discountClass
                startsAt
                endsAt
                asyncUsageCount
                createdAt
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  // Also query for app info
  const appQuery = `
    query {
      app {
        id
        title
        handle
        developerName
      }
    }
  `;
  
  let discounts: Discount[] = [];
  let functionId = env.SHOPIFY_DISCOUNT_FUNCTION_ID || '';
  let appInfo: any = null;
  
  try {
    console.log('Function ID from env:', functionId);
    
    // First, query app info
    try {
      const appResponse = await admin.graphql(appQuery);
      const appData = await appResponse.json() as GraphQLResponse;
      console.log('App info:', JSON.stringify(appData, null, 2));
      
      if (appData?.data?.app) {
        appInfo = appData.data.app;
        console.log('App info found:', appInfo.title);
      }
    } catch (appError) {
      console.error('Error fetching app info:', appError);
    }
    
    // Now query ALL discounts
    const response = await admin.graphql(discountsQuery);
    const data = await response.json() as GraphQLResponse;
    
    console.log('GraphQL response:', JSON.stringify(data, null, 2));
    
    // Check for errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }
    
    if (data?.data?.discountNodes?.edges) {
      // Get ALL discounts first, mapping node ID to discount
      const allDiscounts = data.data.discountNodes.edges
        .map((edge: any) => ({
          nodeId: edge.node.id,
          ...edge.node.discount
        }))
        .filter((discount: any) => discount !== null);
      
      console.log('Total discounts found:', allDiscounts.length);
      
      // Log ALL discounts to see what's there
      allDiscounts.forEach((discount: any) => {
        console.log('Discount found:', {
          nodeId: discount.nodeId,
          title: discount.title,
          type: discount.discountClass,
          hasAppDiscountType: !!discount.appDiscountType,
          functionId: discount.appDiscountType?.functionId,
          appTitle: discount.appDiscountType?.app?.title,
        });
      });
      
      // Now filter for our app's discounts
      discounts = allDiscounts.filter((discount: any) => {
        // Check if it's an app discount
        if (!discount.appDiscountType) {
          console.log(`Skipping ${discount.title} - not an app discount`);
          return false;
        }
        
        // Check if it matches our function ID
        const matchesFunctionId = discount.appDiscountType.functionId === functionId;
        console.log(`Discount ${discount.title}: functionId=${discount.appDiscountType.functionId}, matches=${matchesFunctionId}`);
        
        return matchesFunctionId;
      }).map((discount: any) => ({
        ...discount,
        discountId: discount.discountId || discount.nodeId // Use discountId if available, otherwise use nodeId
      }));
      
      console.log(`Filtered to ${discounts.length} app discounts with function ID: ${functionId}`);
    }
  } catch (error) {
    console.error('Error fetching discounts:', error);
    
    // Return error details in the response
    return {
      discounts: [],
      shopHandle,
      functionId: functionId || env.SHOPIFY_DISCOUNT_FUNCTION_ID || '',
      appInfo,
      debugInfo: {
        totalDiscountsQueried: 0,
        functionIdUsed: functionId,
        envFunctionId: env.SHOPIFY_DISCOUNT_FUNCTION_ID,
        error: error instanceof Error ? error.message : String(error)
      } as DebugInfo
    };
  }
  
  // If no function ID from discounts, try to get it from functions query
  if (!functionId) {
    try {
      const functionsQuery = `
        query {
          shopifyFunctions(first: 25, apiType: DISCOUNT) {
            edges {
              node {
                id
                title
                apiType
                app {
                  id
                  title
                }
              }
            }
          }
        }
      `;
      
      const functionsResponse = await admin.graphql(functionsQuery);
      const functionsData = await functionsResponse.json() as GraphQLResponse;
      
      if (functionsData?.data?.shopifyFunctions?.edges?.length > 0) {
        const firstFunction = functionsData.data.shopifyFunctions.edges[0].node;
        functionId = firstFunction.id;
        console.log('Using function ID from functions query:', functionId);
      }
    } catch (error) {
      console.error('Error fetching function ID:', error);
    }
  }
  
  return {
    discounts,
    shopHandle,
    functionId: functionId || env.SHOPIFY_DISCOUNT_FUNCTION_ID || '',
    appInfo,
    debugInfo: {
      totalDiscountsQueried: discounts.length,
      functionIdUsed: functionId,
      envFunctionId: env.SHOPIFY_DISCOUNT_FUNCTION_ID
    } as DebugInfo
  };
};

export default function Discounts() {
  const { discounts, shopHandle, functionId, appInfo, debugInfo } = useLoaderData<typeof loader>();
  
  // Client-side debugging
  console.log('Client side - Function ID:', functionId);
  console.log('Client side - Discounts received:', discounts.length);
  console.log('Client side - Discounts:', discounts);
  console.log('Client side - App Info:', appInfo);
  console.log('Client side - Debug Info:', debugInfo);
  
  if (debugInfo && debugInfo.error) {
    console.error('CLIENT SIDE ERROR:', debugInfo.error);
  }
  
  // State for filters
  const [queryValue, setQueryValue] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [sortSelected, setSortSelected] = useState(['createdAt desc']);
  
  // Filter discounts based on selected tab
  const getFilteredDiscounts = () => {
    // Always start with a fresh copy of discounts
    let filtered = [...discounts];
    
    // Apply tab filter
    switch (selectedTab) {
      case 1: // Active tab
        filtered = filtered.filter(discount => discount.status === 'ACTIVE');
        break;
      case 2: // Scheduled tab
        filtered = filtered.filter(discount => discount.status === 'SCHEDULED');
        break;
      // case 0 is "All" - no filtering needed
    }
    
    // Apply search query filter
    if (queryValue) {
      filtered = filtered.filter(discount => 
        discount.title.toLowerCase().includes(queryValue.toLowerCase())
      );
    }
    
    return filtered.filter((discount): discount is Discount => discount !== null);
  };
  
  const filteredDiscounts = getFilteredDiscounts();
  
  // Setup resource state for selection
  const resourceIDResolver = (discount: Discount) => discount.discountId || discount.id;
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(filteredDiscounts as any[], {
    resourceIDResolver,
  });
  
  const handleCreateDiscount = () => {
    const discountUrl = `https://admin.shopify.com/store/${shopHandle}/discounts/new/app?functionId=${functionId}`;
    window.open(discountUrl, '_blank');
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatDateForCSV = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return { date: '—', time: '—', relative: '—' };
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // Format date
    const dateFormatted = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time
    const timeFormatted = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Relative time
    let relative = '';
    // Check if dates are on the same calendar day
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayDiff = Math.floor((nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 0) {
      relative = 'Today';
    } else if (dayDiff === 1) {
      relative = 'Yesterday';
    } else if (dayDiff < 7) {
      relative = `${dayDiff} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      relative = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      relative = `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      relative = `${years} year${years > 1 ? 's' : ''} ago`;
    }
    
    return { date: dateFormatted, time: timeFormatted, relative };
  };
  
  const getStatusBadge = (status: string) => {
    const tone = status === 'ACTIVE' ? 'success' : 'info';
    return <Badge tone={tone}>{status}</Badge>;
  };
  
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
  
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  
  const tabs: TabProps[] = [
    {
      content: `All (${discounts.length})`,
      onAction: () => {
        console.log('Switching to All tab, total discounts:', discounts.length);
        setSelectedTab(0);
      },
      id: 'all-discounts',
    },
    {
      content: `Active (${discounts.filter(d => d.status === 'ACTIVE').length})`,
      onAction: () => {
        console.log('Switching to Active tab');
        setSelectedTab(1);
      },
      id: 'active-discounts',
    },
    {
      content: `Scheduled (${discounts.filter(d => d.status === 'SCHEDULED').length})`,
      onAction: () => {
        console.log('Switching to Scheduled tab');
        setSelectedTab(2);
      },
      id: 'scheduled-discounts',
    },
  ];
  
  const sortOptions: IndexFiltersProps['sortOptions'] = [
    { label: 'Created', value: 'createdAt desc', directionLabel: 'Newest first' },
    { label: 'Created', value: 'createdAt asc', directionLabel: 'Oldest first' },
    { label: 'Start date', value: 'startsAt desc', directionLabel: 'Newest first' },
    { label: 'Start date', value: 'startsAt asc', directionLabel: 'Oldest first' },
    { label: 'Title', value: 'title asc', directionLabel: 'A-Z' },
    { label: 'Title', value: 'title desc', directionLabel: 'Z-A' },
  ];
  
  // Handle sort change properly
  const handleSortChange = useCallback((selected: string[]) => {
    console.log('Sort changed to:', selected);
    setSortSelected(selected);
  }, []);
  
  // Parse sort value with proper error handling
  const sortParts = sortSelected[0]?.split(' ') || ['createdAt', 'desc'];
  const [sortValue, sortDirection] = sortParts;
  
  // Sort the filtered discounts
  const sortedDiscounts = [...filteredDiscounts].sort((a, b) => {
    if (!a || !b) return 0;
    
    const getValue = (discount: Discount | null) => {
      if (!discount) return '';
      
      switch (sortValue) {
        case 'createdAt':
          return discount.createdAt ? new Date(discount.createdAt).getTime() : 0;
        case 'startsAt':
          return discount.startsAt ? new Date(discount.startsAt).getTime() : 0;
        case 'title':
          return discount.title?.toLowerCase() || '';
        default:
          return '';
      }
    };
    
    const aValue = getValue(a);
    const bValue = getValue(b);
    
    // Handle numeric vs string comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // String comparison
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  const handleExport = useCallback(() => {
    // Export only selected discounts, or all if none selected
    const discountsToExport = selectedResources.length > 0 
      ? sortedDiscounts.filter(discount => {
          const resourceId = discount.discountId || discount.id;
          return selectedResources.includes(resourceId);
        })
      : sortedDiscounts;
    
    // Prepare CSV data
    const csvHeaders = ['Title', 'Status', 'Created Date', 'Start Date', 'End Date', 'Usage Count', 'Code'];
    const csvRows = discountsToExport.map(discount => {
      const code = discount.codes?.edges?.[0]?.node?.code || '';
      const createdDateTime = formatDateTime(discount.createdAt);
      return [
        discount.title,
        discount.status,
        createdDateTime.date !== '—' ? `${createdDateTime.date} ${createdDateTime.time}` : '',
        formatDateForCSV(discount.startsAt),
        formatDateForCSV(discount.endsAt),
        discount.asyncUsageCount.toString(),
        code
      ];
    });
    
    // Convert to CSV format
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');
    
    // Create blob and download with UTF-8 BOM for better Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const exportCount = selectedResources.length > 0 ? selectedResources.length : sortedDiscounts.length;
    const filename = `discounts_${shopHandle}_${exportCount}_items_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [sortedDiscounts, shopHandle, selectedResources]);
  
  const emptyStateMarkup = (
    <EmptyState
      heading="Create your first SKU discount"
      action={{
        content: "Create Discount",
        icon: PlusIcon,
        onAction: handleCreateDiscount,
      }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>
        Start creating targeted discounts for specific products using their SKU codes.
      </p>
    </EmptyState>
  );
  
  const resourceName = {
    singular: 'discount',
    plural: 'discounts',
  };
  
  const rowMarkup = sortedDiscounts.map((discount, index) => {
    if (!discount) return null;
    const resourceId = discount.discountId || discount.id;
    const dateTime = formatDateTime(discount.createdAt);
    const sourceTable = discount.discountClass === 'PRODUCT' ? 'Product' : 
                       discount.discountClass === 'ORDER' ? 'Order' : 
                       discount.discountClass === 'SHIPPING' ? 'Shipping' : 'Custom';
    
    return (
    <IndexTable.Row
      id={resourceId}
      key={resourceId}
      selected={selectedResources.includes(resourceId)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {discount.title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{getStatusBadge(discount.status)}</IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200" align="start" blockAlign="center">
          <Text variant="bodyMd" as="span">
            {dateTime.date} at {dateTime.time}
          </Text>
          {(dateTime.relative === 'Today' || dateTime.relative === 'Yesterday') && (
            <Badge tone="info" size="small">
              {dateTime.relative}
            </Badge>
          )}
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {formatDate(discount.startsAt)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {formatDate(discount.endsAt)}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Box width="100%" padding="200">
          <InlineStack align="center" blockAlign="center">
            <Text variant="bodyMd" as="span" fontWeight="medium">
              {discount.asyncUsageCount}
            </Text>
          </InlineStack>
        </Box>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack align="end" gap="200">
          <Button
            variant="tertiary"
            icon={EditIcon}
            onClick={() => {
              // Extract the ID number from the GID
              const gid = discount.discountId || discount.id;
              const idMatch = gid.match(/(\d+)$/);
              const numericId = idMatch ? idMatch[1] : '';
              
              window.open(
                `https://admin.shopify.com/store/${shopHandle}/discounts/${numericId}`,
                '_blank'
              );
            }}
            accessibilityLabel={`Edit ${discount.title}`}
          />
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
  });
  
  return (
    <Page
      title="SKU Discounts"
      primaryAction={{
        content: "Create Discount",
        icon: PlusIcon,
        onAction: handleCreateDiscount,
      }}
      secondaryActions={[
        {
          content: 'Go to Discount Page',
          accessibilityLabel: 'Go to Shopify discount page',
          onAction: () => {
            window.open(
              `https://admin.shopify.com/store/${shopHandle}/discounts`,
              '_blank'
            );
          },
        },
        {
          content: 'Export',
          icon: ExportIcon,
          accessibilityLabel: 'Export discounts to CSV',
          onAction: handleExport,
        }
      ]}
    >
      <Card>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Search discounts"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={handleQueryValueRemove}
          onSort={handleSortChange}
          tabs={tabs}
          selected={selectedTab}
          canCreateNewView={false}
          filters={[]}
          appliedFilters={[]}
          onClearAll={() => {}}
          mode={mode}
          setMode={setMode}
        />
        {sortedDiscounts.length === 0 ? (
          emptyStateMarkup
        ) : (
          <IndexTable
            resourceName={resourceName}
            itemCount={sortedDiscounts.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Title' },
              { title: 'Status' },
              { title: 'Created' },
              { title: 'Start date' },
              { title: 'End date' },
              { title: 'Usage Count', alignment: 'center' },
              { title: 'Actions', alignment: 'end' },
            ]}
            selectable={true}
          >
            {rowMarkup}
          </IndexTable>
        )}
      </Card>
    </Page>
  );
}

import type { Env } from "../../server";