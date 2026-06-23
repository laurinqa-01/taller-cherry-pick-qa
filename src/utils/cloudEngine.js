

export const syncData = async (customClient) => {
  try {

    const { data, error } = await customClient
      .from('telemetry_logs')
      .insert([
        { 
          device_os: 'Android', 
          payload: { bateria: 80, red: '4G' }, // <-- El objeto JSON anidado requerido
          status_code: 201
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
 
    return [];
  }
};