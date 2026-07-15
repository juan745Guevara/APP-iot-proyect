export function matchesTenantZona(
  payload: { tenant_id?: string; zona_id?: string },
  tenantId?: string | null,
  zonaId?: string | null
): boolean {
  if (payload.tenant_id && tenantId && payload.tenant_id !== tenantId) {
    return false;
  }
  if (payload.zona_id && zonaId && payload.zona_id !== zonaId) {
    return false;
  }
  return true;
}
