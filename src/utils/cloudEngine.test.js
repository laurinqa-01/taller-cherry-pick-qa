// src/utils/cloudEngine.test.js
import { syncData } from './cloudEngine.js';

describe('Auditoría de Calidad (Multi-Testing QA) - SENA CBA', () => {

  // --- PRUEBA 1: Validación Estricta de Esquemas (Schema Testing) ---
  test('Prueba 1: Debe validar que el esquema devuelto sea exactamente el esperado', async () => {
    // Simulamos un cliente de Supabase exitoso que devuelve la estructura exacta
    const mockSupabaseSuccess = {
      from: () => ({
        insert: () => ({
          select: async () => ({
            data: [{
              id: 'd9b04961-4191-4cf1-923f-e8810c242096',
              device_os: 'Android',
              payload: { bateria: 80, red: '4G' },
              status_code: 201
            }],
            error: null
          })
        })
      })
    };

    const data = await syncData(mockSupabaseSuccess);

    // El criterio: El test debe fallar si falta el status_code o si el esquema no cuadra
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        device_os: expect.any(String),
        payload: expect.objectContaining({
          bateria: expect.any(Number),
          red: expect.any(String)
        }),
        status_code: expect.any(Number) // Si este falta, el test falla automáticamente
      })
    );
  });

  // --- PRUEBA 2: Resiliencia ante Errores 401 (Simulación de Crisis) ---
  test('Prueba 2: Debe atrapar el error 401 de PostgREST y retornar [] sin crashear la app', async () => {
    // Clonamos la lógica inyectando un error artificial de API key inválida (401)
    const mockSupabase401 = {
      from: () => ({
        insert: () => ({
          select: async () => ({
            data: null,
            error: { message: 'Invalid API Key', code: 'PGRST301' } // Simulación del fantasma del 401
          })
        })
      })
    };

    const result = await syncData(mockSupabase401);

    // El criterio: El test NO debe romperse, y debe verificar que retornó un array vacío []
    expect(result).toEqual([]);
  });

  // --- PRUEBA 3: Tiempos de Respuesta (Performance Testing) ---
  test('Prueba 3: Debe fallar si la consulta a Supabase tarda más de 1500ms', async () => {
    const mockSupabaseFast = {
      from: () => ({
        insert: () => ({
          select: async () => {
            await new Promise(resolve => setTimeout(resolve, 50)); 
            return { data: [{}], error: null };
          }
        })
      })
    };

    const startTime = Date.now();
    await syncData(mockSupabaseFast);
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(1500);
  }, 1500); // <-- Límite estricto asignado directamente a Jest para entornos ES Modules

});