import crypto from "crypto";

const SECRET = "CHATME-REST-API";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (password: string) => {
  return crypto.createHmac("sha256", password).update(SECRET).digest("hex");
};
