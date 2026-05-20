# Operating Procedures & Architecture (OPA) - ASBP

## Flujo estándar

Usuario define requerimiento → Sistema genera DSL → Genera código → Deploy sandbox → Usuario itera

## Ciclo de vida

Create → Generate → Validate → Execute → Iterate → Deploy

## Testing

- Unit tests generados automáticamente
- Validación runtime
- QA agent para consistencia contra DSL

## Despliegue

- Sandbox → Staging → Producción
- CI/CD automatizado
- Rollback automático

## Arquitectura técnica Azure

```text
Usuario/UI (Next.js)
   ↓
API Management
   ↓
Azure Functions + Durable Functions
   ↓
Azure OpenAI + DSL/Generators
   ↓
AKS Sandbox
   ↓
Blob Storage + PostgreSQL
```

## Monitorización

- Logs centralizados
- Métricas de uso IA
- Análisis de fallos de generación
