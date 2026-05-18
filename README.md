# AI Software Builder Platform (ASBP)

## Objetivo

AI Software Builder Platform (ASBP) es una plataforma para acelerar la construcción de software a partir de requerimientos de negocio, pasando siempre por un DSL estructurado antes de generar código.

## Arquitectura

```text
Frontend (Next.js)
   ↓
API Gateway (APIM)
   ↓
Backend (Azure Functions)
   ↓
Orchestrator (Durable Functions)
   ↓
AI Agents (Azure OpenAI)
   ↓
DSL Engine (modelo intermedio)
   ↓
Code Generators (templates)
   ↓
Execution Sandbox (AKS)
   ↓
Storage (Blob + PostgreSQL)
```

## Stack tecnológico

- Next.js
- Azure Functions
- Durable Functions
- Azure OpenAI
- AKS (Azure Kubernetes Service)
- Terraform

## Setup

1. Clonar el repositorio.
2. Configurar variables de entorno para Azure/OpenAI.
3. Inicializar Terraform:
   ```bash
   cd terraform
   terraform init
   terraform plan
   ```
4. Revisar y adaptar los módulos según el entorno objetivo.
5. Implementar la lógica de runtime de los agentes y orquestador según las necesidades del proyecto.

## Documentación

- [Business Case](docs/business-case.md)
- [Statement of Work](docs/sow.md)
- [Enterprise Engineering Framework](docs/eef.md)
- [Operating Procedures & Architecture](docs/opa.md)
