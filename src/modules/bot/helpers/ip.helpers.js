export async function obtenerIpPublica() {
    const res = await fetch('https://ifconfig.me/ip');
    return await res.text();
};
