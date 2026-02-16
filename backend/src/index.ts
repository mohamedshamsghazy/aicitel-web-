// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });

      if (role) {
        const permissionsToSet = [
          { action: 'api::job.job.find', role: role.id },
          { action: 'api::job.job.findOne', role: role.id },
          { action: 'api::faq.faq.find', role: role.id },
        ];

        for (const perm of permissionsToSet) {
          const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: perm });
          if (!existing) {
            await strapi.db.query('plugin::users-permissions.permission').create({ data: perm });
            strapi.log.info(`[Bootstrap] Added public permission: ${perm.action}`);
          }
        }
      }
    } catch (error) {
      strapi.log.error('[Bootstrap] Failed to seed permissions:', error);
    }
  },
};
