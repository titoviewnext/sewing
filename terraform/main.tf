resource "azurerm_resource_group" "this" {
  name     = var.resource_group_name
  location = var.location
}

module "network" {
  source              = "./modules/network"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  project_name        = var.project_name
  environment         = var.environment
}

module "storage" {
  source              = "./modules/storage"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  project_name        = var.project_name
  environment         = var.environment
}

module "ai" {
  source              = "./modules/ai"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  project_name        = var.project_name
  environment         = var.environment
}

module "monitoring" {
  source              = "./modules/monitoring"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  project_name        = var.project_name
  environment         = var.environment
}

module "api" {
  source                                 = "./modules/api"
  location                               = var.location
  resource_group_name                    = azurerm_resource_group.this.name
  project_name                           = var.project_name
  environment                            = var.environment
  openai_endpoint                        = module.ai.openai_endpoint
  app_insights_instrumentation_key       = module.monitoring.app_insights_instrumentation_key
  app_insights_connection_string         = module.monitoring.app_insights_connection_string
}

module "aks" {
  source              = "./modules/aks"
  location            = var.location
  resource_group_name = azurerm_resource_group.this.name
  project_name        = var.project_name
  environment         = var.environment
  subnet_id           = module.network.aks_subnet_id
}
