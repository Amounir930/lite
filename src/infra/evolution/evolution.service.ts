/**
 * 🚀 Evolution API Connector (Senior Implementation)
 * This service handles all communication with the Evolution API instance.
 */

const EVOLUTION_BASE_URL = process.env.NEXT_PUBLIC_EVOLUTION_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || "global_key";

export class EvolutionService {
  /**
   * 🏗️ Create a new WhatsApp Instance
   */
  static async createInstance(instanceName: string) {
    try {
      const response = await fetch(`${EVOLUTION_BASE_URL}/instance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_KEY
        },
        body: JSON.stringify({
          instanceName,
          token: "", // Optional custom token
          qrcode: true,
          number: ""
        })
      });

      return await response.json();
    } catch (error) {
      console.error("Evolution Create Instance Error:", error);
      return { error: "Failed to connect to Evolution API" };
    }
  }

  /**
   * 🔍 Get Instance Status & QR Code
   */
  static async getInstanceStatus(instanceName: string) {
    try {
      const response = await fetch(`${EVOLUTION_BASE_URL}/instance/connectionState/${instanceName}`, {
        method: "GET",
        headers: { "apikey": EVOLUTION_API_KEY }
      });

      return await response.json();
    } catch (error) {
      return { error: "Failed to fetch connection status" };
    }
  }

  /**
   * 📤 Send a Text Message
   */
  static async sendMessage(instanceName: string, number: string, text: string) {
    try {
      const response = await fetch(`${EVOLUTION_BASE_URL}/message/sendText/${instanceName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_KEY
        },
        body: JSON.stringify({
          number,
          options: { delay: 1200, presence: "composing", linkPreview: false },
          textMessage: { text }
        })
      });

      return await response.json();
    } catch (error) {
      return { error: "Message delivery failed" };
    }
  }

  /**
   * 🗑️ Delete/Logout Instance
   */
  static async logoutInstance(instanceName: string) {
    try {
      const response = await fetch(`${EVOLUTION_BASE_URL}/instance/logout/${instanceName}`, {
        method: "DELETE",
        headers: { "apikey": EVOLUTION_API_KEY }
      });
      return await response.json();
    } catch (error) {
      return { error: "Logout failed" };
    }
  }
}
