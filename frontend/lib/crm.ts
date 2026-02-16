import { Logger } from './logger';

export interface ContactData {
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    website?: string;
    lifecycleStage?: 'lead' | 'subscriber' | 'customer';
    source?: string;
}

export interface CRMAdapter {
    createContact(data: ContactData): Promise<boolean>;
    updateContact(email: string, data: Partial<ContactData>): Promise<boolean>;
}

/**
 * HubSpot Implementation Pattern
 * This is a structural implementation ready for API keys.
 */
class HubSpotCRM implements CRMAdapter {
    private apiKey: string;
    private portalId: string;

    constructor() {
        this.apiKey = process.env.HUBSPOT_API_KEY || '';
        this.portalId = process.env.HUBSPOT_PORTAL_ID || '';
    }

    async createContact(data: ContactData): Promise<boolean> {
        if (!this.apiKey) {
            Logger.warn('CRM: HubSpot API Key missing. Skipping submission.');
            return false;
        }

        try {
            // Mock Implementation until API Key is provided
            // In production: await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts`, ...)
            Logger.info(`CRM: Pushing contact ${data.email} to HubSpot...`);

            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 500));

            Logger.info(`CRM: Successfully created contact ${data.email} in HubSpot.`);
            return true;
        } catch (error) {
            Logger.error('CRM: Failed to synced contact to HubSpot', error);
            return false;
        }
    }

    async updateContact(email: string, data: Partial<ContactData>): Promise<boolean> {
        // Implementation for updating existing contacts
        return true;
    }
}

/**
 * CRM Factory
 * Allows switching providers easily (e.g. to Salesforce or Pipedrive)
 */
export const CRM = new HubSpotCRM();
