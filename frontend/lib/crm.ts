import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts';
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
 * HubSpot CRM Integration
 * Uses the official @hubspot/api-client SDK
 */
class HubSpotCRM implements CRMAdapter {
    private client: Client | null = null;
    private isConfigured: boolean = false;

    constructor() {
        const apiKey = process.env.HUBSPOT_API_KEY || '';

        if (apiKey) {
            this.client = new Client({ accessToken: apiKey });
            this.isConfigured = true;
            Logger.info('CRM: HubSpot integration initialized');
        } else {
            Logger.warn('CRM: HubSpot API Key not configured. CRM integration disabled.');
        }
    }

    /**
     * Create or update a contact in HubSpot
     */
    async createContact(data: ContactData): Promise<boolean> {
        if (!this.isConfigured || !this.client) {
            Logger.info('CRM: HubSpot not configured. Skipping contact sync.');
            return false;
        }

        try {
            Logger.info(`CRM: Creating/updating contact ${data.email} in HubSpot...`);

            // Prepare properties for HubSpot
            const properties: Record<string, string> = {
                email: data.email,
            };

            // Add optional properties
            if (data.firstname) properties.firstname = data.firstname;
            if (data.lastname) properties.lastname = data.lastname;
            if (data.phone) properties.phone = data.phone;
            if (data.company) properties.company = data.company;
            if (data.website) properties.website = data.website;
            if (data.lifecycleStage) properties.lifecyclestage = data.lifecycleStage;
            if (data.source) properties.hs_lead_source = data.source;

            // Search for existing contact by email
            const searchResponse = await this.client.crm.contacts.searchApi.doSearch({
                filterGroups: [{
                    filters: [{
                        propertyName: 'email',
                        operator: FilterOperatorEnum.Eq,
                        value: data.email,
                    }]
                }],
                properties: ['email', 'firstname', 'lastname'],
                limit: 1,
                after: undefined,
                sorts: [],
            });

            if (searchResponse.results && searchResponse.results.length > 0) {
                // Contact exists, update it
                const contactId = searchResponse.results[0].id;
                await this.client.crm.contacts.basicApi.update(contactId, {
                    properties,
                });
                Logger.info(`CRM: Successfully updated existing contact ${data.email} (ID: ${contactId})`);
            } else {
                // Contact doesn't exist, create new
                const createResponse = await this.client.crm.contacts.basicApi.create({
                    properties,
                });
                Logger.info(`CRM: Successfully created new contact ${data.email} (ID: ${createResponse.id})`);
            }

            return true;
        } catch (error: any) {
            // Log the error but don't throw - we don't want CRM failures to block form submissions
            Logger.error('CRM: HubSpot API error', {
                error: error.message,
                statusCode: error.statusCode,
                email: data.email,
            });
            return false;
        }
    }

    /**
     * Update an existing contact in HubSpot
     */
    async updateContact(email: string, data: Partial<ContactData>): Promise<boolean> {
        if (!this.isConfigured || !this.client) {
            return false;
        }

        try {
            // Search for contact by email
            const searchResponse = await this.client.crm.contacts.searchApi.doSearch({
                filterGroups: [{
                    filters: [{
                        propertyName: 'email',
                        operator: FilterOperatorEnum.Eq,
                        value: email,
                    }]
                }],
                properties: ['email'],
                limit: 1,
                after: undefined,
                sorts: [],
            });

            if (searchResponse.results && searchResponse.results.length > 0) {
                const contactId = searchResponse.results[0].id;

                // Prepare update properties
                const properties: Record<string, string> = {};
                if (data.firstname) properties.firstname = data.firstname;
                if (data.lastname) properties.lastname = data.lastname;
                if (data.phone) properties.phone = data.phone;
                if (data.company) properties.company = data.company;
                if (data.website) properties.website = data.website;
                if (data.lifecycleStage) properties.lifecyclestage = data.lifecycleStage;
                if (data.source) properties.hs_lead_source = data.source;

                await this.client.crm.contacts.basicApi.update(contactId, {
                    properties,
                });

                Logger.info(`CRM: Successfully updated contact ${email} (ID: ${contactId})`);
                return true;
            }

            Logger.warn(`CRM: Contact ${email} not found in HubSpot`);
            return false;
        } catch (error: any) {
            Logger.error('CRM: Failed to update contact', {
                error: error.message,
                email,
            });
            return false;
        }
    }
}

/**
 * CRM Factory
 * Allows switching providers easily (e.g. to Salesforce or Pipedrive)
 */
export const CRM = new HubSpotCRM();
