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

variable "openai_endpoint" {
  type = string
}

variable "app_insights_instrumentation_key" {
  type = string
}

variable "app_insights_connection_string" {
  type = string
}

locals {
  functions_storage_name = substr(lower(replace("${var.project_name}${var.environment}func", "-", "")), 0, 24)
}

resource "azurerm_storage_account" "functions" {
  name                     = local.functions_storage_name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "functions" {
  name                = "${var.project_name}-${var.environment}-asp"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "this" {
  name                       = "${var.project_name}-${var.environment}-func"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  service_plan_id            = azurerm_service_plan.functions.id
  storage_account_name       = azurerm_storage_account.functions.name
  storage_account_access_key = azurerm_storage_account.functions.primary_access_key

  site_config {}

  app_settings = {
    OPENAI_ENDPOINT                         = var.openai_endpoint
    APPINSIGHTS_INSTRUMENTATIONKEY          = var.app_insights_instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING   = var.app_insights_connection_string
    FUNCTIONS_WORKER_RUNTIME                = "node"
  }
}

output "function_app_url" {
  value = azurerm_linux_function_app.this.default_hostname
}
