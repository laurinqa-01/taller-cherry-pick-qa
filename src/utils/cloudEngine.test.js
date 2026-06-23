import { syncData } from './cloudEngine.js';
import { jest } from '@jest/globals';

describe('Auditoría de Calidad (Multi-Testing QA) - SENA CBA', () => {

  test('Prueba 1: Debe validar que el esquema devuelto sea exactamente el esperado', async () => {
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

    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    
    const objetoDevuelto = data[0];
    const llavesEsperadas = ['id', 'device_os', 'payload', 'status_code'];
    expect(Object.keys(objetoDevuelto).sort()).toEqual(llavesEsperadas.sort());

    expect(objetoDevuelto).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        device_os: expect.any(String),
        payload: expect.objectContaining({
          bateria: expect.any(Number),
          red: expect.any(String)
        }),
        status_code: expect.any(Number)
      })
    );
  });

  test('Prueba 2: Debe atrapar el error 401 de PostgREST y retornar [] sin crashear la app', async () => {
    const mockSupabase401 = {
      from: () => ({
        insert: () => ({
          select: async () => ({
            data: null,
            error: { message: 'Invalid API Key', code: 'PGRST301' }
          })
        })
      })
    };

    const result = await syncData(mockSupabase401);
    expect(result).toEqual([]);
  });

  test('Prueba 3: Debe fallar si la consulta a Supabase tarda más de 1500ms', async () => {
    jest.setTimeout(1500);

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
  });

});