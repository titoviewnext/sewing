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

resource "azurerm_log_analytics_workspace" "this" {
  name                = "${var.project_name}-${var.environment}-law"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "this" {
  name                = "${var.project_name}-${var.environment}-appi"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.this.id
}

output "app_insights_instrumentation_key" {
  value = azurerm_application_insights.this.instrumentation_key
}

output "app_insights_connection_string" {
  value = azurerm_application_insights.this.connection_string
}
