variable "location" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

locals {
  storage_account_name = substr(lower(replace("${var.project_name}${var.environment}st", "-", "")), 0, 24)
}

resource "azurerm_storage_account" "this" {
  name                     = local.storage_account_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "projects" {
  name                  = "projects"
  storage_account_id    = azurerm_storage_account.this.id
  container_access_type = "private"
}

resource "azurerm_postgresql_flexible_server" "this" {
  name                = "${var.project_name}-${var.environment}-pg"
  resource_group_name = var.resource_group_name
  location            = var.location
  version             = "14"
  sku_name            = "B_Standard_B1ms"

  administrator_login    = "pgadmin"
  administrator_password = "ChangeM3Now!"

  storage_mb = 32768
}

output "storage_account_name" {
  value = azurerm_storage_account.this.name
}
