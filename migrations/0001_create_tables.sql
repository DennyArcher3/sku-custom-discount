-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop TEXT UNIQUE NOT NULL,
  installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uninstalled_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create installations log table
CREATE TABLE IF NOT EXISTS installation_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('install', 'uninstall', 'reinstall')),
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create app_settings table for any shop-specific settings
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop TEXT UNIQUE NOT NULL,
  settings TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_shops_shop ON shops(shop);
CREATE INDEX idx_installation_logs_shop ON installation_logs(shop);
CREATE INDEX idx_app_settings_shop ON app_settings(shop);