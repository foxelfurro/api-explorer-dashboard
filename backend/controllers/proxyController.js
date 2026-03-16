// Lógica de las peticiones

const proxyRequest = async (req, res) => {
  const { endpoint, method = 'GET', headers = {}, body } = req.body;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint is required' });
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
};

module.exports = { proxyRequest };
