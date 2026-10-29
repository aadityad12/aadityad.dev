export function EchoPath() {
  return (
    <svg className="echo-path" viewBox="0 0 440 168" role="img" aria-label="Two phones pass a weather alert over Bluetooth. The path through the cloud is broken." fontSize="14">
      <rect x="20" y="40" width="112" height="108" />
      <text x="76" y="90" textAnchor="middle">Phone A</text>
      <text x="76" y="112" textAnchor="middle">NWS alert</text>
      <path d="M156 58 C196 22, 254 22, 294 58" />
      <path d="M214 32 L236 54" />
      <text x="225" y="18" textAnchor="middle">cloud</text>
      <path d="M148 108 H292" />
      <text x="220" y="98" textAnchor="middle">BLE</text>
      <rect x="308" y="40" width="112" height="108" />
      <text x="364" y="90" textAnchor="middle">Phone B</text>
      <text x="364" y="112" textAnchor="middle">spoken</text>
    </svg>
  );
}
