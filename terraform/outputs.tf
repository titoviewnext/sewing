output "openai_endpoint" {
  value = module.ai.openai_endpoint
}

output "function_app_url" {
  value = module.api.function_app_url
}

output "aks_cluster_name" {
  value = module.aks.aks_cluster_name
}

output "storage_account_name" {
  value = module.storage.storage_account_name
}

output "app_insights_instrumentation_key" {
  value = module.monitoring.app_insights_instrumentation_key
}
