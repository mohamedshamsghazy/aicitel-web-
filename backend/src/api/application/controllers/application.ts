import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
    async export(ctx) {
        try {
            const applications = await strapi.entityService.findMany('api::application.application', {
                populate: ['linkedJob'],
            });

            const csvHeader = 'Full Name,Email,Phone,Job,Stage,Date\n';
            const csvRows = (applications as any[]).map((app: any) => {
                const jobTitle = app.linkedJob ? app.linkedJob.title : 'N/A';
                // Escape quotes
                const safe = (str: string) => str ? `"${str.replace(/"/g, '""')}"` : '""';
                return `${safe(app.fullName)},${safe(app.email)},${safe(app.phone)},${safe(jobTitle)},${safe(app.stage)},"${app.createdAt}"`;
            }).join('\n');

            ctx.set('Content-Type', 'text/csv');
            ctx.set('Content-Disposition', 'attachment; filename="applications.csv"');
            ctx.body = csvHeader + csvRows;
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}));
