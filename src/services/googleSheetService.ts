import { google } from 'googleapis';

interface UserSheetData {
  name: string;
  id: string;
  phone: string;
  email: string;
}

class GoogleSheetService {
  private static instance: GoogleSheetService;
  private auth: any;
  private sheets: any;
  private readonly SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  private readonly SHEET_NAME = 'ControlAccesoWeb';

  private constructor() {
    if (!import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !import.meta.env.VITE_GOOGLE_PRIVATE_KEY || 
        !import.meta.env.VITE_GOOGLE_SHEET_ID) {
      throw new Error('Las credenciales de Google Sheets no están configuradas correctamente');
    }

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        "type": "service_account",
        "project_id": "alemanaserigrafia",
        "private_key": import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
        "client_email": import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        "universe_domain": "googleapis.com"
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  public static getInstance(): GoogleSheetService {
    if (!GoogleSheetService.instance) {
      GoogleSheetService.instance = new GoogleSheetService();
    }
    return GoogleSheetService.instance;
  }

  private async findUserRowByID(id: string): Promise<number | null> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.SPREADSHEET_ID,
        range: `${this.SHEET_NAME}!B:B`,
      });

      const rows = response.data.values;
      if (!rows) return null;

      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === id) {
          return i + 1; // Las filas en Google Sheets empiezan en 1
        }
      }

      return null;
    } catch (error) {
      console.error('Error buscando usuario:', error);
      throw new Error('Error al buscar usuario en la hoja de cálculo');
    }
  }

  public async saveUserData(userData: UserSheetData): Promise<{ success: boolean; message: string }> {
    try {
      const currentDate = new Date().toLocaleString('es-EC', { timeZone: 'America/Guayaquil' });
      const userRow = await this.findUserRowByID(userData.id);

      if (userRow) {
        // Actualizar usuario existente
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.SPREADSHEET_ID,
          range: `${this.SHEET_NAME}!A${userRow}:E${userRow}`,
          valueInputOption: 'RAW',
          resource: {
            values: [[userData.name, userData.id, userData.phone, userData.email, currentDate]],
          },
        });
        return { success: true, message: 'Datos actualizados correctamente' };
      } else {
        // Agregar nuevo usuario
        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.SPREADSHEET_ID,
          range: `${this.SHEET_NAME}!A:E`,
          valueInputOption: 'RAW',
          resource: {
            values: [[userData.name, userData.id, userData.phone, userData.email, currentDate]],
          },
        });
        return { success: true, message: 'Datos guardados correctamente' };
      }
    } catch (error) {
      console.error('Error guardando datos:', error);
      return { 
        success: false, 
        message: 'Error al guardar los datos. Por favor, inténtelo de nuevo más tarde.' 
      };
    }
  }
}

export default GoogleSheetService;
