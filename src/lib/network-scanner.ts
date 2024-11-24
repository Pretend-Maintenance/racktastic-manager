// Simple utility to validate IP addresses
const isValidIp = (ip: string): boolean => {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;
  return ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);
};

// Convert IP to number for range calculations
const ipToNumber = (ip: string): number => {
  return ip.split('.').reduce((total, octet) => (total << 8) + parseInt(octet), 0) >>> 0;
};

// Convert number back to IP
const numberToIp = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
};

// Simulate a network scan (in a real implementation, this would use actual network protocols)
export const scanNetwork = async (
  startIp: string, 
  endIp: string,
  onProgress?: (progress: string) => void
) => {
  console.log("Starting network scan simulation");
  
  if (!isValidIp(startIp) || !isValidIp(endIp)) {
    throw new Error("Invalid IP address format");
  }

  const start = ipToNumber(startIp);
  const end = ipToNumber(endIp);

  if (start > end) {
    throw new Error("Start IP must be less than or equal to End IP");
  }

  const results: Array<{ip: string; status: string; deviceInfo?: any}> = [];
  const total = end - start + 1;
  
  // Simulate scanning (in reality, this would use SNMP or other protocols)
  for (let i = start; i <= end; i++) {
    const currentIp = numberToIp(i);
    const progress = Math.round(((i - start) / total) * 100);
    
    onProgress?.(`Scanning ${currentIp} (${progress}% complete)`);
    console.log("Scanning IP:", currentIp);
    
    // Simulate random discoveries (this is where real SNMP queries would go)
    if (Math.random() > 0.8) {
      const deviceTypes = ["switch", "router", "server", "storage"];
      const manufacturers = ["Cisco", "HP", "Dell", "Juniper"];
      const deviceInfo = {
        type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        model: `Model-${Math.floor(Math.random() * 1000)}`,
        firmware: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        serialNumber: `SN${Math.floor(Math.random() * 100000)}`,
      };
      
      results.push({
        ip: currentIp,
        status: "active",
        deviceInfo
      });
      
      onProgress?.(`Found active device at ${currentIp}`);
      console.log("Device found:", deviceInfo);
    }
    
    // Add small delay to prevent UI freezing
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log("Scan completed, found", results.length, "devices");
  return results;
};