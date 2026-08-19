(() => {
function utf8Length(value) {
  return new TextEncoder().encode(value).length;
}

function field(id, value) {
  const text = String(value);
  return `${id}${String(utf8Length(text)).padStart(2, "0")}${text}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function normalizePixKey(key, type) {
  const value = key.trim();
  if (type === "email") return value.toLowerCase();
  if (type === "phone") {
    const digits = value.replace(/\D/g, "").replace(/^55/, "");
    return `+55${digits}`;
  }
  if (type === "cpf" || type === "cnpj") return value.replace(/\D/g, "");
  return value;
}

function validatePixKey(key, type) {
  if (!key) return "Informe a chave Pix.";
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return "Informe um e-mail válido.";
  if (type === "phone" && !/^\+55\d{10,11}$/.test(key)) return "Informe um telefone brasileiro válido.";
  if (type === "cpf" && !/^\d{11}$/.test(key)) return "CPF deve conter 11 dígitos.";
  if (type === "cnpj" && !/^\d{14}$/.test(key)) return "CNPJ deve conter 14 dígitos.";
  if (type === "random" && !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(key)) return "Informe uma chave aleatória válida.";
  return "";
}

function sanitizePixText(value, maxBytes) {
  let result = "";
  for (const character of value.trim()) {
    if (utf8Length(result + character) > maxBytes) break;
    result += character;
  }
  return result;
}

function generatePixPayload({ key, description = "", amount, receiverName, receiverCity, txid = "***" }) {
  const normalizedAmount = Number(amount).toFixed(2);
  const merchantInfo = field("00", "br.gov.bcb.pix") + field("01", key) + (description ? field("02", sanitizePixText(description, 99)) : "");
  const payload = [
    field("00", "01"),
    field("26", merchantInfo),
    field("52", "0000"),
    field("53", "986"),
    field("54", normalizedAmount),
    field("58", "BR"),
    field("59", sanitizePixText(receiverName, 25)),
    field("60", sanitizePixText(receiverCity, 15)),
    field("62", field("05", sanitizePixText(txid || "***", 25))),
    "6304"
  ].join("");
  return payload + crc16(payload);
}

globalThis.Pix = { utf8Length, crc16, normalizePixKey, validatePixKey, sanitizePixText, generatePixPayload };
})();
